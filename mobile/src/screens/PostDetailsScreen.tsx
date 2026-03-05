import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { getHelpPostDetails, replyToHelpPost, getLawyerById } from '../lib/services';
import { HelpPostDetails, HelpPostReply } from '../lib/types';
import { useAuth } from '../lib/AuthContext';

type Props = NativeStackScreenProps<any, 'PostDetails'>;

export function PostDetailsScreen({ route, navigation }: Props) {
  const { postId } = route.params as { postId: string };
  const { profile } = useAuth();
  const [post, setPost] = useState<HelpPostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  const loadPostDetails = async () => {
    try {
      setError('');
      const postData = await getHelpPostDetails(postId);
      setPost(postData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    setReplyLoading(true);
    setError('');

    try {
      await replyToHelpPost(postId, replyMessage.trim());
      setReplyMessage('');
      await loadPostDetails();
      Alert.alert('Success', 'Reply posted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const openWhatsApp = (whatsappNumber: string, lawyerName?: string) => {
    const phone = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${lawyerName || ''}, I saw your reply on EgyptLawyers network and would like to discuss further.`
    );
    const url = `https://wa.me/${phone}?text=${message}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device.');
        }
      })
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  const viewLawyerProfile = async (lawyerId: string, lawyerName?: string) => {
    try {
      const lawyerProfile = await getLawyerById(lawyerId);
      Alert.alert(
        `👤 ${lawyerProfile.fullName}`,
        [
          lawyerProfile.professionalTitle ? `Title: ${lawyerProfile.professionalTitle}` : '',
          `Syndicate Card: ${lawyerProfile.syndicateCardNumber}`,
          `WhatsApp: ${lawyerProfile.whatsappNumber}`,
          lawyerProfile.activeCities?.length > 0
            ? `Active Cities: ${lawyerProfile.activeCities.map((c) => c.name).join(', ')}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
        [
          { text: 'Close', style: 'cancel' },
          {
            text: '💬 Contact via WhatsApp',
            onPress: () => openWhatsApp(lawyerProfile.whatsappNumber, lawyerProfile.fullName),
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Could not load lawyer profile.');
    }
  };

  if (loading) {
    return <Loading message='Loading post...' />;
  }

  if (error && !post) {
    return <ErrorMessage message={error} onRetry={loadPostDetails} />;
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const createdDate = new Date(post.createdAtUtc).toLocaleString('en-GB');
  const isOwner = profile?.id === post.lawyerId;

  const statusLabel = (status: string | number) => {
    if (status === 0 || status === 'Open') return 'Open';
    if (status === 1 || status === 'Closed') return 'Closed';
    return String(status);
  };

  const renderReply = ({ item }: { item: HelpPostReply }) => {
    const replyDate = new Date(item.createdAtUtc).toLocaleString('en-GB');
    return (
      <View style={styles.replyCard}>
        <View style={styles.replyHeader}>
          <View style={styles.replyAuthorRow}>
            <View style={styles.replyAvatar}>
              <Text style={styles.replyAvatarText}>
                {item.lawyerName ? item.lawyerName.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.replyAuthorInfo}>
              <Text style={styles.replyAuthor}>{item.lawyerName || 'Unknown Lawyer'}</Text>
              {item.lawyerTitle ? (
                <Text style={styles.replyTitle}>{item.lawyerTitle}</Text>
              ) : null}
              <Text style={styles.replyDate}>{replyDate}</Text>
            </View>
          </View>

          {/* Action buttons – visible to post owner */}
          {isOwner && (
            <View style={styles.replyActions}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => viewLawyerProfile(item.lawyerId, item.lawyerName)}
              >
                <Text style={styles.profileButtonText}>👤 Profile</Text>
              </TouchableOpacity>
              {item.lawyerWhatsapp ? (
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() => openWhatsApp(item.lawyerWhatsapp!, item.lawyerName)}
                >
                  <Text style={styles.whatsappButtonText}>📲 WhatsApp</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
        <Text style={styles.replyMessage}>{item.message}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Post info */}
      <View style={styles.postSection}>
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <Text style={styles.postCourt}>⚖️ {post.courtName || `Court #${post.courtId}`}</Text>
            {post.cityName ? (
              <Text style={styles.postCity}>📍 {post.cityName}</Text>
            ) : null}
          </View>
          <Text style={styles.postDate}>{createdDate}</Text>
        </View>

        <View style={styles.postMeta}>
          <View style={[styles.statusBadge,
            (post.status === 0 || post.status === 'Open') ? styles.statusOpen : styles.statusClosed
          ]}>
            <Text style={styles.statusText}>{statusLabel(post.status)}</Text>
          </View>
          {post.lawyerName ? (
            <Text style={styles.postOwner}>Posted by {post.lawyerName}</Text>
          ) : null}
        </View>

        <Text style={styles.postDescription}>{post.description}</Text>

        {/* If I'm the post owner looking at my own post, show a note */}
        {isOwner && (
          <View style={styles.ownerNote}>
            <Text style={styles.ownerNoteText}>
              💡 Tap "Profile" or "WhatsApp" on any reply to contact that lawyer directly.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Replies section */}
      <View style={styles.repliesSection}>
        <Text style={styles.repliesTitle}>
          Replies ({post.replies?.length || 0})
        </Text>

        {post.replies && post.replies.length > 0 ? (
          <FlatList
            data={post.replies}
            renderItem={renderReply}
            keyExtractor={(item, index) => item.id || index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noRepliesContainer}>
            <Text style={styles.noRepliesIcon}>💬</Text>
            <Text style={styles.noRepliesText}>No replies yet. Be the first to help!</Text>
          </View>
        )}
      </View>

      {/* Reply form – only if not post owner (or even owner can reply if needed) */}
      <View style={styles.replyFormSection}>
        <Text style={styles.replyLabel}>Post a Reply</Text>
        {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}
        <TextInput
          placeholder='Type your reply...'
          value={replyMessage}
          onChangeText={setReplyMessage}
          multiline
          numberOfLines={4}
          editable={!replyLoading}
        />
        <Button
          title={replyLoading ? 'Sending...' : 'Post Reply'}
          onPress={handleReply}
          loading={replyLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  postSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  postHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  postCourt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 2,
  },
  postCity: {
    fontSize: 13,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#e8f5e9',
  },
  statusClosed: {
    backgroundColor: '#fce4ec',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  postOwner: {
    fontSize: 13,
    color: '#666',
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  ownerNote: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    marginTop: 4,
  },
  ownerNoteText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 0,
  },
  repliesSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  noRepliesContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noRepliesIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  noRepliesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  replyCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0066cc',
  },
  replyHeader: {
    marginBottom: 8,
  },
  replyAuthorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  replyAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  replyAuthorInfo: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066cc',
  },
  replyTitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  replyDate: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  replyActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  profileButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  profileButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066cc',
  },
  whatsappButton: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  whatsappButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  replyMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  replyFormSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
  },
  replyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
