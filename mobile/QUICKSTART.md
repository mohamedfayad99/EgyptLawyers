# 🚀 Quick Start Guide - Mobile App

## Prerequisites

- Node.js 16+ installed
- npm installed
- Expo CLI (optional, expo is bundled in the project)
- Android Studio/Emulator OR Xcode/iOS Simulator (for running on device emulators)

## Installation & Setup

### 1. Install Dependencies

```bash
cd mobile
npm install --legacy-peer-deps
```

### 2. Configure API Base URL (if needed)

Edit `src/lib/config.ts` to change the API base URL:

```typescript
// Android emulator
if (Platform.OS === 'android') return 'http://10.0.2.2:5215';
// iOS/Web
return 'http://localhost:5215';
```

Or set environment variable:

```bash
export EXPO_PUBLIC_API_BASE_URL=http://your-api-url:5215
```

## Running the App

### Option 1: Expo CLI (Recommended)

```bash
# Start development server
npm start

# Choose your platform:
# - Press 'i' for iOS
# - Press 'a' for Android
# - Press 'w' for Web
# - Press 'j' for Expo Go (scan QR code with phone)
```

### Option 2: Android

```bash
npm run android
# Make sure Android emulator is running or device is connected
```

### Option 3: iOS

```bash
npm run ios
# Make sure iOS simulator is running
```

### Option 4: Web

```bash
npm run web
# Opens in browser at http://localhost:19006
```

## Testing the App

### Test Sequence

#### 1. **Test Registration**

- Tap "Register" on login screen
- Fill in all required fields
- Select at least one city
- Submit form
- You should see success message → redirected to login
- **Note**: Account will be in "Pending" state until admin approves

#### 2. **Test Login**

- Use credentials from registration
- Login should succeed if account is approved
- You'll be redirected to home feed
- **Note**: Make sure your backend user was approved by admin

#### 3. **Test Home Feed**

- View all help posts
- Try pull-to-refresh (swipe down)
- Verify posts display correctly

#### 4. **Test Create Post**

- Tap "+ New Post" button
- Select a city
- Courts should auto-load for that city
- Enter post description
- Submit
- Should be added to feed

#### 5. **Test Post Details**

- Tap any post in feed
- View full description and replies
- Scroll down to reply form

#### 6. **Test Reply**

- In post details screen
- Enter a reply message
- Tap "Post Reply"
- Reply should appear in list

#### 7. **Test Profile**

- Tap "Profile" tab
- View your account information
- Tap "Logout" → Confirm
- Should return to login screen

#### 8. **Test Session Persistence**

- Login to app
- Close app completely
- Reopen app
- You should be auto-logged in!
- Check profile data loads

## Common Issues & Solutions

### Issue: API Connection Error

**Solution:**

- Ensure backend is running (`dotnet run` in backend folder)
- Verify API URL in `src/lib/config.ts`
- Check firewall/network settings
- On Android emulator: use `10.0.2.2` instead of `localhost`

### Issue: "No matching version found" during npm install

**Solution:**

```bash
npm install --legacy-peer-deps
```

### Issue: Module not found errors

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

### Issue: Port already in use

**Solution:**

```bash
# Kill process on port 19000-19006, or specify different port
expo start --port 19007
```

### Issue: Emulator not responding

**Solution:**

- Restart emulator
- Clear Expo cache: `expo start -c`
- Check emulator has sufficient RAM

## Project Structure Overview

```
mobile/
├── src/
│   ├── components/
│   │   └── common.tsx              # Reusable UI components
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   ├── AuthContext.tsx           # Auth state
│   │   ├── services.ts               # API calls
│   │   └── types.ts                  # TypeScript types
│   ├── navigation/
│   │   └── RootNavigator.tsx         # Navigation setup
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx
│       ├── HomeScreen.tsx
│       ├── CreatePostScreen.tsx
│       ├── PostDetailsScreen.tsx
│       └── ProfileScreen.tsx
├── App.tsx                          # Entry point
└── package.json
```

## Key Features Working

✅ Register & Login
✅ Browse posts feed
✅ Create new help posts
✅ View post details
✅ Reply to posts
✅ View user profile
✅ Logout
✅ Session persistence
✅ Error handling
✅ Loading states

## Development Tips

1. **Hot Reload**: Changes to JS files reload automatically
2. **Full Reload**: Tap 'r' in terminal to do full reload
3. **Debug**: Tap 'd' in terminal to open debug menu
4. **Logs**: View console logs in terminal where you ran `npm start`
5. **TypeScript**: Errors appear in terminal before running

## Debugging

### View Logs

```bash
# While app is running
npm start
# Logs appear in the same terminal
```

### React DevTools

```bash
# Install globally
npm install -g @react-native-async-storage/async-storage

# Then use Chrome DevTools
# Open: chrome://inspect
```

## Build & Deploy

### For Android

```bash
eas build --platform android
```

### For iOS

```bash
eas build --platform ios
```

### For Deployment

```bash
eas submit --platform android
# or
eas submit --platform ios
```

Would require EAS account (expo.dev)

## Performance Tips

1. Use memoization for expensive components
2. Lazy load images
3. Optimize FlatList with `maxToRenderPerBatch`
4. Cache API responses

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **Axios Docs**: https://axios-http.com

---

**Happy Coding! 🎉**

For any issues during setup or testing, check the backend logs and ensure your API is running.
