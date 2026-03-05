import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { AuthProvider } from './src/lib/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { addNotificationResponseListener } from './src/lib/notifications';

// Global navigation ref shared with RootNavigator
// This allows navigating to a specific post when the user taps a push notification
export const navigationRef = createNavigationContainerRef<any>();

export default function App() {
  useEffect(() => {
    // Navigate to the correct post when the user taps a push notification
    const unsub = addNotificationResponseListener((postId: string) => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.navigate({ name: 'HomeTab' }),
        );
        navigationRef.dispatch(
          CommonActions.navigate({ name: 'PostDetails', params: { postId } }),
        );
      }
    });

    return unsub;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style='auto' />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
