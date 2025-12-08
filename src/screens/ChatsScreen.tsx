import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl, LayoutAnimation } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../types';
import { useUsers } from '../hooks/useAPI';
import { ContactItem } from '../components/ContactItem';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch, isRefetching } = useUsers();

  const allUsers = data?.pages.flatMap(page => page) ?? [];

  const handleContactPress = useCallback((user: User) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.navigate('Chat', { userId: user.id, userName: user.name });
  }, [navigation]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <EmptyState message="Loading contacts..." isLoading />;
  }

  if (error) {
    return <EmptyState message="Failed to load contacts. Pull to refresh." />;
  }

  if (allUsers.length === 0) {
    return <EmptyState message="No contacts available" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ContactItem
            user={item}
            onPress={() => handleContactPress(item)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
