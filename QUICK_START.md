# Quick Start Guide - Work Records App

## 🚀 Getting Started

### Backend Setup

1. **Start MongoDB** (if using local MongoDB, or ensure MongoDB Atlas is configured)

2. **Start the Backend Server**
   ```powershell
   cd Backend
   npm start
   ```
   
   Backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Start the Expo Server**
   ```powershell
   cd Frontend
   npx expo start
   ```

2. **Run on Device/Emulator**
   
   Once Expo starts, you'll see a QR code. You can:
   
   - **Press `a`** - Open on Android emulator
   - **Press `i`** - Open on iOS simulator (Mac only)
   - **Press `w`** - Open in web browser
   - **Scan QR code** - Open on physical device with Expo Go app

### Testing on Physical Device

1. **Install Expo Go**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Update Frontend .env**
   
   Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   Update `Frontend/.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:5000/api
   ```
   Example:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
   ```

3. **Ensure Same Network**
   - Your phone and computer must be on the same WiFi network

4. **Scan QR Code**
   - Android: Open Expo Go app and scan
   - iOS: Open Camera app and scan

## 📱 How to Use the App

### Creating a New Record

1. Tap the **blue (+) button** at bottom right
2. **Add Images**:
   - Tap "📷 Take Photo" to use camera
   - Tap "🖼️ Choose from Gallery" to select existing photos
   - You can add multiple images
3. **Fill Details**:
   - Title (optional): e.g., "Kitchen Renovation"
   - Description (required): Details about the work
   - Bill Amount (required): Enter the cost
4. Tap "**Create Record**"

### Viewing Records

- All records are displayed on the home screen
- **Pull down** to refresh the list
- **Tap any record** to view full details

### Viewing Record Details

- **Swipe left/right** to view multiple images
- See full description and bill amount
- Tap "**🗑️ Delete Record**" to remove

## 🔧 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas cluster is running
- Check network access whitelist in MongoDB Atlas

**"Cloudinary upload failed"**
- Verify Cloudinary credentials in `.env`
- Check Cloudinary free tier limits
- Ensure image size is under 10MB

### Frontend Issues

**"Network request failed"**
- Ensure backend is running on port 5000
- Check `EXPO_PUBLIC_API_URL` in Frontend `.env`
- For physical device: Use your computer's IP, not localhost
- Verify device and computer are on same WiFi

**"Permission denied" for camera/photos**
- Grant permissions when prompted
- Check app permissions in device Settings
- On iOS: Settings → Expo Go → Photos/Camera
- On Android: Settings → Apps → Expo Go → Permissions

**"Could not load images"**
- Check Cloudinary URLs in database
- Verify internet connection
- Check if images exist in Cloudinary dashboard

## 📋 Environment Variables Checklist

### Backend (.env)
```env
✓ PORT=5000
✓ MONGODB_URI=mongodb+srv://...
✓ CLOUDINARY_CLOUD_NAME=your_name
✓ CLOUDINARY_API_KEY=your_key
✓ CLOUDINARY_API_SECRET=your_secret
```

### Frontend (.env)
```env
# For emulator/localhost testing
✓ EXPO_PUBLIC_API_URL=http://localhost:5000/api

# For physical device testing
✓ EXPO_PUBLIC_API_URL=http://192.168.1.XXX:5000/api
```

## 🧪 Testing the Full Flow

1. **Start Backend**: `cd Backend && npm start`
2. **Start Frontend**: `cd Frontend && npx expo start`
3. **Open App**: Press `a` for Android or scan QR code
4. **Create Record**:
   - Tap (+) button
   - Add a test image
   - Fill in description: "Test work"
   - Enter amount: 100
   - Submit
5. **Verify**:
   - Record appears in list
   - Tap to view details
   - All information is correct
   - Image loads properly

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | Get all records |
| GET | `/api/records/:id` | Get single record |
| POST | `/api/records` | Create new record |
| PUT | `/api/records/:id` | Update record |
| DELETE | `/api/records/:id` | Delete record |

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Database)
- Cloudinary (Image Storage)
- Multer (File Upload)

**Frontend:**
- React Native
- Expo
- React Navigation
- Axios

## 🎯 Next Steps

- ✅ Backend running on localhost:5000
- ✅ Frontend running on Expo
- ✅ Test creating a record
- ✅ Test viewing records
- ✅ Test deleting records
- 📱 Test on physical device
- 🚀 Deploy backend to Render/Railway
- 📲 Build mobile app with EAS

## 💡 Tips

- **Development**: Use `npm run dev` in backend for auto-reload with nodemon
- **Debugging**: Check terminal logs for both backend and frontend
- **Network**: Keep device and computer on same WiFi
- **Images**: Compress large images before upload for faster performance
- **Database**: Use MongoDB Compass to view/manage data directly

## 📞 Support

If you encounter issues:
1. Check backend terminal for errors
2. Check frontend Expo console for errors
3. Verify all environment variables
4. Ensure all dependencies are installed
5. Try clearing cache: `npx expo start --clear`

---

**Happy Coding! 🎉**
