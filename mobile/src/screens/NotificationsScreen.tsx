import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Loading, ErrorMessage } from '../components/common';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../lib/services';
import { AppNotification } from '../lib/types';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<any, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(true);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handlePress = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
    navigation.navigate('PostDetails', { id: notification.postId });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const renderRightActions = (id: string, progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => handleDelete(id)} style={styles.deleteAction}>
        <Animated.Text style={[styles.deleteIcon, { transform: [{ scale }] }]}>
          🗑️
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return <Loading message="Loading notifications..." />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5C7CFA" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔔</Text>
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={(progress, dragX) => renderRightActions(item.id, progress, dragX)}
                friction={2}
              >
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.replierName}>{item.replierName}</Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.postContext} numberOfLines={1}>
                    Request: {item.postDescription}
                  </Text>
                  <Text style={styles.time}>{new Date(item.createdAtUtc).toLocaleString()}</Text>
                </TouchableOpacity>
              </Swipeable>
            )
          }
          />
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  unreadCard: {
    backgroundColor: '#F1F3F5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  replierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  message: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  postContext: {
    fontSize: 12,
    color: '#868E96',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: '#ADB5BD',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#868E96',
  },
  deleteAction: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 80,
    height: '100%',
    paddingHorizontal: 20,
  },
  deleteIcon: {
    fontSize: 24,
  },
});
