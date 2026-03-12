import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Loading, Card } from '../components/common';
import { useAuth } from '../lib/AuthContext';
import { updateLawyerProfile } from '../lib/services';
import { BASE_URL } from '../lib/config';
import { useTheme } from '../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { profile, signOut, refreshProfile, isLoading } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editFullName, setEditFullName] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editProfileImage, setEditProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEditFullName(profile.fullName);
      setEditWhatsapp(profile.whatsappNumber);
    }
  }, [profile, isEditing]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    
    if (!result.canceled && result.assets[0].base64) {
      setEditProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await updateLawyerProfile({
        fullName: editFullName,
        whatsappNumber: editWhatsapp,
        activeCityIds: profile.activeCities ? profile.activeCities.map(c => c.id) : [],
        profileImageBase64: editProfileImage || undefined,
        professionalTitle: profile.professionalTitle || undefined,
      });

      await refreshProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            setLoggingOut(true);
            await signOut();
          }
        }
      ]
    );
  };

  if (isLoading || !profile) return <Loading message='Loading profile...' />;

  const statusLabel = (() => {
    const s = profile.verificationStatus;
    if (s === 1 || s === 'Approved' || s === 'approved') return 'Approved';
    if (s === 2 || s === 'Rejected' || s === 'rejected') return 'Rejected';
    return 'Pending';
  })();

  const statusColor = statusLabel === 'Approved' ? '#20C997' : statusLabel === 'Rejected' ? '#FF6B6B' : '#FF9F43';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={[styles.contentContainer, { padding: isSmallDevice ? 16 : 24 }]}>
        
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            disabled={!isEditing} 
            style={[styles.avatarContainer, { borderColor: isEditing ? colors.primary : colors.border, backgroundColor: colors.background }]} 
            onPress={handlePickImage}
          >
            {editProfileImage ? (
              <Image source={{ uri: editProfileImage }} style={styles.avatarImage} />
            ) : profile.profileImageUrl ? (
              <Image source={{ uri: `${BASE_URL}${profile.profileImageUrl}` }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.text }]}>{profile.fullName.charAt(0).toUpperCase()}</Text>
            )}
            {isEditing && <View style={styles.avatarOverlay}><Text style={styles.avatarOverlayText}>EDIT</Text></View>}
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={[styles.editInputName, { color: colors.primary, borderBottomColor: colors.primary }]}
              value={editFullName}
              onChangeText={setEditFullName}
              placeholder="Full Name"
              placeholderTextColor={colors.textDim}
            />
          ) : (
            <Text style={[styles.fullName, { color: colors.text, fontSize: isSmallDevice ? 20 : 24 }]}>{profile.fullName}</Text>
          )}

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border, padding: isSmallDevice ? 16 : 24 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Details</Text>
          
          <View style={styles.detailItem}>
             <Text style={[styles.detailLabel, { color: colors.textDim }]}>WhatsApp</Text>
             {isEditing ? (
               <TextInput
                 style={[styles.editInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                 value={editWhatsapp}
                 onChangeText={setEditWhatsapp}
                 keyboardType="phone-pad"
               />
             ) : (
               <Text style={[styles.detailValue, { color: colors.text }]}>{profile.whatsappNumber}</Text>
             )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailItem}>
             <Text style={[styles.detailLabel, { color: colors.textDim }]}>Syndicate Number</Text>
             <Text style={[styles.detailValueLocked, { color: colors.textDim }]}>{profile.syndicateCardNumber}</Text>
          </View>

          {profile.professionalTitle && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.detailItem}>
                 <Text style={[styles.detailLabel, { color: colors.textDim }]}>Title</Text>
                 <Text style={[styles.detailValue, { color: colors.text }]}>{profile.professionalTitle}</Text>
              </View>
            </>
          )}

          {profile.activeCities && profile.activeCities.length > 0 && (
             <>
               <View style={[styles.divider, { backgroundColor: colors.border }]} />
               <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textDim }]}>Active Cities</Text>
                  <View style={styles.citiesRow}>
                    {profile.activeCities.map(city => (
                      <View key={city.id} style={[styles.cityChip, { backgroundColor: isDark ? colors.background : '#E7F5FF' }]}>
                        <Text style={[styles.cityChipText, { color: isDark ? colors.text : '#228BE6' }]}>📍 {city.name}</Text>
                      </View>
                    ))}
                  </View>
               </View>
             </>
          )}
        </View>

        <View style={styles.actionSection}>
          {isEditing ? (
            <>
              <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSaveProfile} loading={saving} />
              <Button title="Cancel" onPress={() => { setIsEditing(false); setEditProfileImage(null); }} variant="secondary" style={{ marginTop: 12 }} />
            </>
          ) : (
            <>
              <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
              <Button 
                title={loggingOut ? 'Logging out...' : 'Sign Out'} 
                onPress={handleLogout} 
                variant='danger' 
                style={{ marginTop: 12 }} 
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 32,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    paddingVertical: 2,
    alignItems: 'center',
  },
  avatarOverlayText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  fullName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editInputName: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    textAlign: 'center',
    marginBottom: 10,
    minWidth: 180,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailsCard: {
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailValueLocked: {
    fontSize: 16,
    fontWeight: '500',
  },
  editInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  citiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  cityChip: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionSection: {
    marginBottom: 40,
  },
});
