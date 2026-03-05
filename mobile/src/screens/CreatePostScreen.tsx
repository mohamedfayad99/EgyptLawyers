import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput, Loading, ErrorMessage } from '../components/common';
import { createHelpPost, getCities, getCourts } from '../lib/services';
import { City, Court } from '../lib/types';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<any, 'CreatePost'>;

export function CreatePostScreen({ navigation }: Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>();
  const [selectedCourtId, setSelectedCourtId] = useState<number | undefined>();
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingCourts, setLoadingCourts] = useState(false);
  const [error, setError] = useState('');

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
      await createHelpPost(selectedCourtId, description.trim());
      Alert.alert('Success', 'Post created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Create Help Post</Text>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      <View style={styles.section}>
        <Text style={styles.label}>Select City *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCityId}
            onValueChange={handleCityChange}
            enabled={!loading}
            style={styles.picker}
          >
            {cities.map((city) => (
              <Picker.Item key={city.id} label={city.name} value={city.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Court *</Text>
        {loadingCourts ? (
          <Text style={styles.loadingText}>Loading courts...</Text>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCourtId}
              onValueChange={setSelectedCourtId}
              enabled={!loading}
              style={styles.picker}
            >
              {courts.map((court) => (
                <Picker.Item
                  key={court.id}
                  label={court.name}
                  value={court.id}
                />
              ))}
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          placeholder='Describe your legal help request...'
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          editable={!loading}
        />
      </View>

      <Button
        title={loading ? 'Creating...' : 'Create Post'}
        onPress={handleCreatePost}
        loading={loading}
      />

      <Button
        title='Cancel'
        onPress={() => navigation.goBack()}
        variant='secondary'
        disabled={loading}
      />
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 150,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    padding: 16,
  },
});
