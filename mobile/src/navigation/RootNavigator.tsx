import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { Loading } from '../components/common';
import { BASE_URL } from '../lib/config';

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
import { getNotifications } from '../lib/services';

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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Back',
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1E1E1E',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name='Profile' component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}

function AddPostStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1E1E1E',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name='CreatePost' component={CreatePostScreen} options={{ title: 'Create Post' }} />
    </Stack.Navigator>
  );
}



function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#5C7CFA',
        tabBarInactiveTintColor: '#AAB2C1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          height: 80,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name='HomeTab'
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name='AddPostTab'
        component={AddPostStack}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#5C7CFA',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -5,
            }}>
              <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='ProfileTab'
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
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
            return <Text style={{ fontSize: size, color }}>👤</Text>;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return <Loading message='Loading...' />;
  }

  return (
    // The shared ref lets App.tsx drive navigation from the notification listener
    <NavigationContainer ref={navigationRef}>
      {isSignedIn ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
