Below is the updated documentation with **no authentication**, clear **API structure**, and **frontend requirements**.

---

## **Project Overview**

This application allows users to **record work details** with **images**, **bill information**, and **date & time** of each entry. Users can take photos, attach bill descriptions, and store everything in a centralized record list with **powerful search, filter, and edit capabilities**.

### **✨ Key Features**

- 📷 **Image Management**: Upload multiple images (up to 10) with automatic cloud storage
- �️ **Full-Screen Viewer**: Tap any image to view in full-screen mode (NEW!)
- 📥 **Download Images**: Save images to your device gallery (NEW!)
- �📝 **Record Keeping**: Title, description, and bill amount tracking
- 🔍 **Advanced Search**: Find records instantly by keywords in title or description
- 📊 **Smart Sorting**: Sort by date, amount, or title (ascending/descending)
- 🎛️ **Flexible Filtering**: Filter by date range and amount range
- ✏️ **Easy Editing**: Update records with a tap, including image replacement
- 📅 **Automatic Timestamps**: Track when records were created and updated
- 📱 **Mobile-First Design**: Clean, intuitive UI built with React Native
- ☁️ **Cloud Storage**: Images stored on Cloudinary, data in MongoDB Atlas

All data is stored in **MongoDB**, images uploaded to **Cloudinary**, and the app UI built using **Expo + React Native**.

---

## **Tech Stack**

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Frontend      | React Native (Expo)                 |
| Backend       | Node.js + Express                   |
| Database      | MongoDB (MongoDB Atlas recommended) |
| Image Storage | Cloudinary                          |
| Communication | REST API (JSON)                     |

---

## **Installation & Setup**

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

### **Backend Setup**

1. **Navigate to backend directory**

```bash
cd Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Install additional required packages**

```bash
npm install multer cloudinary multer-storage-cloudinary
```

4. **Create `.env` file in Backend directory**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/workrecords?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. **Get Cloudinary credentials**

- Sign up at [https://cloudinary.com](https://cloudinary.com)
- Go to Dashboard
- Copy: Cloud Name, API Key, API Secret
- Paste them in `.env` file

6. **Get MongoDB connection string**

- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster (free tier available)
- Click "Connect" → "Connect your application"
- Copy connection string and replace `<username>` and `<password>`

7. **Start the backend server**

```bash
npm start
```

Or for development with auto-reload:

```bash
npm install -D nodemon
npm run dev
```

Add to `package.json` scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### **Frontend Setup (Expo)**

1. **Navigate to project root**

```bash
cd ..
```

2. **Create Expo app**

```bash
npx create-expo-app Frontend
cd Frontend
```

3. **Install required packages**

```bash
npm install axios expo-image-picker @react-navigation/native @react-navigation/native-stack
npx expo install expo-camera react-native-screens react-native-safe-area-context expo-media-library expo-file-system
```

4. **Create `.env` file in Frontend directory**

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

For physical device testing, replace `localhost` with your computer's local IP address (e.g., `http://192.168.1.100:5000`)

5. **Start Expo development server**

```bash
npx expo start
```

---

---

## **Cloudinary Configuration**

### **Setup Steps:**

