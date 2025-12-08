# Chat App

A React Native chat application demonstrating modern mobile development patterns with infinite scroll, optimistic updates, and comprehensive state management.

## Features

- **Contact List**: Infinite scrolling with pull-to-refresh
- **Real-time Messaging**: Optimistic updates for instant feedback
- **User Profiles**: View details and block/unblock users
- **Smooth Animations**: LayoutAnimation for seamless transitions
- **Blocking System**: Prevents messaging blocked users

## Tech Stack

- **React Native** (Expo ~54.0) - Cross-platform framework
- **TypeScript** (~5.9) - Type safety
- **React Query** (v5) - Server state management with caching
- **Zustand** (v5) - Lightweight global state
- **React Navigation** (v7) - Bottom tabs + stack navigation
- **Axios** - HTTP client

## Quick Start

### Prerequisites

- Expo Go app installed on your physical device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- For iOS Simulator: Xcode installed (macOS only)
- For Android Emulator: Android Studio with emulator setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/taha-mohd92/chat-app.git
   cd chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npx expo start
   ```

   **Note:** If you see a development build prompt, press `s` to switch to Expo Go mode.

### Running the App

#### Option 1: Physical Device (Recommended)

1. Open Expo Go app on your device
2. Scan the QR code displayed in your terminal
3. Wait for the app to load

#### Option 2: iOS Simulator (macOS only)

- Press `i` in the terminal

#### Option 3: Android Emulator

- Ensure your emulator is running
- Press `a` in the terminal, or

### Common Commands

```bash
npm start              # Start Expo development server
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npx expo start -c     # Start with cache cleared (fixes bundler issues)
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContactItem.tsx      # Contact list item with avatar
│   ├── MessageBubble.tsx    # Chat message bubble
│   └── EmptyState.tsx       # Loading/empty placeholders
├── screens/             # Main application screens
│   ├── ChatsScreen.tsx      # Contact list (infinite scroll)
│   ├── ChatScreen.tsx       # Individual chat interface
│   ├── ProfileScreen.tsx    # User profile with block/unblock
│   └── SettingsScreen.tsx   # App settings
├── navigation/
│   └── AppNavigator.tsx     # Navigation configuration
├── hooks/
│   └── useAPI.ts            # React Query hooks
├── services/
│   ├── api.ts               # Axios instance
│   └── userService.ts       # API methods
├── store/
│   └── userStore.ts         # Zustand store (blocked users)
├── types/
│   └── index.ts             # TypeScript definitions
└── utils/
    ├── helpers.ts           # Utility functions
    └── constants.ts         # App constants
```

## Architecture Highlights

### 1. State Management Strategy

**Two-tier approach for optimal performance:**

- **Server State** (React Query)

  - User data, messages, API responses
  - Automatic caching and background refetching
  - Optimistic updates for instant UI feedback
  - Infinite queries for pagination

- **Client State** (Zustand)
  - Blocked users list
  - Uses `Set` data structure for O(1) lookup performance
  - Minimal boilerplate, no provider needed

### 2. React Query Implementation

**Infinite Scroll with useInfiniteQuery:**

Uses React Query's infinite query pattern to load contacts in batches of 10 as the user scrolls. The `getNextPageParam` function determines if more pages are available based on the previous page size.

**Optimistic Updates for Better UX:**

When sending messages, the UI updates immediately before the server responds. If the request succeeds, the optimistic message is replaced with the server response. On failure, the UI automatically rolls back to the previous state.

### 3. Navigation Architecture

**Nested Navigation Pattern:**

- Bottom Tab Navigator for primary screens (Chats, Settings)
- Stack Navigator for detail screens (Chat, Profile)
- Type-safe navigation with TypeScript

Navigation parameters are strongly typed to ensure type safety throughout the app. Each screen receives only the data it needs.

### 4. Performance Optimizations

- **React.memo**: Wraps `ContactItem` and `MessageBubble` to prevent unnecessary re-renders
- **useCallback**: Memoizes event handlers in `ChatsScreen`
- **FlatList**: Virtualized lists with proper `keyExtractor`
- **LayoutAnimation**: Smooth transitions when navigating
- **React Query Cache**: `staleTime: 30s`, `gcTime: 5min` for optimal caching

### 5. TypeScript Integration

Strong typing throughout the application:

- All API responses typed with interfaces
- Navigation params type-checked
- Component props validated
- Service layer fully typed

### 6. Error Handling & UX

- **Loading States**: Activity indicators during data fetching
- **Empty States**: Clear messaging with icons when no data
- **Error States**: User-friendly error messages with retry options
- **Pull-to-Refresh**: Swipe down to manually refresh data
- **Blocking Logic**: Disabled message input when user is blocked

### 7. Component Design Philosophy

**Separation of Concerns:**

- **Screens** (Container components): Handle business logic and data fetching
- **Components** (Presentational): Focus on UI rendering
- **Hooks**: Encapsulate reusable logic
- **Services**: Abstract API communication

This architecture ensures testability, reusability, and maintainability.

## Testing

Run tests with the following commands:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**Test Coverage:**

- 18 tests across 5 test suites
- Components: ContactItem, MessageBubble, EmptyState
- Hooks: useAPI (infinite queries, mutations)
- Screens: ChatsScreen

## Key Implementation Details

### Blocked Users Feature

When a user is blocked:

- ✅ Remains visible in contacts list
- ✅ Profile shows "Unblock" button
- ✅ Chat input disabled with message
- ✅ State persists during app session

### Message Flow

1. User types message and presses send
2. Message appears instantly (optimistic update)
3. API request sent in background
4. On success: Replace with server message
5. On failure: Remove and show error

### Infinite Scroll Mechanism

1. User scrolls to bottom of contact list
2. `onEndReached` triggered at 50% threshold
3. React Query fetches next page
4. New contacts appended to existing list
5. Loading indicator shown during fetch

## API Integration

Uses `responserift.dev` demo API:

- `GET /api/users?offset={}&limit={}` - Fetch paginated users
- `GET /api/users/{id}` - Fetch single user
- `GET /api/posts?userId={id}` - Fetch messages
- `POST /api/posts` - Send message

## Development Notes

- **Expo Go Mode**: Using Expo Go for faster development (no native builds required)
- **Keyboard Avoidance**: Proper handling for chat input with `KeyboardAvoidingView`
