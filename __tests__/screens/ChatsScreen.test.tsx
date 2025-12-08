import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatsScreen } from '../../src/screens/ChatsScreen';
import * as userService from '../../src/services/userService';

jest.mock('../../src/services/userService');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ChatsScreen', () => {
  it('renders loading state initially', () => {
    (userService.fetchUsers as jest.Mock).mockResolvedValue([]);
    
    const { getByText } = render(<ChatsScreen />, {
      wrapper: createWrapper(),
    });
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders contacts list when data loads', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@test.com',
        phone: '123-456-7890',
        website: 'john.com',
        address: {
          street: '123 Main',
          city: 'NYC',
          zipcode: '10001',
        },
      },
    ];
    
    (userService.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { getByText } = render(<ChatsScreen />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
    });
  });

  it('renders empty state when no contacts', async () => {
    (userService.fetchUsers as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<ChatsScreen />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(getByText('No contacts available')).toBeTruthy();
    });
  });
});
