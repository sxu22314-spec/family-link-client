// API Service Layer for Backend Integration
// This file contains placeholder functions for MySQL and MinIO integration

import { Story, TaskCompletion } from "../types/story";

// ============================================================================
// BACKEND CONFIGURATION
// ============================================================================

/**
 * Backend API Configuration
 * Replace these with your actual backend endpoints
 */
const API_CONFIG = {
  // MySQL API endpoints
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",

  // MinIO configuration
  minioEndpoint: process.env.REACT_APP_MINIO_ENDPOINT || "http://localhost:9000",
  minioBucket: process.env.REACT_APP_MINIO_BUCKET || "family-stories",
};

// Unified backend URL configuration (Vite)
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://192.168.0.36:8080";

export const STORY_API_BASE_URL =
  import.meta.env.VITE_STORY_API_BASE_URL || `${BACKEND_BASE_URL}/story`;
export const PUZZLE_API_BASE_URL =
  import.meta.env.VITE_PUZZLE_API_BASE_URL || `${BACKEND_BASE_URL}/puzzle`;
export const USER_API_BASE_URL =
  import.meta.env.VITE_USER_API_BASE_URL || `${BACKEND_BASE_URL}/user`;
export const FAMILY_MOMENTS_API_BASE_URL =
  import.meta.env.VITE_FAMILY_MOMENTS_API_BASE_URL || `${BACKEND_BASE_URL}/family-moment`;
export const PUZZLE_WS_HTTP_ENDPOINT =
  import.meta.env.VITE_PUZZLE_WS_HTTP_ENDPOINT || `${BACKEND_BASE_URL}/ws`;
export const PUZZLE_WS_APP_PREFIX = import.meta.env.VITE_PUZZLE_WS_APP_PREFIX || "/app";
export const PUZZLE_WS_TOPIC_PREFIX = import.meta.env.VITE_PUZZLE_WS_TOPIC_PREFIX || "/topic";

export async function selectRole(userId: number) {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/selectUser/${userId}`);
    const resData = await response.json();

    if (resData?.code === 0) {
      const userInfo = resData.data;
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      return userInfo;
    }
  } catch (error) {
    console.error("Failed to select role:", error);
  }
}

// ============================================================================
// STORY API - MySQL Database Operations
// ============================================================================

/**
 * Fetch all stories for a user from MySQL database
 *
 * Backend Implementation Guide:
 * - Endpoint: GET /api/stories
 * - Query params: userId (to filter stories by user)
 * - Returns: Array of Story objects
 * - Database: SELECT * FROM stories WHERE user_id = ?
 */
export async function fetchStories(userId: string): Promise<Story[]> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.baseURL}/stories?userId=${userId}`);
    // const data = await response.json();
    // return data;

    // Placeholder: Return mock data
    return getMockStories();
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

/**
 * Create a new story in MySQL database
 *
 * Backend Implementation Guide:
 * - Endpoint: POST /api/stories
 * - Body: Story object (without audioUrl, will be added after MinIO upload)
 * - Returns: Created Story with ID
 * - Database: INSERT INTO stories (title, description, task_type, ...) VALUES (?, ?, ?, ...)
 */
export async function createStory(story: Omit<Story, "id" | "createdAt" | "audioUrl" | "coverImageUrl">): Promise<Story> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.baseURL}/stories`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(story),
    // });
    // const data = await response.json();
    // return data;

    // Placeholder: Return mock story
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      createdAt: new Date(),
      audioUrl: undefined,
      coverImageUrl: undefined,
    };
    return newStory;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
}

/**
 * Update story in MySQL database (typically after MinIO upload)
 *
 * Backend Implementation Guide:
 * - Endpoint: PUT /api/stories/:id
 * - Body: Partial Story object (e.g., { audioUrl, coverImageUrl })
 * - Returns: Updated Story
 * - Database: UPDATE stories SET audio_url = ?, cover_image_url = ? WHERE id = ?
 */
export async function updateStory(storyId: string, updates: Partial<Story>): Promise<Story> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.baseURL}/stories/${storyId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates),
    // });
    // const data = await response.json();
    // return data;

    // Placeholder
    console.log("Updating story:", storyId, updates);
    return { ...updates, id: storyId } as Story;
  } catch (error) {
    console.error("Error updating story:", error);
    throw error;
  }
}

/**
 * Delete a story from MySQL database
 *
 * Backend Implementation Guide:
 * - Endpoint: DELETE /api/stories/:id
 * - Returns: Success status
 * - Database: DELETE FROM stories WHERE id = ?
 * - Also delete associated audio file from MinIO
 */
export async function deleteStory(storyId: string): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_CONFIG.baseURL}/stories/${storyId}`, {
    //   method: 'DELETE',
    // });

    console.log("Deleting story:", storyId);
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}

