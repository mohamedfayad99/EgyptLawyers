import * as SecureStore from 'expo-secure-store';

const KEY = 'lawyer_token_v1';
let memToken: string | null | undefined;

export async function getToken(): Promise<string | null> {
  if (memToken !== undefined) return memToken;
  memToken = (await SecureStore.getItemAsync(KEY)) ?? null;
  return memToken;
}

export async function setToken(token: string): Promise<void> {
  memToken = token;
  await SecureStore.setItemAsync(KEY, token);
}

export async function clearToken(): Promise<void> {
  memToken = null;
  await SecureStore.deleteItemAsync(KEY);
}
