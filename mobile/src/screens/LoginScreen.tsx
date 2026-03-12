import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  useWindowDimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { loginLawyer, getLawyerProfile } from '../lib/services';
import { setToken } from '../lib/authToken';
import { useTheme } from '../lib/ThemeContext';

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
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.contentContainer, { paddingTop: isSmallDevice ? 40 : 60 }]} 
          keyboardShouldPersistTaps='handled'
        >
          <View style={[styles.header, { marginBottom: isSmallDevice ? 30 : 40 }]}>
            <View style={[styles.logoCircle, { backgroundColor: colors.surface, borderColor: colors.border, width: isSmallDevice ? 70 : 90, height: isSmallDevice ? 70 : 90 }]}>
               <Text style={{ fontSize: isSmallDevice ? 32 : 44 }}>⚖️</Text>
            </View>
            <Text style={[styles.title, { color: colors.text, fontSize: isSmallDevice ? 26 : 32 }]}>EgyptLawyers</Text>
            <Text style={[styles.subtitle, { color: colors.textDim }]}>Welcome counselor, please sign in</Text>
          </View>

          {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border, padding: isSmallDevice ? 20 : 24 }]}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>WhatsApp Number</Text>
            <TextInput
              placeholder='e.g. 01012345678'
              placeholderTextColor={colors.textDim}
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType='phone-pad'
              editable={!loading}
            />

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
            <TextInput
              placeholder='••••••••'
              placeholderTextColor={colors.textDim}
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
              <Text style={[styles.footerText, { color: colors.textDim }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                 <Text style={[styles.linkText, { color: colors.primary }]}>Register now</Text>
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
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
  },
  logoCircle: {
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  fieldLabel: {
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
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
