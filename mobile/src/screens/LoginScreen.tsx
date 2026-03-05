import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { loginLawyer, getLawyerProfile } from '../lib/services';
import { setToken } from '../lib/authToken';

type Props = NativeStackScreenProps<any, 'Login'>;

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

    setLoading(true);
    setError('');

    try {
      const response = await loginLawyer(whatsapp, password);
      // Store the token FIRST so the profile request is authenticated
      await setToken(response.token);
      const profile = await getLawyerProfile();
      await signIn(response.token, profile);
    } catch (err: any) {
      const msg: string = err.message || '';
      if (
        msg.toLowerCase().includes('401') ||
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('login failed')
      ) {
        setError(
          'Login failed. Your account may be pending admin approval, or your credentials are incorrect.'
        );
      } else if (
        msg.toLowerCase().includes('403') ||
        msg.toLowerCase().includes('forbidden')
      ) {
        setError('Your account has been suspended. Please contact support.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back to EgyptLawyers Network</Text>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      <TextInput
        placeholder='WhatsApp Number'
        value={whatsapp}
        onChangeText={setWhatsapp}
        editable={!loading}
      />

      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        loading={loading}
      />

      <View style={styles.registerLink}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <Text
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          Register
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerButton: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
});
