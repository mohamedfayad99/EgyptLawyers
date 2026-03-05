import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Loading, ErrorMessage } from '../components/common';
import { getHelpPosts } from '../lib/services';
import { HelpPost } from '../lib/types';

type Props = NativeStackScreenProps<any, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<HelpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setError('');
      const postsList = await getHelpPosts();
      setPosts(postsList);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false));
  }, []);

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetails', { postId });
  };

  if (loading) {
    return <Loading message='Loading posts...' />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadPosts} />;
  }

  const statusLabel = (status: string | number) => {
    if (status === 0 || status === 'Open') return 'Open';
    if (status === 1 || status === 'Closed') return 'Closed';
    return String(status);
  };

  const renderPostItem = ({ item }: { item: HelpPost }) => {
    const createdDate = new Date(item.createdAtUtc).toLocaleDateString('en-GB');
    const description =
      item.description.substring(0, 100) +
      (item.description.length > 100 ? '...' : '');

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.postHeader}>
          <View style={styles.courtBadge}>
            <Text style={styles.courtIcon}>⚖️</Text>
            <Text style={styles.postCourt} numberOfLines={1}>
              {item.courtName || `Court #${item.courtId}`}
            </Text>
          </View>
          <Text style={styles.postDate}>{createdDate}</Text>
        </View>

        {item.cityName ? (
          <View style={styles.cityRow}>
            <Text style={styles.cityIcon}>📍</Text>
            <Text style={styles.cityName}>{item.cityName}</Text>
          </View>
        ) : null}

        <Text style={styles.postDescription} numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.postFooter}>
          <View style={styles.footerLeft}>
            {item.lawyerName ? (
              <Text style={styles.lawyerName}>👤 {item.lawyerName}</Text>
            ) : null}
            {item.replyCount !== undefined ? (
              <Text style={styles.replyCount}>
                💬 {item.replyCount} {item.replyCount === 1 ? 'reply' : 'replies'}
              </Text>
            ) : null}
          </View>
          <View style={[styles.statusBadge,
            (item.status === 0 || item.status === 'Open') ? styles.statusOpen : styles.statusClosed
          ]}>
            <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚖️ Help Posts Feed</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.createButtonText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to request help!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  createButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  courtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  courtIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  postCourt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066cc',
    flex: 1,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  cityName: {
    fontSize: 13,
    color: '#666',
  },
  postDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
    marginRight: 8,
  },
  lawyerName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  replyCount: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#e8f5e9',
  },
  statusClosed: {
    backgroundColor: '#fce4ec',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
