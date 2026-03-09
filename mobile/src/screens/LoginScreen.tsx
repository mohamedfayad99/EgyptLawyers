import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { loginLawyer, getLawyerProfile } from '../lib/services';
import { setToken } from '../lib/authToken';

type Props = NativeStackScreenProps<any, 'Login'>;

function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/\s+/g, '');
  const egRegex = /^(\+2|2)?01[0125][0-9]{8}$/;
  return egRegex.test(cleaned);
}

function normalizeEgyptianPhone(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '');
  if (trimmed.startsWith('+2')) return trimmed;
  if (trimmed.startsWith('2') && trimmed.length >= 11) return '+' + trimmed;
  if (trimmed.startsWith('01') && trimmed.length === 11) return '+2' + trimmed;
  return '+2' + trimmed;
}

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!whatsapp.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEgyptianPhone(whatsapp)) {
      setError('Please enter a valid Egyptian WhatsApp number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedWhatsapp = normalizeEgyptianPhone(whatsapp);
      const response = await loginLawyer(normalizedWhatsapp, password);
      
      await setToken(response.token);
      const profile = await getLawyerProfile();
      await signIn(response.token, profile);
    } catch (err: any) {
      const msg = err.message || '';
      
      if (msg.includes('pending')) {
        setError('Your account is still pending approval. We will notify you once it is reviewed.');
      } else if (msg.includes('rejected')) {
        setError('Your application has been rejected. Please contact support for more information.');
      } else if (msg.includes('suspended')) {
        setError('Your account has been suspended. Please contact support.');
      } else {
        setError('Invalid WhatsApp number or password. Please try again.');
      }
      
      await setToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer} 
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
               <Text style={styles.logoText}>⚖️</Text>
            </View>
            <Text style={styles.title}>EgyptLawyers</Text>
            <Text style={styles.subtitle}>Welcome counselor, please sign in</Text>
          </View>

          {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>WhatsApp Number</Text>
            <TextInput
              placeholder='e.g. 01012345678'
              placeholderTextColor="#ADB5BD"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType='phone-pad'
              editable={!loading}
            />

            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              placeholder='••••••••'
              placeholderTextColor="#ADB5BD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <Button
              title={loading ? 'Checking...' : 'Sign In'}
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 10 }}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                 <Text style={styles.linkText}>Register now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  logoText: {
    fontSize: 44,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#868E96',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  fieldLabel: {
    color: '#495057',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#868E96',
    fontSize: 14,
  },
  linkText: {
    color: '#5C7CFA',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
