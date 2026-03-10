import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { createHelpPost, getCities, getCourts } from '../lib/services';
import { City, Court } from '../lib/types';
import { Modal, FlatList, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

type Props = NativeStackScreenProps<any, 'CreatePost'>;

export function CreatePostScreen({ navigation }: Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [selectedCourtId, setSelectedCourtId] = useState<number | undefined>();
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingCourts, setLoadingCourts] = useState(false);
  const [error, setError] = useState('');

  const [showCityModal, setShowCityModal] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [courtSearch, setCourtSearch] = useState('');

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const citiesList = await getCities();
      setCities(citiesList);
      if (citiesList.length > 0) {
        setSelectedCityId(citiesList[0].id);
        await loadCourts(citiesList[0].id);
      }
      setLoadingCities(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load cities');
      setLoadingCities(false);
    }
  };

  const loadCourts = async (cityId: number) => {
    setLoadingCourts(true);
    try {
      const courtsList = await getCourts(cityId);
      setCourts(courtsList);
      if (courtsList.length > 0) {
        setSelectedCourtId(courtsList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load courts');
    } finally {
      setLoadingCourts(false);
    }
  };

  const handleCityChange = (cityId: number) => {
    setSelectedCityId(cityId);
    loadCourts(cityId);
  };

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // Limit to common types requested
        multiple: true
      });

      if (!result.canceled) {
        setFiles(prev => [...prev, ...result.assets]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!selectedCourtId) {
      setError('Please select a court');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createHelpPost(selectedCourtId, description.trim(), files);
      
      // Reset state so next time the screen opens it's empty
      setDescription('');
      setFiles([]);
      
      Alert.alert(
        'Success',
        'Post created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('HomeTab') }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCities) {
    return <Loading message='Loading cities...' />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={styles.title}>New Request</Text>
          <Text style={styles.subtitle}>Ask for assistance from our lawyer network</Text>
        </View>

        {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Select City</Text>
            <TouchableOpacity 
              style={styles.selector} 
              onPress={() => setShowCityModal(true)}
              disabled={loading}
            >
              <Text style={styles.selectorText}>
                {cities.find(c => c.id === selectedCityId)?.name || 'Select a city'}
              </Text>
              <Text style={styles.selectorIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Select Court</Text>
            {loadingCourts ? (
              <View style={styles.loadingContainer}>
                <Loading message='Loading courts...' />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setShowCourtModal(true)}
                disabled={loading || !selectedCityId}
              >
                <Text style={styles.selectorText}>
                  {courts.find(c => c.id === selectedCourtId)?.name || 'Select a court'}
                </Text>
                <Text style={styles.selectorIcon}>▼</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Case Details</Text>
            <TextInput
              placeholder='Describe your legal help request...'
              placeholderTextColor="#ADB5BD"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              editable={!loading}
              style={styles.textInput}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Attachments (Optional)</Text>
            
            <TouchableOpacity 
              style={styles.attachmentSelector} 
              onPress={pickFiles} 
              disabled={loading}
            >
              <Text style={styles.attachmentSelectorText}>
                {files.length > 0 ? `${files.length} file(s) selected` : '📎 Tap to attach images or PDFs'}
              </Text>
              <Text style={styles.addBtnSmall}>+ Add</Text>
            </TouchableOpacity>

            <View style={styles.fileList}>
              {files.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <TouchableOpacity onPress={() => removeFile(index)} style={styles.removePadding}>
                    <Text style={styles.removeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Publishing...' : 'Publish Request'}
              onPress={handleCreatePost}
              loading={loading}
            />
            <Button
              title='Discard'
              onPress={() => navigation.goBack()}
              variant='secondary'
              disabled={loading}
              style={{marginTop:10}}
            />
          </View>
        </View>
      </ScrollView>

      {/* City Modal */}
      <Modal visible={showCityModal} animationType="slide" transparent>
        <SafeAreaView style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearch}>
              <TextInput 
                placeholder="Search city..." 
                value={citySearch} 
                onChangeText={setCitySearch}
                style={styles.modalSearchInput}
              />
            </View>
            <FlatList
              data={cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => {
                    handleCityChange(item.id);
                    setShowCityModal(false);
                    setCitySearch('');
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Court Modal */}
      <Modal visible={showCourtModal} animationType="slide" transparent>
        <SafeAreaView style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Court</Text>
              <TouchableOpacity onPress={() => setShowCourtModal(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearch}>
              <TextInput 
                placeholder="Search court..." 
                value={courtSearch} 
                onChangeText={setCourtSearch}
                style={styles.modalSearchInput}
              />
            </View>
            <FlatList
              data={courts.filter(c => c.name.toLowerCase().includes(courtSearch.toLowerCase()))}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => {
                    setSelectedCourtId(item.id);
                    setShowCourtModal(false);
                    setCourtSearch('');
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
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
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 30,
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C7CFA',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#1E1E1E',
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#1E1E1E',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectorText: {
    fontSize: 16,
    color: '#1E1E1E',
    flex: 1,
    marginRight: 10,
  },
  selectorIcon: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addBtn: {
    color: '#5C7CFA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
    marginRight: 10,
  },
  removeBtn: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
  hint: {
    fontSize: 12,
    color: '#ADB5BD',
    fontStyle: 'italic',
  },
  attachmentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  attachmentSelectorText: {
    fontSize: 15,
    color: '#868E96',
    flex: 1,
  },
  addBtnSmall: {
    color: '#5C7CFA',
    fontSize: 13,
    fontWeight: '700',
  },
  fileList: {
    marginTop: 4,
  },
  removePadding: {
    padding: 5,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  closeBtn: {
    color: '#5C7CFA',
    fontWeight: '600',
  },
  modalSearch: {
    marginBottom: 16,
  },
  modalSearchInput: {
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  modalItemText: {
    fontSize: 16,
    color: '#495057',
  },
});
