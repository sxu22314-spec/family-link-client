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
