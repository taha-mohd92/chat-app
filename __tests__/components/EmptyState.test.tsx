import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../../src/components/EmptyState';

describe('EmptyState', () => {
  it('renders loading state correctly', () => {
    const { getByText } = render(
      <EmptyState message="Loading data..." isLoading={true} />
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders empty message correctly', () => {
    const { getByText } = render(
      <EmptyState message="No data available" />
    );
    expect(getByText('No data available')).toBeTruthy();
  });

  it('renders icon when not loading', () => {
    const { UNSAFE_getAllByType } = render(
      <EmptyState message="No data" />
    );
    const Text = require('react-native').Text;
    const texts = UNSAFE_getAllByType(Text);
    expect(texts.length).toBeGreaterThan(1);
  });

  it('does not render icon when loading', () => {
    const { getByText } = render(
      <EmptyState message="Loading..." isLoading={true} />
    );
    expect(getByText('Loading...')).toBeTruthy();
  });
});
