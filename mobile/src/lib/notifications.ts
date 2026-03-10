import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerDevice } from './services';

/**
 * Returns true when the app is running inside Expo Go.
 * Expo Go dropped remote push notification support in SDK 53.
 */
function isRunningInExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

/**
 * Lazy-load expo-notifications only if NOT in Expo Go.
 * This prevents the SDK 53+ error warning from showing up in Expo Go.
 */
const getExpoNotifications = () => {
  if (isRunningInExpoGo() || Platform.OS === 'web') return null;
  try {
    return require('expo-notifications');
  } catch (e) {
    return null;
  }
};

// Configure how notifications behave when the app is in the foreground
const Notifications = getExpoNotifications();
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Requests notification permissions from the OS, obtains the Expo push token,
 * and registers it with our backend so the server can target this device.
 *
 * ⚠️  This is a no-op when running inside Expo Go (SDK 53+).
 */
export async function registerForPushNotifications(): Promise<void> {
  const Notifications = getExpoNotifications();
  if (!Notifications) {
    if (isRunningInExpoGo() && Platform.OS !== 'web') {
      console.log('[Push] Running in Expo Go — remote push notifications are disabled to avoid SDK errors.');
    }
    return;
  }

  try {
    // 1. Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Push] Permission not granted by user');
      return;
    }

    // 2. Get the Expo push token for this device
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;

    // 3. Register the token with our backend
    await registerDevice(expoPushToken, Platform.OS);

    console.log('[Push] Registered device token:', expoPushToken);
  } catch (err) {
    // Non-blocking – never throw to callers
    console.warn('[Push] Failed to register for push notifications:', err);
  }
}

/**
 * Adds a listener that fires when the user TAPS a notification.
 * Returns an unsubscribe function — call it when cleaning up.
 */
export function addNotificationResponseListener(
  onTap: (postId: string) => void,
): () => void {
  const Notifications = getExpoNotifications();
  if (!Notifications) return () => {};
  
  const sub = Notifications.addNotificationResponseReceivedListener((response: any) => {
    const data = response.notification.request.content.data as any;
    if (data?.postId) {
      onTap(String(data.postId));
    }
  });
  return () => sub.remove();
}
