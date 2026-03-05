import { Platform } from 'react-native';

function defaultBaseUrl() {
  // Android emulator cannot reach localhost of your PC — use 10.0.2.2
  if (Platform.OS === 'android') return 'http://10.0.2.2:5215/api';
  return 'http://localhost:5215/api';
}

const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = envUrl || defaultBaseUrl();

// Debug log — shows in Metro console so we can confirm the URL at startup
if (__DEV__) {
  console.log('[Config] EXPO_PUBLIC_API_BASE_URL env =', envUrl ?? '(not set)');
  console.log('[Config] API_BASE_URL =', API_BASE_URL);
}
