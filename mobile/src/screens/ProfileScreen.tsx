import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Loading } from '../components/common';
import { useAuth } from '../lib/AuthContext';

type Props = NativeStackScreenProps<any, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { profile, signOut, isLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          setLoggingOut(true);
          await signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  if (isLoading || !profile) {
    return <Loading message='Loading profile...' />;
  }

  const statusColors: Record<string | number, string> = {
    0: '#ff9800', Pending: '#ff9800', pending: '#ff9800',
    1: '#4caf50', Approved: '#4caf50', approved: '#4caf50',
    2: '#f44336', Rejected: '#f44336', rejected: '#f44336',
  };

  const statusColor = statusColors[profile.verificationStatus as string | number] || '#999';

  // Normalize to a readable label regardless of whether the backend returns number or string
  const statusLabel = (() => {
    const s = profile.verificationStatus;
    if (s === 1 || s === 'Approved' || s === 'approved') return 'Approved';
    if (s === 2 || s === 'Rejected' || s === 'rejected') return 'Rejected';
    return 'Pending';
  })();

  const isApproved = statusLabel === 'Approved';
  const isRejected = statusLabel === 'Rejected';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {profile.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.fullName}>{profile.fullName}</Text>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>WhatsApp Number:</Text>
          <Text style={styles.detailValue}>{profile.whatsappNumber}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Syndicate Card:</Text>
          <Text style={styles.detailValue}>{profile.syndicateCardNumber}</Text>
        </View>

        <View style={styles.divider} />

        {profile.professionalTitle && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Professional Title:</Text>
              <Text style={styles.detailValue}>
                {profile.professionalTitle}
              </Text>
            </View>

            <View style={styles.divider} />
          </>
        )}

        {profile.activeCities && profile.activeCities.length > 0 && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Active Cities:</Text>
              <View style={styles.citiesContainer}>
                {profile.activeCities.map((city) => (
                  <View key={city.id} style={styles.cityChip}>
                    <Text style={styles.cityChipText}>📍 {city.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.divider} />
          </>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Status:</Text>
          <Text
            style={[
              styles.detailValue,
              { color: profile.isSuspended ? '#f44336' : '#4caf50' },
            ]}
          >
            {profile.isSuspended ? 'Suspended' : 'Active'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lawyer ID:</Text>
          <Text style={styles.detailValue}>{profile.id}</Text>
        </View>
      </View>

      {/* Status info box – only shown for non-approved accounts */}
      {!isApproved && (
        <View style={[
          styles.infoBox,
          isRejected
            ? { backgroundColor: '#fce4ec', borderLeftColor: '#f44336' }
            : { backgroundColor: '#fff8e1', borderLeftColor: '#ff9800' },
        ]}>
          <Text style={[
            styles.infoTitle,
            { color: isRejected ? '#c62828' : '#e65100' },
          ]}>
            {isRejected ? '❌ Account Rejected' : '⏳ Pending Verification'}
          </Text>
          <Text style={[
            styles.infoText,
            { color: isRejected ? '#b71c1c' : '#bf360c' },
          ]}>
            {isRejected
              ? 'Your registration was rejected by the admin. Please contact support for more information.'
              : 'Your account is pending admin approval. You will be able to use all features once approved.'}
          </Text>
        </View>
      )}

      <Button
        title={loggingOut ? 'Logging out...' : 'Logout'}
        onPress={handleLogout}
        loading={loggingOut}
        variant='secondary'
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0066cc',
    lineHeight: 20,
  },
  citiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  cityChip: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  cityChipText: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '500',
  },
});