// ============================================================================
// MINIO FILE UPLOAD OPERATIONS
// ============================================================================

/**
 * Upload audio file to MinIO object storage
 *
 * Backend Implementation Guide:
 * - Endpoint: POST /api/upload/audio
 * - Body: FormData with audio file
 * - Process:
 *   1. Receive file on backend
 *   2. Generate unique filename (e.g., `stories/${storyId}/${timestamp}.mp3`)
 *   3. Upload to MinIO using MinIO SDK
 *   4. Return public URL or signed URL
 * - MinIO: putObject(bucket, objectName, stream)
 * - Returns: { url: string }
 */
export async function uploadAudioFile(file: File, storyId: string): Promise<string> {
  try {
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('audio', file);
    // formData.append('storyId', storyId);
    //
    // const response = await fetch(`${API_CONFIG.baseURL}/upload/audio`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // return data.url;

    // Placeholder: Return blob URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
}

/**
 * Upload cover image to MinIO object storage
 *
 * Backend Implementation Guide:
 * - Similar to uploadAudioFile
 * - Endpoint: POST /api/upload/image
 * - Generate unique filename for images
 * - Optionally resize/optimize image before upload
 */
export async function uploadCoverImage(file: File, storyId: string): Promise<string> {
  try {
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('image', file);
    // formData.append('storyId', storyId);
    //
    // const response = await fetch(`${API_CONFIG.baseURL}/upload/image`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // return data.url;

    // Placeholder: Return blob URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Delete file from MinIO
 *
 * Backend Implementation Guide:
 * - Endpoint: DELETE /api/files/:filename
 * - MinIO: removeObject(bucket, objectName)
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // const filename = extractFilenameFromUrl(fileUrl);
    // await fetch(`${API_CONFIG.baseURL}/files/${filename}`, {
    //   method: 'DELETE',
    // });

    console.log("Deleting file:", fileUrl);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// ============================================================================
// TASK COMPLETION API - MySQL Database Operations
// ============================================================================

/**
 * Save task completion to MySQL database
 *
 * Backend Implementation Guide:
 * - Endpoint: POST /api/task-completions
 * - Body: TaskCompletion object
 * - Database: INSERT INTO task_completions (story_id, completed_at, task_response) VALUES (?, ?, ?)
 * - Also update story's isLocked status: UPDATE stories SET is_locked = false WHERE id = ?
 */
export async function saveTaskCompletion(completion: TaskCompletion): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_CONFIG.baseURL}/task-completions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(completion),
    // });

    console.log("Saving task completion:", completion);
  } catch (error) {
    console.error("Error saving task completion:", error);
    throw error;
  }
}

/**
 * Check if task is completed for a story
 *
 * Backend Implementation Guide:
 * - Endpoint: GET /api/task-completions/:storyId
 * - Query: SELECT * FROM task_completions WHERE story_id = ? LIMIT 1
 * - Returns: TaskCompletion object or null
 */