1. **Sign up at Cloudinary**
   - Visit [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
   - Create a free account

2. **Get your credentials**
   - After login, go to Dashboard
   - You'll see:
     - Cloud Name
     - API Key
     - API Secret

3. **Configure folder structure** (Optional but recommended)
   - In Cloudinary Dashboard → Media Library
   - Create a folder named `work_records`
   - Images will be automatically organized here

4. **Environment variables**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### **Image Upload Features:**

- **Automatic optimization**: Images are automatically compressed
- **Format conversion**: Supports JPEG, PNG, WEBP
- **Transformations**: Can resize/crop images on-the-fly
- **CDN delivery**: Fast image loading worldwide
- **Free tier**: 25 GB storage, 25 GB bandwidth/month

### **Image URL Format:**

```
https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{filename}
```

Example:
```
https://res.cloudinary.com/myapp/image/upload/v1699356000/work_records/photo_1699356000123.jpg
```

---

## **Data Model (MongoDB Schema)**

**Work Record Document**

```javascript
{
  _id: ObjectId,               // Auto-generated by MongoDB
  title: String,               // Optional label for the record
  description: String,         // Notes or details of the work (required)
  billAmount: Number,          // Cost or billing value (required)
  imageUrls: [String],         // Array of Cloudinary URLs (required, min 1)
  createdAt: Date,             // Auto-generated timestamp
  updatedAt: Date              // Auto-updated on modifications
}
```

**Schema Validation:**

- `description`: Required, min length 3 characters
- `billAmount`: Required, must be positive number
- `imageUrls`: Required, must contain at least 1 image
- `title`: Optional, max length 100 characters

**Example Document:**

```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "title": "Kitchen Renovation",
  "description": "Installed new cabinets, replaced countertops, and updated lighting",
  "billAmount": 2500,
  "imageUrls": [
    "https://res.cloudinary.com/myapp/image/upload/v1699356000/work_records/kitchen_before.jpg",
    "https://res.cloudinary.com/myapp/image/upload/v1699356001/work_records/kitchen_after.jpg"
  ],
  "createdAt": "2025-11-07T10:30:00.000Z",
  "updatedAt": "2025-11-07T10:30:00.000Z"
}
```

---

---

## **Backend API Endpoints**

> 📘 **Full API Documentation**: See [`Backend/API_DOCUMENTATION.md`](Backend/API_DOCUMENTATION.md) for complete details, examples, and query parameters.

### **Base URL**

```
http://localhost:5000/api
```

### **Endpoints Overview**

#### **1. Create a New Work Record**

```http
POST /api/records
Content-Type: multipart/form-data
```

**Features:**
- Upload 1-10 images
- Optional title field
- Required description and bill amount

#### **2. Get All Work Records (with Search, Filter & Sort)**

```http
GET /api/records
```

**New Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in title/description | `?search=laptop` |
| `sort` | string | Sort field (prefix `-` for desc) | `?sort=-billAmount` |
| `startDate` | string | Filter from date | `?startDate=2025-01-01` |
| `endDate` | string | Filter to date | `?endDate=2025-12-31` |
| `minAmount` | number | Minimum bill amount | `?minAmount=1000` |
| `maxAmount` | number | Maximum bill amount | `?maxAmount=50000` |
| `limit` | number | Records per page (default: 50) | `?limit=20` |
| `skip` | number | Pagination offset | `?skip=20` |

**Sort Options:**
- `createdAt` / `-createdAt` - Date (oldest/newest)
- `billAmount` / `-billAmount` - Amount (lowest/highest)
- `title` / `-title` - Title (A-Z / Z-A)

**Example Requests:**
```bash
# Search for "laptop" records
GET /api/records?search=laptop

# Get records between ₹5,000 and ₹50,000, sorted by highest amount
GET /api/records?minAmount=5000&maxAmount=50000&sort=-billAmount

# Get records from January 2025
GET /api/records?startDate=2025-01-01&endDate=2025-01-31

# Combined: Search + Filter + Sort
GET /api/records?search=repair&minAmount=1000&sort=-createdAt&limit=10
```

#### **3. Update Work Record (Enhanced)**

```http
PUT /api/records/:id
Content-Type: multipart/form-data OR application/json
```

**What's New:**
- ✅ Can update text fields only (JSON)
- ✅ Can replace images (multipart/form-data)
- ✅ Old images automatically deleted from Cloudinary when replaced

**Example - Update text only:**
```javascript
PUT /api/records/64f5a1b2c3d4e5f6g7h8i9j0
{
  "title": "Updated Title",
  "billAmount": 3000
}
```

**Example - Update with new images:**
```javascript
const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('description', 'Updated description');
formData.append('billAmount', 3000);
formData.append('images', imageFile1);
formData.append('images', imageFile2);
```

#### **4. Other Endpoints**

- `GET /api/records/:id` - Get single record
- `DELETE /api/records/:id` - Delete record (and images)
- `GET /api/records/stats` - Get statistics (total records, bill amounts)

📘 **See [Backend/API_DOCUMENTATION.md](Backend/API_DOCUMENTATION.md) for complete API reference with all examples and responses.**

---

## **Backend Structure**

```
/Backend
  /.env                      # Environment variables
  /node_modules
  /src
    /models
      WorkRecord.js          # MongoDB schema
    /routes
      records.js             # API route handlers
    /controllers
      recordsController.js   # Business logic
    /config
      cloudinary.js          # Cloudinary configuration
      database.js            # MongoDB connection
    /middleware
      upload.js              # Multer + Cloudinary setup
    app.js                   # Express app setup
  server.js                  # Entry point
  package.json
```

### **Complete Package.json**

```json
{
  "name": "work-records-backend",
  "version": "1.0.0",
  "description": "Backend for work records app",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.19.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^2.0.0",
    "multer-storage-cloudinary": "^4.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## **Frontend Requirements (Expo + React Native)**

### **Project Structure**

```
/Frontend
  /.env
  /src
    /screens
      HomeScreen.js          # List all work records with search, filter, sort
      AddRecordScreen.js     # Create new record with images
      EditRecordScreen.js    # Edit existing records (NEW!)
      RecordDetailScreen.js  # View full record details
    /components
      RecordCard.js          # Single record item
    /services
      api.js                 # API call functions
    /utils
      dateFormat.js          # Date formatting helpers
  App.js
  package.json
```

### **Screens**

| Screen | Purpose | Features |
|--------|---------|----------|
| **Home / List Screen** | Displays work records list | 🔍 Search bar, 📊 Sort/filter modal, Pull-to-refresh, Infinite scroll |
| **Add Record Screen** | Create new records | 📷 Camera/gallery, Form validation, Multi-image upload |
| **Edit Record Screen** | Modify existing records | ✏️ Edit all fields, Replace images, Pre-filled form |
| **Record Details Screen** | View full record | 🖼️ Image carousel, 🔍 Full-screen viewer, 📥 Download images, Edit/delete buttons, Full details |

### **Key Frontend Libraries**

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "expo": "~51.0.0",
    "expo-image-picker": "~15.0.0",
    "expo-camera": "~15.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-screens": "~3.31.0",
    "react-native-safe-area-context": "^4.10.0"
  }
}
```

### **App Permissions (app.json)**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to upload work images",
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to take work photos"
        }
      ]
    ]
  }
}
```

### **State Handling**

Use React hooks (useState, useEffect) or Context API for simple state management. No authentication required, so no need for complex state libraries.

### **API Service Example**

```javascript
// src/services/api.js
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl || 'http://localhost:5000/api';

