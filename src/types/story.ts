// Type definitions for Story Library feature

export interface Story {
  id: string;
  title: string;
  description: string;
  audioUrl?: string; // MinIO URL - will be populated from backend
  audioFile?: File; // Local file before upload
  coverImageUrl?: string; // MinIO URL
  taskType: TaskType;
  taskData: TaskData;
  createdAt: Date;
  isLocked: boolean;
  listenCount: number;
  subject: string; // What/Who the story is about (e.g., "Grandma's garden", "Uncle Tom")
}

export type TaskType =
  | "drawing"
  | "question"
  | "memory-match"
  | "photo-upload";

export interface TaskData {
  type: TaskType;
  prompt: string;
  // For question task
  question?: string;
  correctAnswer?: string;
  // For drawing task
  drawingPrompt?: string;
  // For memory match
  matchPairs?: Array<{ id: string; text: string }>;
  // For photo upload
  photoPrompt?: string;
}

export interface TaskCompletion {
  storyId: string;
  completedAt: Date;
  taskResponse: {
    type: TaskType;
    // Drawing response
    drawingDataUrl?: string;
    // Question response
    answer?: string;
    // Photo upload response
    photoDataUrl?: string;
    // Memory match response
    matches?: Array<{ pair1: string; pair2: string }>;
  };
}
