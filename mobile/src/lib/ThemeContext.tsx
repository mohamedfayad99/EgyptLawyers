import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textDim: string;
  primary: string;
  secondary: string;
  border: string;
  inputBg: string;
  cardBg: string;
  error: string;
  errorBg: string;
  success: string;
  accent: string;
}

export const LightTheme: ThemeColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1E1E1E',
  textDim: '#868E96',
  primary: '#5C7CFA',
  secondary: '#FFFFFF',
  border: '#E9ECEF',
  inputBg: '#F8F9FA',
  cardBg: '#FFFFFF',
  error: '#FF6B6B',
  errorBg: '#FFF5F5',
  success: '#51CF66',
  accent: '#748FFC',
};

export const DarkTheme: ThemeColors = {
  background: '#0a0a0a',
  surface: '#1A1B1E',
  text: '#E9ECEF',
  textDim: '#ADB5BD',
  primary: '#5C7CFA',
  secondary: '#121212',
  border: '#2C2E33',
  inputBg: '#1A1B1E',
  cardBg: '#121212',
  error: '#FF8787',
  errorBg: '#2C1B1B',
  success: '#69DB7C',
  accent: '#748FFC',
};

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = 'user-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    // Load theme from storage
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        }
      } catch (e) {}
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await SecureStore.setItemAsync(THEME_KEY, newTheme);
    } catch (e) {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    colors: theme === 'dark' ? DarkTheme : LightTheme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
