# 📬 Postman Testing Guide - Work Records API

## 🔧 Setup

### Base URL
```
http://localhost:5000
```

### Prerequisites
1. Server must be running: `npm run dev`
2. MongoDB must be connected
3. Cloudinary must be configured

---

## 📋 API Endpoints

### 1. ✅ Health Check
**GET** `/health`

#### Request
- **Method**: `GET`
- **URL**: `http://localhost:5000/health`
- **Headers**: None required

#### Expected Response
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-07T10:30:45.123Z"
}
```

#### Status Code: `200 OK`

---

### 2. 🏠 Root Endpoint
**GET** `/`

#### Request
- **Method**: `GET`
- **URL**: `http://localhost:5000/`
- **Headers**: None required

#### Expected Response
```json
{
  "success": true,
  "message": "Work Records API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "records": "/api/records",
    "stats": "/api/records/stats"
  }
}
```

#### Status Code: `200 OK`

---

### 3. ➕ Create Work Record
**POST** `/api/records`

#### Request
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/records`
- **Headers**: None (Postman will auto-set `Content-Type: multipart/form-data`)
- **Body**: `form-data`

#### Form Data Fields:
| Key | Type | Value | Required |
|-----|------|-------|----------|
| `title` | Text | "Kitchen Renovation" | Optional |
| `description` | Text | "Complete kitchen remodeling with new cabinets" | ✅ Yes |
| `billAmount` | Text | "15000" | ✅ Yes |
| `images` | File | [Select 1-10 image files] | ✅ Yes (min 1) |

#### Steps in Postman:
1. Select `POST` method
2. Enter URL: `http://localhost:5000/api/records`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields:
   - Key: `title`, Type: Text, Value: "Kitchen Renovation"
   - Key: `description`, Type: Text, Value: "Complete kitchen remodeling"
   - Key: `billAmount`, Type: Text, Value: "15000"
   - Key: `images`, Type: File → Click "Select Files" → Choose 1-10 images
6. Click **Send**

#### Expected Response (Success)
```json
{
  "success": true,
  "data": {
    "_id": "673c8f2a1b4e5d6a7c8d9e0f",
    "title": "Kitchen Renovation",
    "description": "Complete kitchen remodeling with new cabinets",
    "billAmount": 15000,
    "imageUrls": [
      "https://res.cloudinary.com/dchvhnoul/image/upload/v1234567890/work_records/photo_1234567890.jpg",
      "https://res.cloudinary.com/dchvhnoul/image/upload/v1234567891/work_records/photo_1234567891.jpg"
    ],
    "cloudinaryPublicIds": [
      "work_records/photo_1234567890",
      "work_records/photo_1234567891"
    ],
    "createdAt": "2025-11-07T10:30:45.123Z",
    "updatedAt": "2025-11-07T10:30:45.123Z",
    "__v": 0
  }
}
```

#### Status Code: `201 Created`

#### Error Responses:

**Missing Required Fields:**
```json
{
  "success": false,
  "error": "Description and bill amount are required"
}
```
Status: `400 Bad Request`

**Missing Images:**
```json
{
  "success": false,
  "error": "At least one image is required"
}
```
Status: `400 Bad Request`

**Invalid File Type:**
```json
{
  "success": false,
  "error": "Only image files are allowed!"
}
```
Status: `400 Bad Request`

---

### 4. 📋 Get All Work Records
**GET** `/api/records`

#### Request
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/records`
- **Headers**: None required

#### Optional Query Parameters:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | Number | 50 | Max records to return |
| `skip` | Number | 0 | Number of records to skip (pagination) |
| `sort` | String | "-createdAt" | Sort order (e.g., "billAmount", "-billAmount") |

#### Example URLs:
```
# Get all records (default)
http://localhost:5000/api/records

# Get first 10 records
http://localhost:5000/api/records?limit=10

# Get next 10 records (pagination)
http://localhost:5000/api/records?limit=10&skip=10

# Sort by bill amount (ascending)
http://localhost:5000/api/records?sort=billAmount

# Sort by bill amount (descending)
http://localhost:5000/api/records?sort=-billAmount

# Combined: Get 5 records, skip first 5, sort by date
http://localhost:5000/api/records?limit=5&skip=5&sort=-createdAt
```

#### Expected Response
```json
{
  "success": true,
  "count": 3,
  "total": 3,
  "data": [
    {
      "_id": "673c8f2a1b4e5d6a7c8d9e0f",
      "title": "Kitchen Renovation",
      "description": "Complete kitchen remodeling",
      "billAmount": 15000,
      "imageUrls": ["https://..."],
      "cloudinaryPublicIds": ["work_records/photo_123"],
      "createdAt": "2025-11-07T10:30:45.123Z",
      "updatedAt": "2025-11-07T10:30:45.123Z",
      "__v": 0
    },
    // ... more records
  ]
}
```

#### Status Code: `200 OK`

---

### 5. 🔍 Get Single Work Record by ID
**GET** `/api/records/:id`

#### Request
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/records/673c8f2a1b4e5d6a7c8d9e0f`
- **Headers**: None required

