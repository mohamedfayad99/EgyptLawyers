import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Loading, ErrorMessage } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { getHelpPosts, getNotifications } from '../lib/services';
import { HelpPost } from '../lib/types';
import { BASE_URL } from '../lib/config';

type Props = NativeStackScreenProps<any, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<HelpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    loadPosts();
    checkNotifications();
  }, []);

  const loadPosts = async () => {
    try {
      setError('');
      const postsList = await getHelpPosts();
      setPosts(postsList);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const checkNotifications = async () => {
    try {
      const data = await getNotifications();
      setHasUnread(data.some(n => !n.isRead));
    } catch { /* ignore */ }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkNotifications();
    loadPosts().finally(() => setRefreshing(false));
  }, []);

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetails', { id: postId });
  };

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.cityName?.toLowerCase().includes(query) ||
      post.courtName?.toLowerCase().includes(query)
    );
  });

  const renderPostItem = ({ item }: { item: HelpPost }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatarMini}>
              {item.lawyerProfileImageUrl ? (
                <Image 
                  source={{ uri: `${BASE_URL}${item.lawyerProfileImageUrl}` }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <Text style={styles.avatarText}>{item.lawyerName?.charAt(0) || '?'}</Text>
              )}
            </View>
            <View>
              <Text style={styles.lawyerName}>{item.lawyerName}</Text>
              <Text style={styles.postDate}>{new Date(item.createdAtUtc).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>📍 {item.cityName}</Text>
          </View>
        </View>

        <Text style={styles.courtName}>{item.courtName}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
             <Text style={styles.replyCountText}>💬 {item.replyCount || 0} Replies</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const { profile } = useAuth();

  if (loading && !refreshing) return <Loading message='Loading feed...' />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>EgyptLawyers</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              style={styles.notifButton} 
              onPress={() => navigation.navigate('Notifications')}
            >
               <Text style={{ fontSize: 24 }}>🔔</Text>
               {hasUnread && <View style={styles.notifBadge} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ marginLeft: 15 }} 
              onPress={() => navigation.navigate('ProfileTab')}
            >
               {profile?.profileImageUrl ? (
                 <Image 
                    source={{ uri: `${BASE_URL}${profile.profileImageUrl}` }} 
                    style={{ width: 36, height: 36, borderRadius: 18 }} 
                  />
               ) : (
                 <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9ECEF', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16 }}>👤</Text>
                 </View>
               )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search lawyers, cities, courts..."
            placeholderTextColor="#AAB2C1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5C7CFA" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{error || 'No requests found'}</Text>
            {error ? <ErrorMessage message={error} onRetry={loadPosts} /> : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  notifButton: {
    padding: 5,
  },
  notifBadge: {
    position: 'absolute',
    right: 5,
    top: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#1E1E1E',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 18,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  postDate: {
    fontSize: 12,
    color: '#868E96',
  },
  locationBadge: {
    backgroundColor: '#E7F5FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  locationText: {
    color: '#228BE6',
    fontSize: 11,
    fontWeight: '600',
  },
  courtName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5C7CFA',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  replyCountText: {
    color: '#868E96',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#868E96',
    fontSize: 16,
  },
});
