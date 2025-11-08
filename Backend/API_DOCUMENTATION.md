# 📚 Personal Storage API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📋 Records Endpoints

### 1. Get All Records
Retrieve all work records with optional filtering, searching, and sorting.

**Endpoint:** `GET /api/records`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | '' | Search in title and description (case-insensitive) |
| `sort` | string | No | '-createdAt' | Sort field. Prefix with '-' for descending order |
| `limit` | number | No | 50 | Maximum number of records to return |
| `skip` | number | No | 0 | Number of records to skip (pagination) |
| `startDate` | string | No | '' | Filter records from this date (ISO format) |
| `endDate` | string | No | '' | Filter records until this date (ISO format) |
| `minAmount` | number | No | '' | Minimum bill amount filter |
| `maxAmount` | number | No | '' | Maximum bill amount filter |

**Sort Options:**
- `createdAt` - Oldest first
- `-createdAt` - Newest first (default)
- `billAmount` - Lowest amount first
- `-billAmount` - Highest amount first
- `title` - Alphabetical A-Z
- `-title` - Alphabetical Z-A

**Example Request:**
```bash
GET /api/records?search=laptop&sort=-billAmount&minAmount=1000&maxAmount=50000
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Laptop Purchase",
      "description": "New laptop for work",
      "billAmount": 45000,
      "imageUrls": ["https://cloudinary.com/image1.jpg"],
      "cloudinaryPublicIds": ["abc123"],
      "createdAt": "2025-11-08T10:30:00.000Z",
      "updatedAt": "2025-11-08T10:30:00.000Z"
    }
  ],
  "filters": {
    "search": "laptop",
    "startDate": "",
    "endDate": "",
    "minAmount": "1000",
    "maxAmount": "50000",
    "sort": "-billAmount"
  }
}
```

---

### 2. Get Record by ID
Retrieve a single work record by its ID.

**Endpoint:** `GET /api/records/:id`

**URL Parameters:**
- `id` (string, required) - Record ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Laptop Purchase",
    "description": "New laptop for work",
    "billAmount": 45000,
    "imageUrls": ["https://cloudinary.com/image1.jpg"],
    "cloudinaryPublicIds": ["abc123"],
    "createdAt": "2025-11-08T10:30:00.000Z",
    "updatedAt": "2025-11-08T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Record not found"
}
```

---

### 3. Create Record
Create a new work record with images.

**Endpoint:** `POST /api/records`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Record title (max 100 chars) |
| `description` | string | Yes | Record description (min 3 chars) |
| `billAmount` | number | Yes | Bill amount (must be positive) |
| `images` | file[] | Yes | Array of image files (max 10) |

**Example Request:**
```javascript
const formData = new FormData();
formData.append('title', 'Laptop Purchase');
formData.append('description', 'New laptop for work');
formData.append('billAmount', '45000');
formData.append('images', imageFile1);
formData.append('images', imageFile2);

fetch('/api/records', {
  method: 'POST',
  body: formData
});
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Laptop Purchase",
    "description": "New laptop for work",
    "billAmount": 45000,
    "imageUrls": ["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg"],
    "cloudinaryPublicIds": ["abc123", "def456"],
    "createdAt": "2025-11-08T10:30:00.000Z",
    "updatedAt": "2025-11-08T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Description and bill amount are required"
}
```

---

### 4. Update Record
Update an existing work record. Can update text fields and/or replace images.

**Endpoint:** `PUT /api/records/:id`

**Content-Type:** `multipart/form-data` (if updating images) or `application/json`

**URL Parameters:**
- `id` (string, required) - Record ID

**Form Fields (when updating images):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Updated title |
| `description` | string | No | Updated description |
| `billAmount` | number | No | Updated bill amount |
| `images` | file[] | No | New images (replaces all existing images) |

**JSON Body (when NOT updating images):**
```json
{
  "title": "Updated Laptop Purchase",
  "description": "Updated description",
  "billAmount": 48000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Updated Laptop Purchase",
    "description": "Updated description",
    "billAmount": 48000,
    "imageUrls": ["https://cloudinary.com/image1.jpg"],
    "cloudinaryPublicIds": ["abc123"],
    "createdAt": "2025-11-08T10:30:00.000Z",
    "updatedAt": "2025-11-08T11:00:00.000Z"
  },
  "message": "Record updated successfully"
}
```

**Notes:**
- If images are provided, ALL existing images are deleted from Cloudinary and replaced
- If no images are provided, existing images remain unchanged
- Old images are automatically deleted from Cloudinary when replaced

---

### 5. Delete Record
Delete a work record and its associated images from Cloudinary.

**Endpoint:** `DELETE /api/records/:id`

**URL Parameters:**
- `id` (string, required) - Record ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Record not found"
}
```

**Notes:**
- Automatically deletes all associated images from Cloudinary
- Operation is irreversible

---

### 6. Get Statistics
Get overall statistics about all records.

**Endpoint:** `GET /api/records/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 42,
    "billStats": {
      "totalBillAmount": 125000,
      "averageBillAmount": 2976.19,
      "maxBillAmount": 45000,
      "minBillAmount": 500
    }
  }
}
```

---

## 🔍 Search & Filter Examples

### Search by keyword
```bash
GET /api/records?search=laptop
```
Searches in both `title` and `description` fields (case-insensitive).

### Filter by date range
```bash
GET /api/records?startDate=2025-01-01&endDate=2025-12-31
```
Returns records created within the specified date range.

### Filter by amount range
```bash
GET /api/records?minAmount=1000&maxAmount=10000
```
Returns records with bill amount between 1000 and 10000.

### Combined filters
```bash
GET /api/records?search=purchase&minAmount=5000&sort=-createdAt&limit=20
```
Search for "purchase", amount >= 5000, sorted by newest first, limit 20 results.

### Pagination
```bash
# First page (20 records)
GET /api/records?limit=20&skip=0

# Second page
GET /api/records?limit=20&skip=20

# Third page
GET /api/records?limit=20&skip=40
```

---

## 🎨 Sort Examples

### Sort by date
```bash
# Newest first (default)
GET /api/records?sort=-createdAt

# Oldest first
GET /api/records?sort=createdAt
```

### Sort by amount
```bash
# Highest amount first
GET /api/records?sort=-billAmount

# Lowest amount first
GET /api/records?sort=billAmount
```

### Sort by title
```bash
# A to Z
GET /api/records?sort=title

# Z to A
GET /api/records?sort=-title
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## 📝 Notes

### Image Upload
- Supported formats: JPG, PNG, GIF, WebP
- Max file size: 10MB per image
- Max images per record: 10
- Images are uploaded to Cloudinary
- Old images are automatically deleted when replaced

### Validation
- `title`: Optional, max 100 characters
- `description`: Required, min 3 characters
- `billAmount`: Required, must be >= 0
- `images`: At least 1 image required for creation

### Performance
- Database indexes on:
  - `createdAt` (descending)
  - `billAmount` (ascending)
  - `title` and `description` (text search)
- Default limit: 50 records per request
- Use pagination for large datasets

---

## 🔐 Future Enhancements

The following features are planned for future releases:

1. **Authentication & Authorization**
   - User registration and login
   - JWT-based authentication
   - User-specific records

2. **Folder Management**
   - Create folders/categories
   - Assign records to folders
   - Folder-based filtering

3. **Advanced Features**
   - Bulk operations
   - Export to CSV/PDF
   - Email reports
   - Image compression options

---

**Last Updated:** November 8, 2025
**API Version:** 1.0
