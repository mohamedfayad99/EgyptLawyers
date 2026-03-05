import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getToken, clearToken, setToken } from './authToken';
import { LawyerProfile } from './types';
import { getLawyerProfile } from './services';
import { registerForPushNotifications } from './notifications';

interface AuthContextType {
  isLoading: boolean;
  isSignedIn: boolean;
  profile: LawyerProfile | null;
  signIn: (token: string, profile: LawyerProfile) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profile, setProfile] = useState<LawyerProfile | null>(null);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const token = await getToken();
      if (token) {
        const profileData = await getLawyerProfile();
        setProfile(profileData);
        setIsSignedIn(true);
        // Re-register push token in case the token rotated or a new device
        registerForPushNotifications();
      }
    } catch (e) {
      await clearToken();
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (token: string, profileData: LawyerProfile) => {
    await setToken(token);
    setProfile(profileData);
    setIsSignedIn(true);
    // Register push token immediately after a successful login
    registerForPushNotifications();
  };

  const signOut = async () => {
    await clearToken();
    setProfile(null);
    setIsSignedIn(false);
  };

  const refreshProfile = async () => {
    try {
      const profileData = await getLawyerProfile();
      setProfile(profileData);
    } catch (e) {
      await clearToken();
      setIsSignedIn(false);
    }
  };

  const value = {
    isLoading,
    isSignedIn,
    profile,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
