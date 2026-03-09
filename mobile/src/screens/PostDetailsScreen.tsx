import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { getHelpPostDetails, replyToHelpPost, getLawyerById, rateReply, deleteReply } from '../lib/services';
import { HelpPostDetails, HelpPostReply, LawyerPublicProfile } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { BASE_URL } from '../lib/config';

type Props = NativeStackScreenProps<any, 'PostDetails'>;

export function PostDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string };
  const { profile } = useAuth();
  const [post, setPost] = useState<HelpPostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Quick View Modal State
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerPublicProfile | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewLoading, setQuickViewLoading] = useState(false);

  useEffect(() => {
    loadPostDetails();
  }, [id]);

  const loadPostDetails = async () => {
    try {
      setError('');
      const postData = await getHelpPostDetails(id);
      setPost(postData);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
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
      await replyToHelpPost(id, replyMessage.trim());
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
    const digits = whatsappNumber.replace(/[^0-9]/g, '');
    const phone = digits.startsWith('2') ? digits : '2' + digits;
    const message = encodeURIComponent(
      `Hello ${lawyerName || ''}, I saw your reply on EgyptLawyers and would like to discuss further.`
    );
    const url = `https://wa.me/${phone}?text=${message}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed.');
        }
      })
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  const showLawyerQuickView = async (lawyerId: string) => {
    try {
      setQuickViewLoading(true);
      const lawyer = await getLawyerById(lawyerId);
      setSelectedLawyer(lawyer);
      setShowQuickView(true);
    } catch {
      Alert.alert('Error', 'Could not load lawyer info.');
    } finally {
      setQuickViewLoading(false);
    }
  };

  const handleRateReply = async (replyId: string, rating: number) => {
    try {
      await rateReply(id, replyId, rating);
      await loadPostDetails();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save evaluation');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    Alert.alert(
      'Delete Reply',
      'Are you sure you want to delete this reply?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteReply(id, replyId);
              await loadPostDetails();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete reply');
            }
          }
        }
      ]
    );
  };

  if (loading) return <Loading message='Loading request...' />;
  if (error && !post) return <ErrorMessage message={error} onRetry={loadPostDetails} />;
  if (!post) return <SafeAreaView style={styles.container}><Text style={styles.errorText}>Post not found</Text></SafeAreaView>;

  const renderReply = ({ item }: { item: HelpPostReply }) => {
    return (
      <View style={styles.replyCard}>
        <View style={styles.replyHeader}>
          <TouchableOpacity 
            style={styles.avatarMini} 
            onPress={() => showLawyerQuickView(item.lawyerId)}
          >
            {item.lawyerProfileImageUrl ? (
              <Image 
                source={{ uri: `${BASE_URL}${item.lawyerProfileImageUrl}` }} 
                style={styles.avatarImage} 
              />
            ) : (
              <Text style={styles.avatarText}>{item.lawyerName?.charAt(0)}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.replyAuthorInfo}>
            <Text style={styles.replyAuthor}>{item.lawyerName}</Text>
            <Text style={styles.replyDate}>{new Date(item.createdAtUtc).toLocaleDateString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>⭐ {item.rating}</Text>
              </View>
            )}
            
            {/* Delete button if user is post owner */}
            {post?.lawyerId === profile?.id && (
              <TouchableOpacity 
                onPress={() => handleDeleteReply(item.id)}
                style={{ marginLeft: 15 }}
              >
                <Text style={{ fontSize: 18, color: '#FF6B6B' }}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.replyMessage}>{item.message}</Text>
        
        {/* Evaluation Logic - Only post owner can evaluate others' replies */}
        {post?.lawyerId === profile?.id && !item.rating && item.lawyerId !== profile?.id && (
          <View style={styles.evaluationRow}>
            <Text style={styles.evaluationLabel}>Evaluate assistance:</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRateReply(item.id, star)}>
                  <Text style={{ fontSize: 24, marginHorizontal: 2 }}>☆</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
          <View style={styles.postCard}>
            <View style={styles.authorRow}>
              <TouchableOpacity 
                style={styles.avatarMini} 
                onPress={() => showLawyerQuickView(post.lawyerId)}
              >
                 {post.lawyerProfileImageUrl ? (
                  <Image 
                    source={{ uri: `${BASE_URL}${post.lawyerProfileImageUrl}` }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Text style={styles.avatarText}>{post.lawyerName?.charAt(0)}</Text>
                )}
              </TouchableOpacity>
              <View>
                <Text style={styles.postAuthor}>{post.lawyerName}</Text>
                <Text style={styles.postDate}>{new Date(post.createdAtUtc).toLocaleString()}</Text>
              </View>
            </View>

            <Text style={styles.courtName}>⚖️ {post.courtName}</Text>
            <Text style={styles.description}>{post.description}</Text>
            
            <View style={styles.locationRow}>
               <Text style={styles.locationText}>📍 {post.cityName}</Text>
            </View>
          </View>

          <View style={styles.repliesSection}>
            <Text style={styles.sectionTitle}>Replies ({post.replies?.length || 0})</Text>
            {post.replies?.length === 0 ? (
              <View style={styles.emptyReplies}>
                <Text style={styles.emptyText}>No replies yet.</Text>
              </View>
            ) : (
              post.replies?.map((r, i) => <View key={r.id || i}>{renderReply({ item: r })}</View>)
            )}
          </View>

          <View style={styles.replyInputSection}>
            <Text style={styles.replyInputLabel}>Your Reply</Text>
            <TextInput
              placeholder="Type your assistance message here..."
              placeholderTextColor="#AAB2C1"
              value={replyMessage}
              onChangeText={setReplyMessage}
              multiline
              numberOfLines={4}
              style={styles.replyInput}
            />
            <Button
              title="Post Reply"
              onPress={handleReply}
              loading={replyLoading}
              style={{ marginTop: 10 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Lawyer Quick View Modal (Enhanced) */}
      <Modal
        visible={showQuickView}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuickView(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quickViewBox}>
            {selectedLawyer && (
              <View style={styles.quickViewContent}>
                {/* Image behind name logic - we can layer them or just show them centered */}
                <View style={styles.modalAvatarContainer}>
                   {selectedLawyer.profileImageUrl ? (
                    <Image 
                      source={{ uri: `${BASE_URL}${selectedLawyer.profileImageUrl}` }} 
                      style={styles.avatarLarge} 
                    />
                  ) : (
                    <View style={[styles.avatarLarge, { backgroundColor: '#F8F9FA' }]}>
                       <Text style={{ fontSize: 40 }}>👤</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.modalLawyerName}>{selectedLawyer.fullName}</Text>
                {selectedLawyer.professionalTitle && (
                  <Text style={styles.modalLawyerTitle}>{selectedLawyer.professionalTitle}</Text>
                )}

                <View style={styles.modalInfoRow}>
                  <Text style={{ fontSize: 18 }}>📍</Text>
                  <Text style={styles.modalInfoText}>
                    Active in: {selectedLawyer.activeCities?.map(c => c.name).join(', ') || 'N/A'}
                  </Text>
                </View>

                <View style={styles.modalInfoRow}>
                   <Text style={styles.modalInfoLabel}>WhatsApp: </Text>
                   <Text style={styles.modalInfoText}>{selectedLawyer.whatsappNumber}</Text>
                </View>

                <View style={styles.modalActions}>
                   <TouchableOpacity 
                    style={styles.whatsappAction} 
                    onPress={() => {
                        setShowQuickView(false);
                        openWhatsApp(selectedLawyer.whatsappNumber, selectedLawyer.fullName);
                    }}
                   >
                     <Text style={{ fontSize: 24, marginRight: 8 }}>💬</Text>
                     <Text style={styles.whatsappActionText}>WHATSAPP</Text>
                   </TouchableOpacity>

                   <TouchableOpacity 
                    style={styles.closeAction}
                    onPress={() => setShowQuickView(false)}
                   >
                     <Text style={styles.closeActionText}>CLOSE</Text>
                   </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {quickViewLoading && (
        <View style={styles.loadingOverlay}>
          <Loading />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#495057',
    fontWeight: 'bold',
    fontSize: 20,
  },
  postAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  postDate: {
    fontSize: 12,
    color: '#868E96',
  },
  courtName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C7CFA',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  locationText: {
    color: '#868E96',
    fontSize: 14,
  },
  repliesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 16,
  },
  replyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5C7CFA',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  replyAuthorInfo: {
    flex: 1,
  },
  replyAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  replyDate: {
    fontSize: 11,
    color: '#868E96',
  },
  replyMessage: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  emptyReplies: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#868E96',
    fontSize: 14,
  },
  replyInputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  replyInputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  replyInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    color: '#1E1E1E',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 50,
  },
  ratingBadge: {
    backgroundColor: '#FFF9DB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59F00',
  },
  evaluationRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  evaluationLabel: {
    fontSize: 13,
    color: '#868E96',
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quickViewBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    overflow: 'hidden',
    padding: 24,
  },
  quickViewContent: {
    alignItems: 'center',
  },
  modalAvatarContainer: {
    marginBottom: 16,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLawyerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalLawyerTitle: {
    fontSize: 16,
    color: '#868E96',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modalInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  modalInfoText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  whatsappAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappActionText: {
    color: '#2185D0',
    fontWeight: '700',
    fontSize: 14,
  },
  closeAction: {
    justifyContent: 'center',
  },
  closeActionText: {
    color: '#2185D0',
    fontWeight: '700',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
