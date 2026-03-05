import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getToken, setToken, clearToken } from './authToken';
import { LawyerProfile } from './types';
import { getLawyerProfile } from './services';

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
