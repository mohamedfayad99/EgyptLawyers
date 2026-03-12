import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { registerLawyer, getCities } from '../lib/services';
import { City } from '../lib/types';
import { useTheme } from '../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any, 'Register'>;

function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/\s+/g, '');
  const egRegex = /^(\+2|2)?01[0125][0-9]{8}$/;
  return egRegex.test(cleaned);
}

function normalizeEgyptianPhone(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '');
  if (trimmed.startsWith('+2')) return trimmed;
  if (trimmed.startsWith('2') && trimmed.length >= 11) return '+' + trimmed;
  if (trimmed.startsWith('01') && trimmed.length === 11) return '+2' + trimmed;
  return '+2' + trimmed;
}

export function RegisterScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [syndicateCard, setSyndicateCard] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const citiesList = await getCities();
      setCities(citiesList);
      setLoadingCities(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load cities');
      setLoadingCities(false);
    }
  };

  const selectedCityName = cities.find((c) => c.id === selectedCity)?.name || '';

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    
    if (!result.canceled && result.assets[0].base64) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handlePickIdImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    
    if (!result.canceled && result.assets[0].base64) {
      setIdCardImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !syndicateCard.trim() || !whatsapp.trim() || !password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!idCardImage) {
      setError('Please upload a photo of your Syndicate Card or ID for verification');
      return;
    }
    if (!isValidEgyptianPhone(whatsapp)) {
      setError('Please enter a valid Egyptian WhatsApp number (e.g. 01012345678)');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!selectedCity) {
      setError('Please select your city');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerLawyer({
        fullName: fullName.trim(),
        professionalTitle: professionalTitle.trim() || undefined,
        syndicateCardNumber: syndicateCard.trim(),
        nationalIdNumber: nationalId.trim() || undefined,
        whatsappNumber: normalizeEgyptianPhone(whatsapp),
        password,
        activeCityIds: [selectedCity],
        profileImageBase64: profileImage || undefined,
        idCardImageBase64: idCardImage || undefined,
      });

      Alert.alert(
        'Success',
        'Account created! Pending admin approval.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCities) return <Loading message='Loading cities...' />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingTop: isSmallDevice ? 30 : 40 }]} keyboardShouldPersistTaps='handled'>
        <Text style={[styles.title, { color: colors.text, fontSize: isSmallDevice ? 26 : 32 }]}>Register</Text>
        <Text style={[styles.subtitle, { color: colors.textDim }]}>Join EgyptLawyers professional network</Text>

        {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

        <View style={[styles.imageSection, { marginBottom: isSmallDevice ? 20 : 32 }]}>
          <TouchableOpacity style={[styles.imagePicker, { backgroundColor: colors.surface, borderColor: colors.border, width: isSmallDevice ? 80 : 100, height: isSmallDevice ? 80 : 100 }]} onPress={handlePickImage} disabled={loading}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                 <Text style={{ fontSize: isSmallDevice ? 30 : 40 }}>👤</Text>
                 <View style={[styles.addIconBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="add" size={isSmallDevice ? 16 : 20} color="#fff" />
                 </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border, padding: isSmallDevice ? 20 : 24 }]}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>Full Name *</Text>
          <TextInput placeholder='e.g. Mohamed Fayad' value={fullName} onChangeText={setFullName} />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>Professional Title</Text>
          <TextInput placeholder='e.g. Criminal Lawyer' value={professionalTitle} onChangeText={setProfessionalTitle} />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>Syndicate Card Number *</Text>
          <TextInput placeholder='e.g. 123456' value={syndicateCard} onChangeText={setSyndicateCard} keyboardType='numeric' />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>National ID (Optional)</Text>
          <TextInput placeholder='14 characters' value={nationalId} onChangeText={setNationalId} keyboardType='numeric' maxLength={14} />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>ID Card / Syndicate Card Photo (for verification) *</Text>
          <TouchableOpacity 
            style={[styles.idCardPicker, { backgroundColor: colors.background, borderColor: colors.border }]} 
            onPress={handlePickIdImage}
          >
            {idCardImage ? (
              <Image source={{ uri: idCardImage }} style={styles.idCardPreview} />
            ) : (
              <View style={styles.idCardPlaceholder}>
                <Ionicons name="camera-outline" size={24} color={colors.textDim} />
                <Text style={{ color: colors.textDim, marginTop: 4 }}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>WhatsApp Number *</Text>
          <TextInput placeholder='e.g. 01012345678' value={whatsapp} onChangeText={setWhatsapp} keyboardType='phone-pad' />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>Password *</Text>
          <TextInput placeholder='Min. 6 characters' value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>Confirm Password *</Text>
          <TextInput placeholder='Repeat password' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <Text style={[styles.fieldLabel, { color: colors.text }]}>City *</Text>
          <TouchableOpacity style={[styles.dropdown, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => setCityModalVisible(true)}>
            <Text style={selectedCity ? [styles.dropdownValue, { color: colors.text }] : [styles.dropdownPlaceholder, { color: colors.textDim }]}>
              {selectedCity ? `📍 ${selectedCityName}` : 'Select your city'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textDim} />
          </TouchableOpacity>

          <Button title={loading ? 'Registering...' : 'Create Account'} onPress={handleRegister} loading={loading} style={{ marginTop: 25 }} />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={cityModalVisible} animationType='slide' transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select City</Text>
              <TouchableOpacity onPress={() => { setCityModalVisible(false); setCitySearch(''); }}>
                <Text style={[styles.cancelBtnText, { color: colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.modalSearchContainer, { borderBottomColor: colors.border }]}>
              <TextInput 
                placeholder="Search your city..." 
                placeholderTextColor={colors.textDim}
                value={citySearch} 
                onChangeText={setCitySearch}
                style={[styles.modalSearchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              />
            </View>

            <FlatList
              data={cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.cityRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]} onPress={() => { setSelectedCity(item.id); setCityModalVisible(false); setCitySearch(''); }}>
                  <Text style={[styles.cityRowName, { color: colors.text }]}>📍 {item.name}</Text>
                  {selectedCity === item.id && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 60,
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  imagePicker: {
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    marginTop: 12,
  },
  dropdown: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 15,
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  modalSearchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  cityRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityRowName: {
    fontSize: 16,
  },
  imageSection: {
    alignItems: 'center',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  idCardPicker: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
  },
  idCardPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  idCardPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
