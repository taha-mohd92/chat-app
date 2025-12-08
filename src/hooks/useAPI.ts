import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, fetchUser, fetchMessagesByUser, sendMessage } from '../services/userService';
import { Message, NewMessage } from '../types';

export const useUsers = () => {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMessages = (userId: number) => {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: () => fetchMessagesByUser(userId),
    staleTime: 60 * 1000,
  });
};

export const useSendMessage = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMessage: NewMessage) => sendMessage(newMessage),
    
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ['messages', userId] });
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', userId]);

      const optimisticMessage: Message = {
        id: Date.now(),
        userId: newMessage.userId,
        title: newMessage.title,
        body: newMessage.body,
        timestamp: Date.now(),
      };

      queryClient.setQueryData<Message[]>(['messages', userId], (old) => 
        old ? [...old, optimisticMessage] : [optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },

    onSuccess: (serverMessage, newMessage, context) => {
      queryClient.setQueryData<Message[]>(['messages', userId], (old) => {
        if (!old) return [serverMessage];
        return old.map(msg => 
          msg.id === context?.optimisticMessage?.id ? serverMessage : msg
        );
      });
    },

    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', userId], context.previousMessages);
      }
    },
  });
};
