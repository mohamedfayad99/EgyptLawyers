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
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { getHelpPostDetails, replyToHelpPost, getLawyerById, rateReply, deleteReply } from '../lib/services';
import { HelpPostDetails, HelpPostReply, LawyerPublicProfile, Attachment } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { BASE_URL } from '../lib/config';
import { useTheme } from '../lib/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any, 'PostDetails'>;

export function PostDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params as { id: string };
  const { profile } = useAuth();
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const [post, setPost] = useState<HelpPostDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState<any[]>([]);
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
      await replyToHelpPost(id, replyMessage.trim(), replyFiles);
      setReplyMessage('');
      setReplyFiles([]);
      await loadPostDetails();
      // Alert removed as requested for smoother experience
    } catch (err: any) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const pickReplyFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        multiple: true
      });

      if (!result.canceled) {
        setReplyFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeReplyFile = (index: number) => {
    setReplyFiles(prev => prev.filter((_, i) => i !== index));
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
  if (!post) return <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}><Text style={[styles.errorText, {color: colors.error}]}>Post not found</Text></SafeAreaView>;

  const renderAttachments = (attachments?: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((att) => (
          <TouchableOpacity 
            key={att.id} 
            style={[styles.attachmentItem, {backgroundColor: isDark ? colors.surface : '#F1F3F5', borderColor: colors.border}]}
            onPress={() => Linking.openURL(`${BASE_URL}${att.fileUrl}`)}
          >
            <Text style={[styles.attachmentText, {color: colors.text}]}>📎 {att.fileUrl.split('.').pop()?.toUpperCase() || 'Attachment'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReply = ({ item }: { item: HelpPostReply }) => {
    return (
      <View style={[styles.replyCard, {backgroundColor: colors.surface, borderLeftColor: colors.primary, borderColor: colors.border}]}>
        <View style={styles.replyHeader}>
          <TouchableOpacity 
            style={[styles.avatarMini, {backgroundColor: colors.background}]} 
            onPress={() => showLawyerQuickView(item.lawyerId)}
          >
            {item.lawyerProfileImageUrl ? (
              <Image 
                source={{ uri: `${BASE_URL}${item.lawyerProfileImageUrl}` }} 
                style={styles.avatarImage} 
              />
            ) : (
              <Text style={[styles.avatarText, {color: colors.text}]}>{item.lawyerName?.charAt(0)}</Text>
            )}
          </TouchableOpacity>
          <View style={styles.replyAuthorInfo}>
            <Text style={[styles.replyAuthor, {color: colors.text, fontSize: isSmallDevice ? 14 : 15}]}>{item.lawyerName}</Text>
            <Text style={[styles.replyDate, {color: colors.textDim}]}>{new Date(item.createdAtUtc).toLocaleDateString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.rating && (
              <View style={[styles.ratingBadge, {backgroundColor: isDark ? '#3d2b0e' : '#FFF9DB', borderColor: isDark ? '#7a5a1a' : '#FFE066'}]}>
                <Text style={[styles.ratingBadgeText, {color: isDark ? '#ffd43b' : '#F59F00'}]}>⭐ {item.rating}</Text>
              </View>
            )}
            
            {post?.lawyerId === profile?.id && (
              <TouchableOpacity 
                onPress={() => handleDeleteReply(item.id)}
                style={{ marginLeft: 15 }}
              >
                <FontAwesome name="trash" size={isSmallDevice ? 18 : 20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={[styles.replyMessage, {color: colors.text, opacity: 0.9, fontSize: isSmallDevice ? 13 : 14}]}>{item.message}</Text>
        
        {renderAttachments(item.attachments)}
        
        {post?.lawyerId === profile?.id && !item.rating && item.lawyerId !== profile?.id && (
          <View style={[styles.evaluationRow, {borderTopColor: colors.border}]}>
            <Text style={[styles.evaluationLabel, {color: colors.textDim}]}>Evaluate assistance:</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRateReply(item.id, star)}>
                  <Text style={{ fontSize: isSmallDevice ? 20 : 24, marginHorizontal: 2 }}>☆</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={[styles.scrollContent, {padding: isSmallDevice ? 12 : 16}]} keyboardShouldPersistTaps='handled'>
          <View style={[styles.postCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <View style={styles.authorRow}>
              <TouchableOpacity 
                style={[styles.avatarMini, {backgroundColor: colors.background}]} 
                onPress={() => showLawyerQuickView(post.lawyerId)}
              >
                 {post.lawyerProfileImageUrl ? (
                  <Image 
                    source={{ uri: `${BASE_URL}${post.lawyerProfileImageUrl}` }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <Text style={[styles.avatarText, {color: colors.text}]}>{post.lawyerName?.charAt(0)}</Text>
                )}
              </TouchableOpacity>
              <View>
                <Text style={[styles.postAuthor, {color: colors.text, fontSize: isSmallDevice ? 16 : 18}]}>{post.lawyerName}</Text>
                <Text style={[styles.postDate, {color: colors.textDim}]}>{new Date(post.createdAtUtc).toLocaleString()}</Text>
              </View>
            </View>

            <Text style={[styles.courtName, {color: colors.primary, fontSize: isSmallDevice ? 15 : 16}]}>⚖️ {post.courtName}</Text>
            <Text style={[styles.description, {color: colors.text, fontSize: isSmallDevice ? 14 : 16}]}>{post.description}</Text>
            
            {renderAttachments(post.attachments)}

            <View style={[styles.locationRow, {borderTopColor: colors.border}]}>
               <Text style={[styles.locationText, {color: colors.textDim}]}>📍 {post.cityName}</Text>
            </View>
          </View>

          <View style={styles.repliesSection}>
            <Text style={[styles.sectionTitle, {color: colors.text, fontSize: isSmallDevice ? 18 : 20}]}>Replies ({post.replies?.length || 0})</Text>
            {post.replies?.length === 0 ? (
              <View style={styles.emptyReplies}>
                <Text style={[styles.emptyText, {color: colors.textDim}]}>No replies yet.</Text>
              </View>
            ) : (
              post.replies?.map((r, i) => <View key={r.id || i}>{renderReply({ item: r })}</View>)
            )}
          </View>

          <View style={[styles.replyInputSection, {backgroundColor: colors.surface, borderColor: colors.border, padding: isSmallDevice ? 16 : 20}]}>
            <Text style={[styles.replyInputLabel, {color: colors.text}]}>Your Reply</Text>
            <TextInput
              placeholder="Type your assistance message here..."
              placeholderTextColor={colors.textDim}
              value={replyMessage}
              onChangeText={setReplyMessage}
              multiline
              numberOfLines={4}
              style={[styles.replyInput, {backgroundColor: colors.background, borderColor: colors.border, color: colors.text}]}
            />

            <View style={styles.replyAttachmentRow}>
              <TouchableOpacity onPress={pickReplyFiles} disabled={replyLoading}>
                <Text style={[styles.addAttachmentText, {color: colors.primary}]}>+ Attach Document</Text>
              </TouchableOpacity>
            </View>

            {replyFiles.map((file, index) => (
              <View key={index} style={[styles.selectedFileItem, {backgroundColor: colors.background, borderColor: colors.border}]}>
                <Text style={[styles.selectedFileName, {color: colors.text}]} numberOfLines={1}>{file.name}</Text>
                <TouchableOpacity onPress={() => removeReplyFile(index)}>
                  <Text style={styles.removeFileBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Button
              title="Post Reply"
              onPress={handleReply}
              loading={replyLoading}
              style={{ marginTop: 10 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Lawyer Quick View Modal */}
      <Modal
        visible={showQuickView}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuickView(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.quickViewBox, {backgroundColor: colors.surface, borderBottomColor: colors.border, padding: isSmallDevice ? 20 : 24}]}>
            {selectedLawyer && (
              <View style={styles.quickViewContent}>
                <View style={[styles.modalAvatarContainer, {borderColor: colors.border, backgroundColor: colors.background}]}>
                   {selectedLawyer.profileImageUrl ? (
                    <Image 
                      source={{ uri: `${BASE_URL}${selectedLawyer.profileImageUrl}` }} 
                      style={styles.avatarLarge} 
                    />
                  ) : (
                    <View style={[styles.avatarLarge, { backgroundColor: colors.background }]}>
                       <Text style={{ fontSize: isSmallDevice ? 32 : 40 }}>👤</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.modalLawyerName, {color: colors.text, fontSize: isSmallDevice ? 18 : 22}]}>{selectedLawyer.fullName}</Text>
                {selectedLawyer.professionalTitle && (
                  <Text style={[styles.modalLawyerTitle, {color: colors.textDim}]}>{selectedLawyer.professionalTitle}</Text>
                )}

                <View style={styles.modalInfoRow}>
                  <Text style={{ fontSize: 18 }}>📍</Text>
                  <Text style={[styles.modalInfoText, {color: colors.text}]}>
                    Active in: {selectedLawyer.activeCities?.map(c => c.name).join(', ') || 'N/A'}
                  </Text>
                </View>

                <View style={styles.modalInfoRow}>
                   <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
                   <Text style={[styles.modalInfoText, {color: colors.text}]}>{selectedLawyer.whatsappNumber}</Text>
                </View>

                <View style={[styles.modalActions, {borderTopColor: colors.border}]}>
                   <TouchableOpacity 
                    style={styles.whatsappAction} 
                    onPress={() => {
                        setShowQuickView(false);
                        openWhatsApp(selectedLawyer.whatsappNumber, selectedLawyer.fullName);
                    }}
                   >
                     <MaterialCommunityIcons name="whatsapp" size={24} color={colors.primary} style={{marginRight: 8}} />
                     <Text style={[styles.whatsappActionText, {color: colors.primary}]}>WHATSAPP</Text>
                   </TouchableOpacity>

                   <TouchableOpacity 
                    style={styles.closeAction}
                    onPress={() => setShowQuickView(false)}
                   >
                     <Text style={[styles.closeActionText, {color: colors.textDim}]}>CLOSE</Text>
                   </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {quickViewLoading && (
        <View style={[styles.loadingOverlay, {backgroundColor: colors.background + 'B3'}]}>
          <Loading />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  postCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
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
    fontWeight: 'bold',
    fontSize: 20,
  },
  postAuthor: {
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
  },
  courtName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  locationText: {
    fontSize: 14,
  },
  repliesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  replyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
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
    fontWeight: 'bold',
  },
  replyDate: {
    fontSize: 11,
  },
  replyMessage: {
    lineHeight: 20,
  },
  emptyReplies: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  replyInputSection: {
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
  },
  replyInputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  replyInput: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  evaluationRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  evaluationLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quickViewBox: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
  },
  quickViewContent: {
    alignItems: 'center',
  },
  modalAvatarContainer: {
    marginBottom: 16,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    width: '100%',
    height: '100%',
  },
  modalLawyerName: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalLawyerTitle: {
    fontSize: 16,
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
  modalInfoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  whatsappAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappActionText: {
    fontWeight: '700',
    fontSize: 14,
  },
  closeAction: {
    justifyContent: 'center',
  },
  closeActionText: {
    fontWeight: '700',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 5,
  },
  attachmentItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  attachmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  replyAttachmentRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addAttachmentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedFileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  selectedFileName: {
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  removeFileBtn: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
});
