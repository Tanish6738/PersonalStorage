# Network Error Troubleshooting Guide

## ✅ Issues Fixed

### 1. Deprecated API Warning
**Error:** `ImagePicker.MediaTypeOptions` deprecated
**Fix:** Updated to use `mediaTypes: ['images']` instead

### 2. Network Error
**Error:** `Network Error` when creating records
**Fix:** Updated `.env` to use correct IP address for physical device testing

## 🔧 Current Configuration

**Frontend API URL:**
```env
EXPO_PUBLIC_API_URL=http://192.168.29.238:5000/api
```

**Backend Server:**
```
http://192.168.29.238:5000
```

## ✅ Verification Steps

### 1. Check Backend is Running
```powershell
# In Backend terminal, you should see:
Server running on port 5000
Connected to MongoDB
```

### 2. Test Backend API
Open browser and visit:
```
http://192.168.29.238:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 3. Check Network Connection
- ✅ Phone and computer on **same WiFi network**
- ✅ Firewall allows connections on port 5000
- ✅ IP address `192.168.29.238` is correct

### 4. Restart Expo Server
After changing `.env`, always restart:
```powershell
npx expo start --clear
```

## 🔍 Common Network Issues

### Issue 1: "Network Error" on Device

**Causes:**
- Backend not running
- Wrong IP address in `.env`
- Device on different WiFi network
- Firewall blocking port 5000

**Solutions:**
1. Verify backend is running: `cd Backend && npm run dev`
2. Check your IP: `ipconfig` (look for IPv4 Address)
3. Update `.env` with correct IP
4. Restart Expo: `npx expo start --clear`
5. Check Windows Firewall allows Node.js

### Issue 2: "localhost" doesn't work on device

**Why:**
`localhost` refers to the device itself, not your computer

**Solution:**
Always use your computer's IP address (e.g., `192.168.29.238`)

### Issue 3: Works on WiFi but not mobile data

**Why:**
Your computer and phone must be on the same local network

**Solution:**
- Use WiFi on both devices
- For production, deploy backend to cloud (Render, Railway)

### Issue 4: Firewall blocking connections

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and check both Private and Public
4. Click OK

**Or temporarily disable for testing:**
```powershell
# Run as Administrator (NOT RECOMMENDED for production)
netsh advfirewall set allprofiles state off
```

## 🧪 Testing API Connection

### Test 1: Browser Test
```
http://192.168.29.238:5000/health
```
Should return JSON response

### Test 2: Get All Records
```
http://192.168.29.238:5000/api/records
```
Should return:
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

### Test 3: cURL Test
```powershell
curl http://192.168.29.238:5000/health
```

### Test 4: From Phone Browser
Open phone browser and visit:
```
http://192.168.29.238:5000/health
```

If this works but app doesn't:
- Issue is in app code, not network
- Check console logs in Expo

## 📱 Expo App Console

To see detailed errors:
1. Shake device (or Ctrl+M on Android, Cmd+D on iOS)
2. Select "Show Element Inspector" or "Debug"
3. Check console for detailed error messages

## 🔄 Quick Reset Process

If nothing works, try this:

1. **Stop All Servers**
   ```powershell
   # Press Ctrl+C in both terminals
   ```

2. **Clear Expo Cache**
   ```powershell
   cd Frontend
   npx expo start --clear
   ```

3. **Restart Backend**
   ```powershell
   cd Backend
   npm run dev
   ```

4. **Verify Environment**
   - Check `Frontend/.env` has correct IP
   - Check `Backend/.env` has MongoDB and Cloudinary credentials

5. **Test Connection**
   - Browser: `http://192.168.29.238:5000/health`
   - App: Reload (press `r` in Expo terminal)

## 📝 Environment Variables Checklist

### Backend (.env)
```env
✅ PORT=5000
✅ MONGODB_URI=mongodb+srv://...
✅ CLOUDINARY_CLOUD_NAME=...
✅ CLOUDINARY_API_KEY=...
✅ CLOUDINARY_API_SECRET=...
```

### Frontend (.env)
```env
✅ EXPO_PUBLIC_API_URL=http://192.168.29.238:5000/api
```

## 🎯 Current Status

After fixes applied:
- ✅ Deprecation warning fixed
- ✅ API URL updated for device testing
- ✅ CORS enabled on backend
- ✅ Expo server restarted with `--clear` flag

**Next Steps:**
1. Wait for Expo server to fully start
2. Scan QR code again on phone
3. Try creating a record
4. If still fails, check backend logs for errors

## 💡 Pro Tips

1. **Always use IP address** (not localhost) for device testing
2. **Restart Expo** after changing `.env`
3. **Check backend logs** for detailed error messages
4. **Test API in browser** before testing in app
5. **Keep terminals visible** to see errors in real-time

## 🆘 Still Having Issues?

1. Share screenshot of backend terminal
2. Share screenshot of frontend terminal
3. Share error from phone (shake device → debug console)
4. Verify: `ipconfig` shows `192.168.29.238`
5. Verify: Backend terminal shows "Server running on port 5000"
