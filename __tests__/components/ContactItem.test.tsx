import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ContactItem } from '../../src/components/ContactItem';

const mockUser = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  phone: '123-456-7890',
  website: 'john.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    zipcode: '10001',
  },
};

describe('ContactItem', () => {
  it('renders user name correctly', () => {
    const { getByText } = render(
      <ContactItem user={mockUser} onPress={jest.fn()} />
    );
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders default last message when not provided', () => {
    const { getByText } = render(
      <ContactItem user={mockUser} onPress={jest.fn()} />
    );
    expect(getByText('Tap to start chatting')).toBeTruthy();
  });

  it('renders custom last message when provided', () => {
    const { getByText } = render(
      <ContactItem 
        user={mockUser} 
        onPress={jest.fn()} 
        lastMessage="Hello there!"
      />
    );
    expect(getByText('Hello there!')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ContactItem user={mockUser} onPress={onPress} />
    );
    fireEvent.press(getByText('John Doe'));
    expect(onPress).toHaveBeenCalled();
  });

  it('displays initials when no avatar', () => {
    const { getByText } = render(
      <ContactItem user={mockUser} onPress={jest.fn()} />
    );
    expect(getByText('JD')).toBeTruthy();
  });
});
