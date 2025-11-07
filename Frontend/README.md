# Work Records - Frontend

React Native mobile app built with Expo for recording work details with images and bills.

## Features

- 📸 Capture photos or select from gallery
- 📝 Add work descriptions and titles
- 💰 Record bill amounts
- 📋 View all work records in a list
- 🔍 View detailed record information
- 🗑️ Delete records
- 🔄 Pull to refresh

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Update `.env` file with your backend URL:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   ```

   **For physical device testing:**
   - Find your computer's IP address:
     - Windows: Run `ipconfig` in PowerShell
     - Mac/Linux: Run `ifconfig` in terminal
   - Update the URL:
     ```env
     EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
     ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run the app**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator (Mac only)

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   └── RecordCard.js          # Record list item component
│   ├── screens/
│   │   ├── HomeScreen.js           # Main list screen
│   │   ├── AddRecordScreen.js      # Create new record
│   │   └── RecordDetailScreen.js   # View record details
│   ├── services/
│   │   └── api.js                  # API service layer
│   └── utils/
│       └── dateFormat.js           # Date formatting utilities
├── App.js                          # Navigation setup
├── app.json                        # Expo configuration
└── .env                            # Environment variables
```

## Screens

### Home Screen
- Displays all work records
- Pull to refresh
- Floating action button to add new record
- Tap on record to view details

### Add Record Screen
- Take photo with camera
- Choose images from gallery
- Enter title (optional)
- Enter description (required)
- Enter bill amount (required)
- Submit to create record

### Record Detail Screen
- View all images (swipe to navigate)
- View title, description, bill amount
- View creation date
- Delete record

## API Configuration

The app connects to your backend API. Make sure:

1. Backend is running on `http://localhost:5000`
2. If testing on physical device, update `.env` with your computer's IP
3. Backend CORS is configured to allow requests from your device

## Permissions

The app requires the following permissions:

- **Camera**: To take photos of work
- **Photo Library**: To select existing images

Permissions are requested at runtime when needed.

## Testing

### Emulator/Simulator
```bash
# Android
npx expo start --android

# iOS (Mac only)
npx expo start --ios
```

### Physical Device
1. Install Expo Go from App Store or Play Store
2. Make sure your device is on the same WiFi as your computer
3. Scan the QR code from `npx expo start`

## Troubleshooting

### Cannot connect to backend

**Problem**: App shows connection errors

**Solution**:
- Check backend is running on correct port
- Update `.env` with correct IP address
- Ensure device and computer are on same network
- Check firewall settings

### Images not uploading

**Problem**: Images fail to upload

**Solution**:
- Check Cloudinary credentials in backend `.env`
- Verify file size (< 10MB)
- Check network connection
- Review backend logs

### Permission denied

**Problem**: Camera/gallery access denied

**Solution**:
- Grant permissions when prompted
- Check app permissions in device settings
- Reinstall app if permissions are stuck

## Building for Production

### Create development build
```bash
npx expo install expo-dev-client
npx expo prebuild
```

### Build Android APK
```bash
eas build --platform android --profile preview
```

### Build iOS
```bash
eas build --platform ios --profile preview
```

Note: You'll need an Expo account. Run `eas login` first.

## Technologies

- **React Native**: Mobile framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Axios**: HTTP client
- **Expo Image Picker**: Image selection
- **Expo Camera**: Camera access

## License

MIT
