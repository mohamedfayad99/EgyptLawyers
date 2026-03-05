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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { registerLawyer, getCities } from '../lib/services';
import { City } from '../lib/types';

type Props = NativeStackScreenProps<any, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [syndicateCard, setSyndicateCard] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [cityModalVisible, setCityModalVisible] = useState(false);

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

  const toggleCity = (cityId: number) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((c) => c !== cityId)
        : [...prev, cityId],
    );
  };

  const selectedCityNames = cities
    .filter((c) => selectedCities.includes(c.id))
    .map((c) => c.name)
    .join(', ');

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !syndicateCard.trim() ||
      !whatsapp.trim() ||
      !password.trim()
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (selectedCities.length === 0) {
      setError('Please select at least one active city');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerLawyer({
        fullName: fullName.trim(),
        professionalTitle: professionalTitle.trim() || undefined,
        syndicateCardNumber: syndicateCard.trim(),
        whatsappNumber: whatsapp.trim(),
        password,
        activeCityIds: selectedCities,
      });

      Alert.alert(
        '✅ Registration Submitted',
        'Your registration has been received. Your account is pending admin verification.\n\nYou will be able to log in once approved.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCities) {
    return <Loading message='Loading cities...' />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps='handled'
    >
      <Text style={styles.title}>Register as Lawyer</Text>
      <Text style={styles.subtitle}>Join EgyptLawyers Network</Text>

      {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

      <Text style={styles.fieldLabel}>Full Name *</Text>
      <TextInput
        placeholder='e.g. Mohamed Fayad'
        value={fullName}
        onChangeText={setFullName}
        editable={!loading}
      />

      <Text style={styles.fieldLabel}>Professional Title (optional)</Text>
      <TextInput
        placeholder='e.g. Criminal Law Specialist'
        value={professionalTitle}
        onChangeText={setProfessionalTitle}
        editable={!loading}
      />

      <Text style={styles.fieldLabel}>Syndicate Card Number *</Text>
      <TextInput
        placeholder='e.g. 12345'
        value={syndicateCard}
        onChangeText={setSyndicateCard}
        editable={!loading}
      />

      <Text style={styles.fieldLabel}>WhatsApp Number *</Text>
      <TextInput
        placeholder='e.g. 01012345678'
        value={whatsapp}
        onChangeText={setWhatsapp}
        editable={!loading}
      />

      <Text style={styles.fieldLabel}>Password *</Text>
      <TextInput
        placeholder='Min. 6 characters'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <Text style={styles.fieldLabel}>Confirm Password *</Text>
      <TextInput
        placeholder='Repeat your password'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      {/* ── Cities dropdown ── */}
      <Text style={styles.fieldLabel}>Active Cities * <Text style={styles.hint}>(cities where you work in courts)</Text></Text>
      <TouchableOpacity
        style={[styles.dropdown, loading && styles.dropdownDisabled]}
        onPress={() => !loading && setCityModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={selectedCities.length > 0 ? styles.dropdownValue : styles.dropdownPlaceholder} numberOfLines={2}>
          {selectedCities.length > 0 ? selectedCityNames : 'Tap to select cities…'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      {selectedCities.length > 0 && (
        <View style={styles.selectedChips}>
          {cities.filter((c) => selectedCities.includes(c.id)).map((c) => (
            <View key={c.id} style={styles.chip}>
              <Text style={styles.chipText}>📍 {c.name}</Text>
              <TouchableOpacity
                onPress={() => toggleCity(c.id)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.chipRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Button
        title={loading ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        loading={loading}
      />

      <View style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Text
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </View>

      {/* ── City picker modal ── */}
      <Modal
        visible={cityModalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setCityModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Active Cities</Text>
            <TouchableOpacity
              style={styles.modalDone}
              onPress={() => setCityModalVisible(false)}
            >
              <Text style={styles.modalDoneText}>Done ({selectedCities.length})</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Select all cities where you regularly work in courts
          </Text>

          <FlatList
            data={cities}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isSelected = selectedCities.includes(item.id);
              return (
                <TouchableOpacity
                  style={[styles.cityRow, isSelected && styles.cityRowSelected]}
                  onPress={() => toggleCity(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cityRowName}>📍 {item.name}</Text>
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
    marginBottom: 2,
  },
  hint: {
    fontWeight: '400',
    color: '#999',
    fontSize: 12,
  },
  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#aaa',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  // Selected city chips
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '500',
  },
  chipRemove: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalDone: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  modalDoneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  cityRowSelected: {
    backgroundColor: '#f0f7ff',
  },
  cityRowName: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
});
