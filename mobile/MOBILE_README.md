# EgyptLawyers Mobile App - Complete Feature Guide

Welcome to the EgyptLawyers mobile app! This comprehensive native React Native application provides features for lawyers to network, share legal help requests, and collaborate.

## 🚀 Features Implemented

### 1. **Authentication System**

- **Lawyer Login**: Sign in with WhatsApp number and password
- **Lawyer Registration**: Create a new account with:
  - Full name
  - Professional title (optional)
  - Syndicate card number
  - WhatsApp number
  - Password confirmation
  - Select active cities (multi-select)
- **Secure Token Storage**: JWT tokens are securely stored using `expo-secure-store`
- **Auto-login**: Previous session is restored on app launch

### 2. **Home Feed / Posts Feed**

- **Browse Help Posts**: View all help posts from lawyers
- **Pull-to-Refresh**: Manually refresh the feed
- **Post Information**:
  - Court ID
  - Creation date
  - Post description (truncated preview)
  - Post status (Open/Closed)
- **Navigation**: Tap any post to view full details and replies

### 3. **Create Help Posts**

- **Court Selection**:
  - Select a city first
  - Courts are filtered by selected city
  - Dynamic court loading
- **Description**: Add detailed description of legal help request
- **Post Creation**: Submit and receive confirmation
- **Automatic Navigation**: Redirected to feed after successful creation

### 4. **Post Details & Replies**

- **Full Post View**: Complete post information
- **Replies Section**: View all replies to a specific post
- **Post Metadata**:
  - Full description
  - Court information
  - Creation timestamp
  - Verification status
- **Reply System**:
  - View existing replies from other lawyers
  - Add your own replies
  - Real-time reply posting
  - Reply counter showing total replies

### 5. **User Profile**

- **Profile Information**:
  - Full name with avatar initial
  - Verification status (Pending/Approved/Rejected)
  - WhatsApp number
  - Syndicate card number
  - Professional title (if provided)
  - Account status (Active/Suspended)
  - Lawyer ID
- **Verification Status Color Coding**:
  - Green: Approved
  - Orange: Pending
  - Red: Rejected
- **Session Management**: Logout with confirmation dialog

### 6. **Tab Navigation**

- **Feed Tab**: Browse and create help posts
- **Profile Tab**: View and manage profile, logout

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   └── common.tsx          # Reusable UI components
│   ├── lib/
│   │   ├── api.ts               # Axios API client setup
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   ├── authToken.ts          # Secure token management
│   │   ├── config.ts             # API configuration
│   │   ├── services.ts           # API service functions
│   │   └── types.ts              # TypeScript interfaces
│   ├── navigation/
│   │   └── RootNavigator.tsx     # Navigation structure
│   └── screens/
│       ├── LoginScreen.tsx       # Login page
│       ├── RegisterScreen.tsx    # Registration page
│       ├── HomeScreen.tsx        # Posts feed
│       ├── CreatePostScreen.tsx  # Create help post
│       ├── PostDetailsScreen.tsx # Post details with replies
│       └── ProfileScreen.tsx     # User profile
├── App.tsx                       # App entry point
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

## 🔌 API Integration

All features are connected to the backend API:

### Authentication Endpoints

- `POST /lawyers/register` - Register new lawyer
- `POST /lawyers/login` - Login with credentials
- `GET /lawyers/me` - Get current lawyer profile

### Data Endpoints

- `GET /cities` - List all cities
- `GET /cities/{id}/courts` - Get courts by city

### Help Posts Endpoints

- `POST /help-posts` - Create new help post
- `GET /help-posts` - List all help posts (with city/court filters)
- `GET /help-posts/{id}` - Get post details with replies
- `POST /help-posts/{id}/replies` - Add reply to post

## 🛠 Technology Stack

- **React Native** (0.83.2)
- **TypeScript** for type safety
- **React Navigation** for navigation
  - Native Stack Navigator
  - Bottom Tab Navigator
- **Axios** for HTTP requests
- **Expo Secure Store** for secure token storage
- **React Native Picker** for dropdown selections

## 🎨 UI Components

### Reusable Components (common.tsx)

- **Button**: Primary and secondary button variants with loading states
- **TextInput**: Styled input with support for multiline and secure text
- **Card**: Touchable card container for list items
- **Container**: Basic container wrapper
- **Loading**: Loading spinner with optional message
- **ErrorMessage**: Error display with optional retry button

## 🔐 Security Features

- JWT token-based authentication
- Secure token storage using Expo Secure Store
- Auto-login on app start with stored token
- Protected routes - unauthenticated users see login/register only
- Token cleanup on logout
- Error handling for authentication failures

## 📱 User Flows

### New User Flow

1. Launch app → Login screen
2. Click "Register" → Registration screen
3. Fill form with required details
4. Select active cities
5. Submit → Success message → Redirected to login
6. Login with credentials → Home feed

### Existing User Flow

1. Launch app → Auto-login with saved token
2. Home feed displays available help posts
3. Create post: Click "New Post" button
4. View post: Tap any post in the feed
5. Reply to post: Enter message and tap "Post Reply"
6. View profile: Tap profile tab
7. Logout: Tap "Logout" button

### Creating a Help Post

1. From home screen, tap "+ New Post"
2. Select city (automatically loads courts)
3. Select court from dropdown
4. Enter post description
5. Submit → Confirmation → Return to feed

### Viewing & Replying to Posts

1. Tap any post in the feed
2. View post details and existing replies
3. Scroll to reply form
4. Enter reply message
5. Tap "Post Reply"
6. Reply appears in replies list

## 🚀 Running the App

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# For Android
npm run android

# For iOS
npm run ios

# For web
npm run web
```

## 🔄 State Management

- **AuthContext**: Manages authentication state, user profile, and session
- **Component State**: Individual screens manage their own UI state
- **API Services**: Centralized service functions for all backend calls

## 📝 Notes

- All timestamps are in UTC and converted to local time for display
- Post descriptions are truncated to 100 characters in feed view
- Courts are dynamically loaded based on selected city
- Cities can be multi-selected during registration
- Verification status must be "Approved" for full functionality
- All API requests include authentication token (if available)

## 🔧 Configuration

### API Base URL

Configure in `src/lib/config.ts`:

- Android: `http://10.0.2.2:5215` (default)
- iOS/Web: `http://localhost:5215` (default)
- Override: Use `EXPO_PUBLIC_API_BASE_URL` environment variable

### Token Storage

- Secure storage key: `lawyer_token_v1`
- Stored in device's secure storage
- Cleared on logout

## ✨ Key Highlights

✅ **Complete Authentication System** with secure token management  
✅ **Intuitive Navigation** with tab-based layout  
✅ **Real-time Data** fetching from backend API  
✅ **Error Handling** with user-friendly messages  
✅ **Pull-to-Refresh** for feed updates  
✅ **Loading States** for better UX  
✅ **Type-Safe** with full TypeScript support  
✅ **Responsive Design** that works on all screen sizes  
✅ **Offline Token Persistence** for app reopening  
✅ **Multi-language Ready** foundation with Context API

---

**Version**: 1.0.0  
**Last Updated**: March 2026

All features are fully functional and integrated with the backend API!