export const recordsAPI = {
  // Get all records
  getAll: async (params = {}) => {
    const response = await axios.get(`${API_URL}/records`, { params });
    return response.data;
  },
  
  // Get single record
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/records/${id}`);
    return response.data;
  },
  
  // Create new record
  create: async (formData) => {
    const response = await axios.post(`${API_URL}/records`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  // Update record
  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/records/${id}`, data);
    return response.data;
  },
  
  // Delete record
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/records/${id}`);
    return response.data;
  }
};
```

---

---

## **Frontend to Backend Data Flow**

### **Creating a New Record**

1. **User opens Add Record Screen**
2. **User captures/selects images** → stored temporarily in app state
3. **User enters:**
   - Work title (optional)
   - Work description (required)
   - Bill amount (required)
4. **User presses Save button**
5. **Frontend creates FormData and sends to backend:**

```javascript
// AddRecordScreen.js
const handleSubmit = async () => {
  try {
    const formData = new FormData();
    
    // Append text fields
    if (title) formData.append('title', title);
    formData.append('description', description);
    formData.append('billAmount', parseFloat(billAmount));
    
    // Append images
    selectedImages.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: 'image/jpeg',
        name: `photo_${Date.now()}_${index}.jpg`
      });
    });
    
    // Send to backend
    const response = await axios.post(
      `${API_URL}/records`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Record created:', response.data);
    // Navigate back to home screen
    navigation.navigate('Home');
    
  } catch (error) {
    console.error('Error creating record:', error);
    Alert.alert('Error', 'Failed to create record');
  }
};
```

6. **Backend process:**
   - Receives multipart form data
   - Validates input fields
   - Uploads images to Cloudinary
   - Stores Cloudinary URLs in MongoDB
   - Returns created record

7. **Frontend receives response:**
   - Shows success message
   - Navigates back to list screen
   - Refreshes list to show new record

### **Image Selection Example**

```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImages = async () => {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please grant camera roll permissions');
    return;
  }
  
  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    allowsEditing: false
  });
  
  if (!result.canceled) {
    setSelectedImages(result.assets);
  }
};

const takePicture = async () => {
  // Request camera permissions
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please grant camera permissions');
    return;
  }
  
  // Launch camera
  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: true,
    aspect: [4, 3]
  });
  
  if (!result.canceled) {
    setSelectedImages([...selectedImages, result.assets[0]]);
  }
};
```

---

---

## **Date & Time Handling**

### **Backend**

Automatically assigns timestamps using MongoDB:

```javascript
// In WorkRecord model
const workRecordSchema = new Schema({
  // ... other fields
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});
```

### **Frontend**

Format dates for display:

```javascript
// src/utils/dateFormat.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Format: Nov 7, 2025 at 10:30 AM
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Usage in component
<Text>{formatDate(record.createdAt)}</Text>
```

### **Relative Time Display**

```javascript
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  
  return formatDate(dateString);
};
```

---

## **Testing the API**

### **Using Postman**

1. **Create a new record:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/records`
   - Body: `form-data`
     - `title`: "Test Work"
     - `description`: "Testing the API"
     - `billAmount`: 100
     - `images`: [Select image files]

2. **Get all records:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/records`

3. **Get single record:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/records/{id}`

4. **Update record:**
   - Method: `PUT`
   - URL: `http://localhost:5000/api/records/{id}`
   - Body: `raw JSON`
   ```json
   {
     "title": "Updated Title",
     "billAmount": 150
   }
   ```

