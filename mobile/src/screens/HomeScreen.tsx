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
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Loading, ErrorMessage } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { getHelpPosts, getNotifications } from '../lib/services';
import { HelpPost } from '../lib/types';
import { BASE_URL } from '../lib/config';
import { useTheme } from '../lib/ThemeContext';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;
  const { profile } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  
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
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatarMini, { backgroundColor: colors.background }]}>
              {item.lawyerProfileImageUrl ? (
                <Image 
                  source={{ uri: `${BASE_URL}${item.lawyerProfileImageUrl}` }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <Text style={[styles.avatarText, { color: colors.text }]}>{item.lawyerName?.charAt(0) || '?'}</Text>
              )}
            </View>
            <View>
              <Text style={[styles.lawyerName, { color: colors.text, fontSize: isSmallDevice ? 14 : 16 }]}>{item.lawyerName}</Text>
              <Text style={[styles.postDate, { color: colors.textDim }]}>{new Date(item.createdAtUtc).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.locationText, { color: colors.textDim, fontSize: isSmallDevice ? 12 : 13, marginBottom: 2 }]} numberOfLines={1}>
              📍 {item.cityName}
            </Text>
            <Text style={[styles.courtName, { color: colors.primary, fontSize: isSmallDevice ? 12 : 13, marginBottom: 0 }]} numberOfLines={1}>
              ⚖️ {item.courtName}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text, opacity: 0.8 }]} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
             <Text style={[styles.replyCountText, { color: colors.textDim }]}>💬 {item.replyCount || 0} Replies</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) return <Loading message='Loading feed...' />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.header, { 
        backgroundColor: colors.surface, 
        borderBottomColor: colors.border, 
        paddingHorizontal: isSmallDevice ? 15 : 20,
        paddingBottom: isSmallDevice ? 15 : 20,
        paddingTop: isSmallDevice ? 25 : 30 // Increased spacing from top
      }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: isSmallDevice ? 16 : 18 }]}>EgyptLawyers</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            
            <TouchableOpacity 
              style={{ marginRight: isSmallDevice ? 10 : 15 }} 
              onPress={toggleTheme}
            >
               <MaterialCommunityIcons 
                 name={isDark ? "weather-sunny" : "weather-night"} 
                 size={isSmallDevice ? 24 : 28} 
                 color={isDark ? "#FFD43B" : colors.text} 
               />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.notifButton} 
              onPress={() => navigation.navigate('Notifications')}
            >
               <Ionicons 
                 name="notifications-outline" 
                 size={isSmallDevice ? 24 : 28} 
                 color={colors.text} 
               />
               {hasUnread && <View style={[styles.notifBadge, { borderColor: colors.surface }]} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ marginLeft: isSmallDevice ? 10 : 15 }} 
              onPress={() => navigation.navigate('ProfileTab')}
            >
               {profile?.profileImageUrl ? (
                 <Image 
                    source={{ uri: `${BASE_URL}${profile.profileImageUrl}` }} 
                    style={{ width: isSmallDevice ? 32 : 36, height: isSmallDevice ? 32 : 36, borderRadius: isSmallDevice ? 16 : 18 }} 
                  />
               ) : (
                 <View style={{ width: isSmallDevice ? 32 : 36, height: isSmallDevice ? 32 : 36, borderRadius: isSmallDevice ? 16 : 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: isSmallDevice ? 14 : 16 }}>👤</Text>
                 </View>
               )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.searchContainer, { backgroundColor: colors.background, height: isSmallDevice ? 40 : 45 }]}>
          <Ionicons name="search" size={isSmallDevice ? 18 : 20} color={colors.textDim} style={{ marginRight: 10 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search lawyers, cities, courts..."
            placeholderTextColor={colors.textDim}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textDim }]}>{error || 'No requests found'}</Text>
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
  },
  header: {
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontWeight: 'bold',
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
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
    fontWeight: 'bold',
    fontSize: 18,
  },
  lawyerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
  },
  locationBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  courtName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  replyCountText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
  },
});
