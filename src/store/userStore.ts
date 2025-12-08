import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BLOCKED_USERS_KEY = '@blocked_users';

interface UserStore {
  blockedUsers: Set<number>;
  blockUser: (userId: number) => void;
  unblockUser: (userId: number) => void;
  isBlocked: (userId: number) => boolean;
  hydrate: () => Promise<void>;
}

const saveToStorage = async (blockedUsers: Set<number>) => {
  try {
    const array = Array.from(blockedUsers);
    await AsyncStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(array));
  } catch (error) {
    console.error('Failed to save blocked users:', error);
  }
};

export const useUserStore = create<UserStore>((set, get) => ({
  blockedUsers: new Set<number>(),
  
  blockUser: (userId: number) => {
    set((state) => {
      const newBlocked = new Set(state.blockedUsers);
      newBlocked.add(userId);
      saveToStorage(newBlocked);
      return { blockedUsers: newBlocked };
    });
  },
  
  unblockUser: (userId: number) => {
    set((state) => {
      const newBlocked = new Set(state.blockedUsers);
      newBlocked.delete(userId);
      saveToStorage(newBlocked);
      return { blockedUsers: newBlocked };
    });
  },
  
  isBlocked: (userId: number) => {
    return get().blockedUsers.has(userId);
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(BLOCKED_USERS_KEY);
      if (stored) {
        const array = JSON.parse(stored);
        set({ blockedUsers: new Set(array) });
      }
    } catch (error) {
      console.error('Failed to load blocked users:', error);
    }
  },
}));