5. **Delete record:**
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/records/{id}`

### **Using cURL (PowerShell)**

```powershell
# Get all records
curl http://localhost:5000/api/records

# Get single record
curl http://localhost:5000/api/records/{id}

# Create record with image
curl -X POST http://localhost:5000/api/records `
  -F "title=Test Work" `
  -F "description=Testing API" `
  -F "billAmount=100" `
  -F "images=@C:\path\to\image.jpg"

# Update record
curl -X PUT http://localhost:5000/api/records/{id} `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Updated\",\"billAmount\":200}'

# Delete record
curl -X DELETE http://localhost:5000/api/records/{id}
```

---

---

## **Deployment**

### **Backend Deployment (Render / Railway)**

#### **Using Render (Recommended)**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: work-records-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**
   - In Render dashboard → Environment
   - Add all variables from `.env`:
     - `MONGODB_URI`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `PORT` (Render sets this automatically)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Get your live URL: `https://work-records-api.onrender.com`

#### **Using Railway**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add environment variables**
   ```bash
   railway variables set MONGODB_URI="your_mongo_uri"
   railway variables set CLOUDINARY_CLOUD_NAME="your_cloud_name"
   railway variables set CLOUDINARY_API_KEY="your_api_key"
   railway variables set CLOUDINARY_API_SECRET="your_api_secret"
   ```

### **Frontend Deployment (Expo)**

#### **Development Build (EAS)**

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas login
   eas build:configure
   ```

3. **Update API URL in .env**
   ```env
   EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

5. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

#### **Expo Go (Testing Only)**

Update backend URL to deployed URL and use Expo Go app for testing.

### **MongoDB Atlas Setup**

1. **Create cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster

2. **Configure network access**
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

3. **Create database user**
   - Database Access → Add New Database User
   - Set username and password

4. **Get connection string**
   - Databases → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password

---

## **Environment Variables Summary**

### **Backend (.env)**

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/workrecords?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Frontend (.env)**

```env
# Development
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Production (after deployment)
# EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

---

## **Troubleshooting**

### **Common Issues**

1. **Cannot connect to backend from mobile device**
   - Solution: Use your computer's local IP instead of localhost
   - Find IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Update: `EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api`

2. **CORS errors**
   - Solution: Ensure CORS is configured in backend
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

3. **Image upload fails**
   - Check Cloudinary credentials in `.env`
   - Verify file size limit (default: 10MB)
   - Check Cloudinary free tier limits

4. **MongoDB connection timeout**
   - Verify connection string
   - Check network access whitelist in MongoDB Atlas
   - Ensure password doesn't contain special characters (URL encode if needed)

5. **"Module not found" errors**
   - Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## **Next Steps**

1. ✅ Set up MongoDB Atlas account
2. ✅ Create Cloudinary account and get credentials
3. ✅ Install backend dependencies and configure `.env`
4. ✅ Test API endpoints using Postman (see [`Backend/POSTMAN_TESTING_GUIDE.md`](Backend/POSTMAN_TESTING_GUIDE.md))
5. ✅ Create Expo frontend app
6. ✅ Implement screens and connect to API
7. ✅ Test search, filter, and edit features
8. ✅ Test on physical device
9. ✅ Deploy backend to Render/Railway
10. ✅ Build mobile app with EAS

---

## **📚 Documentation**

- 📘 **[API Documentation](Backend/API_DOCUMENTATION.md)** - Complete API reference with examples
- 📖 **[Features Guide](FEATURES_GUIDE.md)** - User guide for search, sort, filter, and edit
- �️ **[Image Viewer Guide](IMAGE_VIEWER_GUIDE.md)** - Full-screen viewer and download features (NEW!)
- �🗺️ **[Folder Management Roadmap](FOLDER_MANAGEMENT_ROADMAP.md)** - Future feature implementation plan
- 📋 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Complete list of changes and features
- 🧪 **[Postman Testing Guide](Backend/POSTMAN_TESTING_GUIDE.md)** - API testing instructions

---

## **🔜 Coming Soon - Folder Management**

The next major update will include:

- 📁 **Create custom folders** - Organize records by category
- 🏷️ **Categorize records** - Assign records to folders
- 🎨 **Color-coded folders** - Visual organization
- 📊 **Per-folder statistics** - Track spending by category
- 🔍 **Filter by folder** - Quick access to related records

See the complete [Folder Management Roadmap](FOLDER_MANAGEMENT_ROADMAP.md) for details.

---

## **Resources**

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Render Deployment Guide](https://render.com/docs/deploy-node-express-app)

---

**Last Updated**: November 8, 2025 | **Version**: 2.1
