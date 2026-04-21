# Family Moments Module - Frontend Implementation Guide

## Overview
Implemented a complete Family Moments photo gallery system for grandparents to view, upload, and manage family photos with filtering and pagination capabilities.

## Features Implemented

### 1. Photo Gallery Display
- **Location**: `/family-moments`
- **Grid Layout**: 2-column grid with 4 photos per page
- **Photo Card**: Displays image with title and theme tag
- **Delete Functionality**: Hover to reveal delete button with confirmation

### 2. Pagination
- Previous/Next page navigation
- Current page and total page count display
- Automatic page reset when filters are applied
- Disabled state for boundary pages

### 3. Photo Filtering
- **Filter by Theme** (主题):
  - 生活日常 (Daily Life)
  - 节日庆祝 (Holiday Celebration)
  - 家庭聚会 (Family Gathering)
  - 旅游记录 (Travel Memory)
  - 运动活动 (Sports Activity)
  - 美食时光 (Food & Cooking)
  
- **Filter by Date** (上传时间):
  - Precise to day level (YYYY-MM-DD)
  - Date picker UI
  
- **Clear Filters**: One-click option to reset all filters

### 4. Photo Upload
- **Upload Dialog** with form fields:
  1. **Photo Preview**: Select and preview image before upload
  2. **Title** (required): Text input field, validation enforced
  3. **Photo Shot Date** (optional): Date picker, can be skipped
  4. **Theme** (required): Dropdown selector, validation enforced
  
- **File Handling**: Maximum 10MB, JPG/PNG/GIF formats
- **URL Format**: `http://192.168.1.104:9000/family-link/photo/{uuid}{ext}`

### 5. API Integration
All API functions are properly typed and implement error handling.

## API Endpoints Required

```typescript
// Backend API base URL
const FAMILY_MOMENTS_API_BASE_URL = "http://192.168.1.104:8080/family-moment";

// Endpoints:
// GET /family-moment/photos?subject=xxx&dateFrom=yyyy-mm-dd&dateTo=yyyy-mm-dd&page=1&pageSize=4
// POST /family-moment/upload (FormData with photo, title, subject, shotDate)
// DELETE /family-moment/photos/{photoId}
```

### Expected Backend Response Format

**Fetch Photos:**
```json
{
  "code": 0,
  "message": "SUCCESS",
  "data": {
    "photos": [
      {
        "id": "1",
        "photoUrl": "http://192.168.1.104:9000/family-link/photo/...",
        "title": "Summer Picnic",
        "subject": "family-gathering",
        "uploadedAt": "2026-04-20T10:30:00",
        "shotDate": "2026-04-19"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 4
  }
}
```

**Upload Photo:**
```json
{
  "code": 0,
  "message": "OPERATION SUCCESS",
  "data": {
    "id": "123",
    "photoUrl": "http://192.168.1.104:9000/family-link/photo/...",
    "title": "Summer Picnic",
    "subject": "family-gathering",
    "uploadedAt": "2026-04-20T10:30:00",
    "shotDate": "2026-04-19"
  }
}
```

**Delete Photo:**
```json
{
  "code": 0,
  "message": "SUCCESS"
}
```

## UI/UX Details

### Color Scheme
- Background gradient: amber-50 → orange-50 → rose-50
- Action buttons: Gradient from red-500 → rose-500 → orange-500
- Filter panel: White background with orange-200 border
- Photo cards: White background with orange-200 border

### Navigation
- Back button in header: Returns to `/grandparents-center`
- Seamless integration with existing Grandparents Center dashboard

### Error Handling
- Network error messages displayed to user
- Retry functionality for failed photo loads
- Upload validation with clear error messages
- Deletion confirmation dialog

### Loading States
- Loading indicator while fetching photos
- Disabled state for upload button when no preview selected
- Uploading state during photo submission

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── FamilyMoments.tsx (new)
│   │   ├── GrandparentsCenter.tsx (modified)
│   │   └── ui/
│   │       ├── dialog.tsx (used)
│   │       ├── button.tsx (used)
│   │       ├── input.tsx (used)
│   │       └── select.tsx (used)
│   └── routes.tsx (modified)
└── services/
    └── api.ts (modified - added Family Moments functions)
```

## Backend Implementation Checklist

- [ ] Create `family_photos` MySQL table with columns:
  - id (INT, primary key)
  - title (VARCHAR)
  - subject (VARCHAR, foreign key or enum)
  - shot_date (DATE, nullable)
  - photo_url (VARCHAR)
  - uploaded_at (DATETIME)
  - grandparent_id (INT, foreign key)
  
- [ ] Implement GET /family-moment/photos endpoint with pagination
- [ ] Implement POST /family-moment/upload endpoint
  - Receive file and metadata
  - Generate UUID for file
  - Upload to MinIO with path: `family-link/photo/{uuid}{ext}`
  - Save metadata to MySQL
  
- [ ] Implement DELETE /family-moment/photos/:id endpoint
  - Delete from MySQL
  - Delete file from MinIO

## Usage Notes

1. **First Time Setup**: Users will see an empty gallery with option to upload first photo
2. **Filter Persistence**: Filters reset when pagination occurs
3. **Responsive Design**: Two-column layout adapts to mobile view
4. **Performance**: Pagination (4 photos per page) prevents loading large photo sets

## Testing Recommendations

1. Test photo upload with various file sizes and formats
2. Verify pagination with different total photo counts
3. Test filter combinations (theme + date)
4. Verify error handling for network failures
5. Test delete confirmation and actual deletion
6. Check responsive behavior on mobile devices
