import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerDevice } from './services';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Returns true when the app is running inside Expo Go.
 * SDK 53+ Expo Go does not support remote push notifications on Android.
 */
function isRunningInExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export async function registerForPushNotifications(): Promise<string | undefined> {
  if (Platform.OS === 'web') return;

  if (!Device.isDevice) {
    console.log('[Push] Must use physical device for Push Notifications');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Push] Failed to get push token for push notification!');
      return;
    }

    // Project ID is required for Expo Push Token in SDK 49+
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.warn('[Push] Project ID not found in app.json. Please ensure you have run "eas build:configure".');
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('[Push] Registered device token:', token);

    // Register with backend
    await registerDevice(token, Platform.OS);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (e) {
    console.warn('[Push] Error during push notification registration:', e);
    return;
  }
}

/**
 * Adds a listener that fires when the user TAPS a notification.
 * Returns an unsubscribe function.
 */
export function addNotificationResponseListener(
  onTap: (postId: string) => void,
): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as any;
    if (data?.postId) {
      onTap(String(data.postId));
    }
  });

  return () => {
    sub.remove();
  };
}
