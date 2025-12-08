import { api } from './api';
import { User, Message, NewMessage, APIResponse } from '../types';

export const fetchUsers = async (page: number = 1): Promise<User[]> => {
  const response = await api.get<APIResponse<User>>('/api/users', {
    params: {
      offset: (page - 1) * 10,
      limit: 10,
    },
  });
  return response.data.results;
};

export const fetchUser = async (userId: number): Promise<User> => {
  const response = await api.get<User>(`/api/users/${userId}`);
  return response.data;
};

export const fetchMessagesByUser = async (userId: number): Promise<Message[]> => {
  const response = await api.get<APIResponse<Message>>('/api/posts', {
    params: { userId },
  });
  
  return response.data.results.map((msg, index) => ({
    ...msg,
    timestamp: msg.createdAt 
      ? new Date(msg.createdAt).getTime()
      : Date.now() - (response.data.results.length - index) * 60000,
  }));
};

export const sendMessage = async (message: NewMessage): Promise<Message> => {
  const response = await api.post<Message>('/api/posts', message);
  return {
    ...response.data,
    timestamp: Date.now(),
  };
};