#### Steps in Postman:
1. First, get a record ID from the "Get All Records" response
2. Replace `:id` in the URL with the actual record ID
3. Example: `http://localhost:5000/api/records/673c8f2a1b4e5d6a7c8d9e0f`

#### Expected Response (Success)
```json
{
  "success": true,
  "data": {
    "_id": "673c8f2a1b4e5d6a7c8d9e0f",
    "title": "Kitchen Renovation",
    "description": "Complete kitchen remodeling",
    "billAmount": 15000,
    "imageUrls": ["https://..."],
    "cloudinaryPublicIds": ["work_records/photo_123"],
    "createdAt": "2025-11-07T10:30:45.123Z",
    "updatedAt": "2025-11-07T10:30:45.123Z",
    "__v": 0
  }
}
```

#### Status Code: `200 OK`

#### Error Response (Not Found):
```json
{
  "success": false,
  "error": "Record not found"
}
```
Status: `404 Not Found`

---

### 6. ✏️ Update Work Record
**PUT** `/api/records/:id`

#### Request
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/records/673c8f2a1b4e5d6a7c8d9e0f`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**: `raw` (JSON)

#### Request Body (All fields optional):
```json
{
  "title": "Updated Kitchen Renovation",
  "description": "Updated description with more details",
  "billAmount": 18000
}
```

#### Steps in Postman:
1. Select `PUT` method
2. Enter URL with record ID: `http://localhost:5000/api/records/YOUR_RECORD_ID`
3. Go to **Headers** tab
   - Key: `Content-Type`, Value: `application/json`
4. Go to **Body** tab
5. Select **raw** and **JSON** from dropdown
6. Enter JSON data (you can update one or all fields)
7. Click **Send**

#### Example Requests:

**Update Only Title:**
```json
{
  "title": "New Title"
}
```

**Update Only Bill Amount:**
```json
{
  "billAmount": 20000
}
```

**Update All Fields:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "billAmount": 25000
}
```

#### Expected Response (Success)
```json
{
  "success": true,
  "data": {
    "_id": "673c8f2a1b4e5d6a7c8d9e0f",
    "title": "Updated Kitchen Renovation",
    "description": "Updated description with more details",
    "billAmount": 18000,
    "imageUrls": ["https://..."],
    "cloudinaryPublicIds": ["work_records/photo_123"],
    "createdAt": "2025-11-07T10:30:45.123Z",
    "updatedAt": "2025-11-07T11:45:30.456Z",
    "__v": 0
  }
}
```

#### Status Code: `200 OK`

#### Error Response (Not Found):
```json
{
  "success": false,
  "error": "Record not found"
}
```
Status: `404 Not Found`

---

### 7. 🗑️ Delete Work Record
**DELETE** `/api/records/:id`

#### Request
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/records/673c8f2a1b4e5d6a7c8d9e0f`
- **Headers**: None required

#### Steps in Postman:
1. Select `DELETE` method
2. Enter URL with record ID: `http://localhost:5000/api/records/YOUR_RECORD_ID`
3. Click **Send**

#### Expected Response (Success)
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

#### Status Code: `200 OK`

#### Error Response (Not Found):
```json
{
  "success": false,
  "error": "Record not found"
}
```
Status: `404 Not Found`

#### Note:
- This endpoint also deletes associated images from Cloudinary
- Check server console for confirmation: `✅ Images deleted from Cloudinary`

---

### 8. 📊 Get Statistics
**GET** `/api/records/stats`

