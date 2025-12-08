import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers, useMessages } from '../../src/hooks/useAPI';
import * as userService from '../../src/services/userService';

jest.mock('../../src/services/userService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@test.com' },
      { id: 2, name: 'User 2', email: 'user2@test.com' },
    ];
    
    (userService.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0]).toEqual(mockUsers);
  });
});

describe('useMessages', () => {
  it('fetches messages successfully', async () => {
    const mockMessages = [
      { id: 1, userId: 1, title: 'Test', body: 'Message 1', timestamp: Date.now() },
      { id: 2, userId: 1, title: 'Test', body: 'Message 2', timestamp: Date.now() },
    ];
    
    (userService.fetchMessagesByUser as jest.Mock).mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessages(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMessages);
  });
});
