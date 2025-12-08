import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUser, useMessages, useSendMessage } from '../hooks/useAPI';
import { MessageBubble } from '../components/MessageBubble';
import { EmptyState } from '../components/EmptyState';
import { getInitials, getAvatarColor } from '../utils/helpers';
import { useUserStore } from '../store/userStore';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { userId, userName } = route.params;
  
  const { data: user } = useUser(userId);
  const { isBlocked } = useUserStore();
  
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: messages, isLoading, error } = useMessages(userId);
  const sendMessageMutation = useSendMessage(userId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: userName,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { user: { id: userId } })}
          style={styles.headerAvatar}
        >
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(userId) }]}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, userId, userName]);

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate({
        userId: userId,
        title: 'New Message',
        body: messageText.trim(),
      });
      setMessageText('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  if (isLoading) {
    return <EmptyState message="Loading messages..." isLoading />;
  }

  if (error) {
    return <EmptyState message="Failed to load messages" />;
  }

  const userIsBlocked = isBlocked(userId);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item}
              isOwn={index % 3 === 0}
            />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {userIsBlocked ? (
          <View style={styles.blockedContainer}>
            <Text style={styles.blockedText}>You have blocked this user</Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!messageText.trim() || sendMessageMutation.isPending}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerAvatar: {
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  blockedContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  blockedText: {
    color: '#999',
    fontSize: 14,
  },
});