#### Request
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/records/stats`
- **Headers**: None required

#### Expected Response
```json
{
  "success": true,
  "data": {
    "totalRecords": 15,
    "billStats": {
      "_id": null,
      "totalBillAmount": 250000,
      "averageBillAmount": 16666.67,
      "maxBillAmount": 50000,
      "minBillAmount": 5000
    }
  }
}
```

#### Status Code: `200 OK`

#### Response When No Records:
```json
{
  "success": true,
  "data": {
    "totalRecords": 0,
    "billStats": {
      "totalBillAmount": 0,
      "averageBillAmount": 0,
      "maxBillAmount": 0,
      "minBillAmount": 0
    }
  }
}
```

---

## 🧪 Complete Testing Workflow

### Test Sequence (Recommended Order):

1. **✅ Health Check**
   - Verify server is running
   - `GET /health`

2. **📊 Get Initial Stats**
   - Check current database state
   - `GET /api/records/stats`

3. **➕ Create Records**
   - Create 3-5 test records with different data
   - `POST /api/records` (repeat 3-5 times)
   - Save the `_id` values from responses

4. **📋 Get All Records**
   - Verify all records are returned
   - `GET /api/records`
   - Test pagination: `GET /api/records?limit=2`
   - Test sorting: `GET /api/records?sort=billAmount`

5. **🔍 Get Single Record**
   - Use one of the saved `_id` values
   - `GET /api/records/:id`

6. **✏️ Update Record**
   - Update the same record
   - `PUT /api/records/:id`
   - Then get it again to verify changes

7. **📊 Get Updated Stats**
   - Check statistics after creating records
   - `GET /api/records/stats`

8. **🗑️ Delete Record**
   - Delete one record
   - `DELETE /api/records/:id`
   - Try to get it again (should return 404)

9. **📊 Get Final Stats**
   - Verify stats are updated after deletion
   - `GET /api/records/stats`

---

## 🖼️ Image Testing

### Supported Formats:
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)

### Image Specifications:
- **Max File Size**: 50 MB per image
- **Max Images**: 10 images per record
- **Min Images**: 1 image required
- **Auto Resize**: Images larger than 1500x1500 are automatically resized

### Test Cases:

1. **✅ Valid Single Image**
   - Upload 1 JPEG image
   - Expected: Success

2. **✅ Multiple Images**
   - Upload 5-10 images
   - Expected: Success

3. **❌ No Images**
   - Don't select any images
   - Expected: Error "At least one image is required"

4. **❌ Invalid File Type**
   - Try uploading a PDF or text file
   - Expected: Error "Only image files are allowed!"

5. **❌ Too Many Images**
   - Try uploading more than 10 images
   - Expected: Error or only first 10 accepted

---

## 🔍 Error Testing

### Test Invalid Scenarios:

1. **Missing Required Fields**
   ```
   POST /api/records
   Body: { "title": "Test" }  // Missing description and billAmount
   Expected: 400 Bad Request
   ```

2. **Invalid Record ID**
   ```
   GET /api/records/invalid_id
   Expected: 500 or 404 error
   ```

3. **Non-existent Record**
   ```
   GET /api/records/673c8f2a1b4e5d6a7c8d9e99
   Expected: 404 Not Found
   ```

4. **Invalid Bill Amount**
   ```
   POST /api/records
   Body: { "billAmount": -1000, ... }
   Expected: 400 Bad Request (validation error)
   ```

5. **Route Not Found**
   ```
   GET /api/invalid-route
   Expected: 404 with "Route not found"
   ```

---

## 📦 Postman Collection Import

### Create a Collection:

1. Open Postman
2. Click **Import** button
3. Create new collection named "Work Records API"
4. Add all endpoints listed above
5. Save the collection for reuse

### Environment Variables (Optional):

Create an environment with:
```
BASE_URL = http://localhost:5000
RECORD_ID = (empty - update during testing)
```

Then use:
```
{{BASE_URL}}/api/records
{{BASE_URL}}/api/records/{{RECORD_ID}}
```

---

## 📝 Sample Test Data

### Record 1:
```
Title: Kitchen Renovation
Description: Complete kitchen remodeling with new cabinets and countertops
Bill Amount: 15000
Images: 3 kitchen photos
```

### Record 2:
```
Title: Bathroom Upgrade
Description: Modern bathroom installation with new fixtures
Bill Amount: 8500
Images: 2 bathroom photos
```

### Record 3:
```
Title: Living Room Painting
Description: Interior painting of living room and hallway
Bill Amount: 3200
Images: 4 before/after photos
```

### Record 4:
```
Title: Electrical Work
Description: Complete house rewiring and new electrical panel
Bill Amount: 12000
Images: 5 electrical work photos
```

### Record 5:
```
Title: Flooring Installation
Description: Hardwood flooring installation in bedrooms
Bill Amount: 9800
Images: 3 flooring photos
```

---

## ✅ Validation Checklist

- [ ] Server is running on port 5000
- [ ] MongoDB is connected
- [ ] Cloudinary is connected
- [ ] Can create records with images
- [ ] Images are uploaded to Cloudinary
- [ ] Can retrieve all records
- [ ] Can retrieve single record by ID
- [ ] Can update record details
- [ ] Can delete record (images also deleted from Cloudinary)
- [ ] Statistics are calculated correctly
- [ ] Pagination works
- [ ] Sorting works
- [ ] Error handling works properly
- [ ] Invalid requests return appropriate errors

---

## 🐛 Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check if MongoDB is running
   - Check server logs for detailed error

2. **Images Not Uploading**
   - Verify Cloudinary credentials in `.env`
   - Check file size (< 50MB)
   - Ensure file type is image (jpg, png, webp)

3. **Record Not Found (404)**
   - Verify the record ID is correct
   - Use Get All Records to find valid IDs

4. **Connection Refused**
   - Ensure server is running (`npm run dev`)
   - Check PORT in `.env` (default: 5000)

---

## 📞 Support

If you encounter any issues:
1. Check server console logs
2. Verify MongoDB connection
3. Verify Cloudinary configuration
4. Check request format matches examples above

---

**Happy Testing! 🚀**