export async function checkTaskCompletion(storyId: string): Promise<TaskCompletion | null> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_CONFIG.baseURL}/task-completions/${storyId}`);
    // const data = await response.json();
    // return data;

    // Placeholder
    return null;
  } catch (error) {
    console.error("Error checking task completion:", error);
    throw error;
  }
}

// ============================================================================
// MOCK DATA (Remove in production)
// ============================================================================

function getMockStories(): Story[] {
  return [
    {
      id: "1",
      title: "Grandma's Garden",
      description: "A beautiful story about how Grandma grew the most wonderful roses in her garden every summer.",
      audioUrl: "",
      subject: "Grandma's garden",
      taskType: "drawing",
      taskData: {
        type: "drawing",
        prompt: "Draw your favorite flower from a garden",
        drawingPrompt: "Draw what you think Grandma's roses looked like. Use lots of colors!",
      },
      createdAt: new Date("2024-03-15"),
      isLocked: true,
      listenCount: 0,
    },
    {
      id: "2",
      title: "Uncle Tom's Workshop",
      description: "Learn about the magical workshop where Uncle Tom built toys for all the children in the neighborhood.",
      audioUrl: "",
      subject: "Uncle Tom",
      taskType: "question",
      taskData: {
        type: "question",
        prompt: "Answer a question about the story",
        question: "What was Uncle Tom's favorite tool in his workshop?",
        correctAnswer: "hammer",
      },
      createdAt: new Date("2024-03-10"),
      isLocked: true,
      listenCount: 0,
    },
  ];
}

// ============================================================================
// FAMILY MOMENTS API - MySQL Database Operations
// ============================================================================

export interface FamilyPhoto {
  id: string;
  photoUrl: string;
  title: string;
  subject: string;
  uploadedAt: string;
  shotDate?: string;
}

export interface FamilyPhotoFilter {
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface FamilyPhotoListResponse {
  photos: FamilyPhoto[];
  total: number;
  page: number;
  pageSize: number;
}

function toPositiveInt(value: unknown, fallback: number): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback;
}

function normalizeFamilyPhotoListResponse(raw: any, filters: FamilyPhotoFilter): FamilyPhotoListResponse {
  const data = raw?.data ?? raw ?? {};
  const photos = Array.isArray(data?.photos)
    ? data.photos
    : Array.isArray(data?.records)
      ? data.records
      : Array.isArray(data?.list)
        ? data.list
        : Array.isArray(data?.items)
          ? data.items
          : [];

  const fallbackPage = toPositiveInt(filters.page, 1);
  const fallbackPageSize = toPositiveInt(filters.pageSize, 4);
  const page = toPositiveInt(data?.page ?? data?.pageNum ?? data?.pageNo, fallbackPage);
  const pageSize = toPositiveInt(data?.pageSize ?? data?.size ?? data?.limit, fallbackPageSize);
  const total = toPositiveInt(
    data?.total ?? data?.totalCount ?? data?.count ?? (page === 1 && photos.length < pageSize ? photos.length : 0),
    0
  );

  return { photos, total, page, pageSize };
}

/**
 * Fetch family photos from MySQL database
 *
 * Backend Implementation Guide:
 * - Endpoint: GET /family-moment/photos
 * - Query params: subject, dateFrom, dateTo, page, pageSize
 * - Returns: { code: 0, data: { photos: Array<FamilyPhoto>, total: number, page: number, pageSize: number } }
 * - Database: SELECT * FROM family_photos WHERE (subject = ? OR ?) AND (shot_date BETWEEN ? AND ?) ORDER BY uploaded_at DESC LIMIT ? OFFSET ?
 */
export async function fetchFamilyPhotos(filters: FamilyPhotoFilter): Promise<FamilyPhotoListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append("theme", filters.subject);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const page = toPositiveInt(filters.page, 1);
    const pageSize = toPositiveInt(filters.pageSize, 4);

    // Keep current contract while adding common aliases for backend compatibility
    params.append("page", String(page));
    params.append("pageNum", String(page));
    params.append("pageNo", String(page));
    params.append("pageSize", String(pageSize));
    params.append("size", String(pageSize));
    params.append("limit", String(pageSize));

    const response = await fetch(`${FAMILY_MOMENTS_API_BASE_URL}/photos?${params.toString()}`);
    const result = await response.json();

    if (result?.code !== 0) {
      throw new Error(result?.message || "Failed to fetch family photos");
    }

    return normalizeFamilyPhotoListResponse(result, filters);
  } catch (error) {
    console.error("Error fetching family photos:", error);
    throw error;
  }
}

/**
 * Upload family photo to MinIO and save metadata to MySQL
 *
 * Backend Implementation Guide:
 * - Endpoint: POST /family-moment/upload
 * - Body: FormData with photo file and metadata (title, subject, shotDate)
 * - Process:
 *   1. Receive FormData with file and metadata
 *   2. Upload photo to MinIO with path: family-link/photo/{uuid}{ext}
 *   3. Save metadata to MySQL: INSERT INTO family_photos (title, subject, shot_date, photo_url, uploaded_at, grandparent_id)
 *   4. Return photo object with ID and photoUrl
 * - Returns: { code: 0, data: FamilyPhoto }
 */
export async function uploadFamilyPhoto(
  file: File,
  title: string,
  subject: string,
  shotDate?: string,
  puzzleFlag?: 1
): Promise<FamilyPhoto> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("theme", subject);
    if (shotDate) formData.append("photoDate", shotDate);
    if (puzzleFlag === 1) formData.append("type", "1");

    const response = await fetch(`${FAMILY_MOMENTS_API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result?.code !== 0) {
      throw new Error(result?.message || "Failed to upload family photo");
    }

    return result.data;
  } catch (error) {
    console.error("Error uploading family photo:", error);
    throw error;
  }
}

/**
 * Delete family photo
 *
 * Backend Implementation Guide:
 * - Endpoint: DELETE /family-moment/photos/:id
 * - Process:
 *   1. Delete record from MySQL
 *   2. Delete file from MinIO
 * - Returns: { code: 0 }
 */
export async function deleteFamilyPhoto(photoId: string): Promise<void> {
  try {
    const response = await fetch(`${FAMILY_MOMENTS_API_BASE_URL}/photos/${photoId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result?.code !== 0) {
      throw new Error(result?.message || "Failed to delete family photo");
    }
  } catch (error) {
    console.error("Error deleting family photo:", error);
    throw error;
  }
}
