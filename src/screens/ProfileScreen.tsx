import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useUserStore } from '../store/userStore';
import { useUser } from '../hooks/useAPI';
import { EmptyState } from '../components/EmptyState';
import { getInitials, getAvatarColor } from '../utils/helpers';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const userId = route.params.user.id;

  const { data: user, isLoading, error } = useUser(userId);
  const { isBlocked, blockUser, unblockUser } = useUserStore();

  if (isLoading) {
    return <EmptyState message="Loading profile..." isLoading />;
  }

  if (error || !user) {
    return <EmptyState message="Failed to load profile" />;
  }

  const blocked = isBlocked(user.id);

  const handleToggleBlock = () => {
    if (blocked) {
      unblockUser(user.id);
      Alert.alert('Success', `${user.name} has been unblocked`);
    } else {
      Alert.alert(
        'Block User',
        `Are you sure you want to block ${user.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => blockUser(user.id),
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(user.id) }]}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Website</Text>
          <Text style={styles.value}>{user.website}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Street</Text>
          <Text style={styles.value}>
            {user.address.street}
            {user.address.suite ? `, ${user.address.suite}` : ''}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{user.address.city}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Zipcode</Text>
          <Text style={styles.value}>{user.address.zipcode}</Text>
        </View>
      </View>

      {user.company && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.company.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Catchphrase</Text>
            <Text style={styles.value}>{user.company.catchPhrase}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.blockButton, blocked && styles.unblockButton]}
        onPress={handleToggleBlock}
        activeOpacity={0.8}
      >
        <Text style={styles.blockButtonText}>
          {blocked ? '✓ Unblock User' : 'Block User'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  blockButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  unblockButton: {
    backgroundColor: '#34C759',
  },
  blockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
