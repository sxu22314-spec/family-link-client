# Story Backend & DB Design Guide

## 1) Database Table (MySQL)

```sql
CREATE TABLE tb_story (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  photo_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  audio_url VARCHAR(1024) NULL,
  cover_image_url VARCHAR(1024) NULL,
  listen_count INT NOT NULL DEFAULT 0,
  is_locked TINYINT(1) NOT NULL DEFAULT 1,
  task_type VARCHAR(64) NOT NULL,
  task_data JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_story_photo_id (photo_id),
  INDEX idx_story_created_at (created_at)
);
```

Notes:
- `task_type`/`task_data` are kept to support current front-end task unlock flow.
- `subject` can be filled with title by default if not provided by UI.

## 2) API Contract (aligned with familyphoto style)

All responses:

```json
{ "code": 0, "message": "ok", "data": ... }
```

### GET `/story/list`
Query params:
- `page` / `pageNum` / `pageNo`
- `pageSize` / `size` / `limit`
- `userId` (optional)

Response data example:

```json
{
  "records": [
    {
      "id": 1,
      "title": "Grandma's Garden",
      "description": "...",
      "subject": "Grandma's Garden",
      "audio_url": "https://...",
      "cover_image_url": null,
      "listen_count": 2,
      "is_locked": 1,
      "task_type": "drawing",
      "task_data": { "type": "drawing", "prompt": "..." },
      "created_at": "2026-05-03 12:00:00",
      "updated_at": "2026-05-03 12:00:00"
    }
  ],
  "total": 20,
  "pageNum": 1,
  "pageSize": 4
}
```

### GET `/story/getById/{id}`
Use case:
- Story Library `Preview` click enters story detail page (`StoryTime`) and fetches by `id`.

Response data example:

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "title": "Grandma's Garden",
    "description": "A warm memory...",
    "subject": "Grandma",
    "audio_url": null,
    "cover_image_url": null,
    "listen_count": 2,
    "created_at": "2026-05-04 10:00:00"
  }
}
```

Frontend behavior:
- If `audio_url` exists: show normal audio playback UI.
- If `audio_url` is empty/null: still open detail page; use `description` as the theme text.

### POST `/story/create` (multipart/form-data)
Fields:
- `title` (required)
- `description` (required)
- `subject` (required)
- `taskType` (required)
- `taskData` (JSON string, optional)
- `isLocked` (optional, default true)
- `listenCount` (optional, default 0)
- `uploadAudio` (`true/false`)
- `audioFile` (optional, required only when `uploadAudio=true`)

Behavior:
- If `audioFile` exists, upload to object storage and set `audio_url`.
- Save row in `tb_story`.

### DELETE `/story/delete/{id}`
Behavior:
- Delete row from `tb_story`.
- Optional: delete `audio_url`/`cover_image_url` objects.

### PUT `/story/update/{id}`
JSON body: partial story fields (`isLocked`, `listenCount`, etc.)

## 3) Front-end Integration Already Done

- Grandparent story library now fetches from backend with pagination (`4` per page).
- Create story now sends data directly to backend create endpoint.
- Removed UI logic for cover upload and removed placeholder/mock story generation.
- `Preview` now uses `StoryTime` page and fetches story by `/story/getById/{id}`.
- In `StoryTime`, when no `audio_url` exists, `description` is used as theme content.

## 4) Suggested Backend Validation

- `title`, `description`, `subject`: non-empty.
- `taskType` in enum: `drawing|question|memory-match|photo-upload`.
- `listen_count >= 0`.
- Soft limit for audio size (e.g., 20MB) and allowed MIME types (`audio/mpeg`, `audio/wav`, `audio/mp4`).

## 5) Compatibility Tips

- Return either camelCase or snake_case fields; current front-end normalizer supports both.
- Keep `code=0` success semantics to match existing family-moment module.
