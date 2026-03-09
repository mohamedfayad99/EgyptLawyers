import { createNavigationContainerRef } from '@react-navigation/native';

// Global navigation ref shared with App.tsx and RootNavigator.tsx
// This allows navigating to a specific post when the user taps a push notification
export const navigationRef = createNavigationContainerRef<any>();
