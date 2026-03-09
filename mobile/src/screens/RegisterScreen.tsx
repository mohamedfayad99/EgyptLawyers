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
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { registerLawyer, getCities } from '../lib/services';
import { City } from '../lib/types';

type Props = NativeStackScreenProps<any, 'Register'>;

function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/\s+/g, '');
  // Matches 010, 011, 012, 015 followed by 8 digits
  // Also supports optional +2 or 2 prefix
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
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [syndicateCard, setSyndicateCard] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const handleRegister = async () => {
    if (!fullName.trim() || !syndicateCard.trim() || !whatsapp.trim() || !password.trim()) {
      setError('Please fill in all required fields');
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
        whatsappNumber: normalizeEgyptianPhone(whatsapp),
        password,
        activeCityIds: [selectedCity],
        profileImageBase64: profileImage || undefined,
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Join EgyptLawyers professional network</Text>

        {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} disabled={loading}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                 <Text style={{ fontSize: 40 }}>👤</Text>
                 <View style={styles.addIconBadge}>
                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>+</Text>
                 </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput placeholder='e.g. Mohamed Fayad' value={fullName} onChangeText={setFullName} />

          <Text style={styles.fieldLabel}>Professional Title</Text>
          <TextInput placeholder='e.g. Criminal Lawyer' value={professionalTitle} onChangeText={setProfessionalTitle} />

          <Text style={styles.fieldLabel}>Syndicate Card Number *</Text>
          <TextInput placeholder='e.g. 123456' value={syndicateCard} onChangeText={setSyndicateCard} keyboardType='numeric' />

          <Text style={styles.fieldLabel}>WhatsApp Number *</Text>
          <TextInput placeholder='e.g. 01012345678' value={whatsapp} onChangeText={setWhatsapp} keyboardType='phone-pad' />

          <Text style={styles.fieldLabel}>Password *</Text>
          <TextInput placeholder='Min. 6 characters' value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.fieldLabel}>Confirm Password *</Text>
          <TextInput placeholder='Repeat password' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <Text style={styles.fieldLabel}>City *</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setCityModalVisible(true)}>
            <Text style={selectedCity ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {selectedCity ? `📍 ${selectedCityName}` : 'Select your city'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <Button title={loading ? 'Registering...' : 'Create Account'} onPress={handleRegister} loading={loading} style={{ marginTop: 25 }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={cityModalVisible} animationType='slide' transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => { setCityModalVisible(false); setCitySearch(''); }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSearchContainer}>
              <TextInput 
                placeholder="Search your city..." 
                value={citySearch} 
                onChangeText={setCitySearch}
                style={styles.modalSearchInput}
              />
            </View>

            <FlatList
              data={cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityRow} onPress={() => { setSelectedCity(item.id); setCityModalVisible(false); setCitySearch(''); }}>
                  <Text style={styles.cityRowName}>📍 {item.name}</Text>
                  {selectedCity === item.id && <Text style={{color:'#5C7CFA', fontWeight:'bold'}}>✓</Text>}
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
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#868E96',
    marginBottom: 32,
  },
  imagePicker: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EEEEEE',
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
  },
  imagePlaceholderText: {
    fontSize: 30,
  },
  imagePlaceholderSubText: {
    fontSize: 10,
    color: '#ADB5BD',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  fieldLabel: {
    color: '#495057',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    marginTop: 12,
  },
  dropdown: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dropdownValue: {
    flex: 1,
    color: '#1E1E1E',
    fontSize: 15,
  },
  dropdownPlaceholder: {
    flex: 1,
    color: '#ADB5BD',
    fontSize: 15,
  },
  dropdownArrow: {
    color: '#ADB5BD',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#868E96',
    fontSize: 14,
  },
  linkText: {
    color: '#5C7CFA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  cancelBtnText: {
    color: '#5C7CFA',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  modalSearchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cityRow: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityRowName: {
    fontSize: 16,
    color: '#1E1E1E',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginLeft: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  addIconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#5C7CFA',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
});
