import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from './src/store/userStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  useEffect(() => {
    useUserStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
