export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  avatar?: string;
  address: {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Message {
  id: number;
  userId: number;
  title: string;
  body: string;
  timestamp?: number;
  tags?: string[];
  category?: string;
  createdAt?: string;
}

export interface NewMessage {
  userId: number;
  title: string;
  body: string;
}

export interface APIResponse<T> {
  total: number;
  limit: number;
  offset: number;
  results: T[];
}

export type RootStackParamList = {
  MainTabs: undefined;
  Chat: { userId: number; userName: string };
  Profile: { user: { id: number } };
};

export type MainTabsParamList = {
  Chats: undefined;
  Settings: undefined;
};
