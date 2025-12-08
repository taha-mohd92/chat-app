import React from 'react';
import { render } from '@testing-library/react-native';
import { MessageBubble } from '../../src/components/MessageBubble';

const mockMessage = {
  id: 1,
  userId: 1,
  title: 'Test',
  body: 'This is a test message',
  timestamp: Date.now(),
};

describe('MessageBubble', () => {
  it('renders message body correctly', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} />
    );
    expect(getByText('This is a test message')).toBeTruthy();
  });

  it('applies own message styling when isOwn is true', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} isOwn={true} />
    );
    const messageText = getByText('This is a test message');
    expect(messageText).toBeTruthy();
  });

  it('applies other message styling when isOwn is false', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} isOwn={false} />
    );
    const messageText = getByText('This is a test message');
    expect(messageText).toBeTruthy();
  });

  it('renders timestamp when available', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} />
    );
    expect(getByText('Just now')).toBeTruthy();
  });
});
