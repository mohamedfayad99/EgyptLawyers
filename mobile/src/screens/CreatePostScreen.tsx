import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  useWindowDimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { createHelpPost, getCities, getCourts } from '../lib/services';
import { City, Court } from '../lib/types';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any, 'CreatePost'>;

export function CreatePostScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

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
        type: ['image/*', 'application/pdf'],
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
      setDescription('');
      setFiles([]);
      Alert.alert('Success', 'Post created successfully!', [{ text: 'OK', onPress: () => navigation.navigate('HomeTab') }]);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={[styles.contentContainer, { padding: isSmallDevice ? 16 : 24 }]} keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: isSmallDevice ? 26 : 32 }]}>New Request</Text>
          <Text style={[styles.subtitle, { color: colors.textDim }]}>Ask for assistance from our lawyer network</Text>
        </View>

        {error ? <ErrorMessage message={error} onRetry={() => setError('')} /> : null}

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: isSmallDevice ? 16 : 24 }]}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.primary }]}>Select City</Text>
            <TouchableOpacity 
              style={[styles.selector, { backgroundColor: colors.background, borderColor: colors.border }]} 
              onPress={() => setShowCityModal(true)}
              disabled={loading}
            >
              <Text style={[styles.selectorText, { color: colors.text, fontSize: isSmallDevice ? 14 : 16 }]}>
                {cities.find(c => c.id === selectedCityId)?.name || 'Select a city'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.primary }]}>Select Court</Text>
            {loadingCourts ? (
              <View style={styles.loadingContainer}>
                <Loading message='Loading...' />
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.selector, { backgroundColor: colors.background, borderColor: colors.border }]} 
                onPress={() => setShowCourtModal(true)}
                disabled={loading || !selectedCityId}
              >
                <Text style={[styles.selectorText, { color: colors.text, fontSize: isSmallDevice ? 14 : 16 }]}>
                  {courts.find(c => c.id === selectedCourtId)?.name || 'Select a court'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={colors.textDim} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.primary }]}>Case Details</Text>
            <TextInput
              placeholder='Describe your legal help request...'
              placeholderTextColor={colors.textDim}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={isSmallDevice ? 4 : 6}
              editable={!loading}
              style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.primary }]}>Attachments (Optional)</Text>
            <TouchableOpacity 
              style={[styles.attachmentSelector, { backgroundColor: colors.background, borderColor: colors.border }]} 
              onPress={pickFiles} 
              disabled={loading}
            >
              <Text style={[styles.attachmentSelectorText, { color: colors.textDim }]}>
                {files.length > 0 ? `${files.length} file(s) selected` : '📎 Tap to attach files'}
              </Text>
              <Text style={[styles.addBtnSmall, { color: colors.primary }]}>+ Add</Text>
            </TouchableOpacity>

            <View style={styles.fileList}>
              {files.map((file, index) => (
                <View key={index} style={[styles.fileItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{file.name}</Text>
                  <TouchableOpacity onPress={() => removeFile(index)}>
                    <Ionicons name="close-circle" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button title={loading ? 'Publishing...' : 'Publish Request'} onPress={handleCreatePost} loading={loading} />
            <Button title='Discard' onPress={() => navigation.goBack()} variant='secondary' disabled={loading} style={{ marginTop: 10 }} />
          </View>
        </View>
      </ScrollView>

      {/* City Modal */}
      <Modal visible={showCityModal} animationType="slide" transparent>
        <SafeAreaView style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearch}>
              <TextInput 
                placeholder="Search city..." 
                placeholderTextColor={colors.textDim}
                value={citySearch} 
                onChangeText={setCitySearch}
                style={[styles.modalSearchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              />
            </View>
            <FlatList
              data={cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: colors.border }]} 
                  onPress={() => { handleCityChange(item.id); setShowCityModal(false); setCitySearch(''); }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Court Modal */}
      <Modal visible={showCourtModal} animationType="slide" transparent>
        <SafeAreaView style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Court</Text>
              <TouchableOpacity onPress={() => setShowCourtModal(false)}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearch}>
              <TextInput 
                placeholder="Search court..." 
                placeholderTextColor={colors.textDim}
                value={courtSearch} 
                onChangeText={setCourtSearch}
                style={[styles.modalSearchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              />
            </View>
            <FlatList
              data={courts.filter(c => c.name.toLowerCase().includes(courtSearch.toLowerCase()))}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: colors.border }]} 
                  onPress={() => { setSelectedCourtId(item.id); setShowCourtModal(false); setCourtSearch(''); }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
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
  container: { flex: 1 },
  contentContainer: { flexGrow: 1, paddingTop: 40, paddingBottom: 60 },
  header: { marginBottom: 30 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  card: { borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1 },
  section: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  textInput: { minHeight: 120, textAlignVertical: 'top', fontSize: 16, borderRadius: 12, padding: 12, borderWidth: 1 },
  loadingContainer: { padding: 20, alignItems: 'center' },
  buttonContainer: { marginTop: 10 },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1 },
  selectorText: { flex: 1, marginRight: 10 },
  fileItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1 },
  fileName: { fontSize: 14, flex: 1, marginRight: 10 },
  attachmentSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderStyle: 'dashed', marginBottom: 10 },
  attachmentSelectorText: { fontSize: 15, flex: 1 },
  addBtnSmall: { fontSize: 13, fontWeight: '700' },
  fileList: { marginTop: 4 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '80%', padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, paddingBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalSearch: { marginBottom: 16 },
  modalSearchInput: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1 },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1 },
  modalItemText: { fontSize: 16 },
});
