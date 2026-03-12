import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../lib/AuthContext';
import { Loading } from '../components/common';
import { BASE_URL } from '../lib/config';
import { useTheme } from '../lib/ThemeContext';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import the shared navigation ref
import { navigationRef } from './NavigationRef';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// App Screens
import { HomeScreen } from '../screens/HomeScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { PostDetailsScreen } from '../screens/PostDetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Back',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='PostDetails' component={PostDetailsScreen} options={{ title: 'Post Details' }} />
      <Stack.Screen name='CreatePost' component={CreatePostScreen} options={{ title: 'Create Post' }} />
      <Stack.Screen name='Notifications' component={NotificationsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name='Profile' component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}

function AddPostStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name='CreatePost' component={CreatePostScreen} options={{ title: 'Create Post' }} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name='HomeTab'
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='AddPostTab'
        component={AddPostStack}
        options={{
          tabBarIcon: ({ size }: { color: string; size: number }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -5,
              shadowColor: colors.primary,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 4,
            }}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='ProfileTab'
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            const { profile } = useAuth();
            if (profile?.profileImageUrl) {
              return (
                <View style={{ width: size + 4, height: size + 4, borderRadius: (size + 4) / 2, overflow: 'hidden', borderWidth: 1, borderColor: color }}>
                   <Image 
                    source={{ uri: `${BASE_URL}${profile.profileImageUrl}` }} 
                    style={{ width: '100%', height: '100%' }} 
                  />
                </View>
              );
            }
            return <FontAwesome name="user" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading, isSignedIn } = useAuth();
  const { isDark, colors } = useTheme();

  if (isLoading) {
    return <Loading message='Loading...' />;
  }

  // Set standard navigation theme to match ours
  const MyDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };
  
  const MyDarkTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={isDark ? MyDarkTheme : MyDefaultTheme}>
      {isSignedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
