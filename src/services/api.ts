// API Service Layer for Backend Integration

import { Story, TaskCompletion } from "../types/story";

// Unified backend URL configuration (Vite)
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://192.168.1.106:8080";

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

export interface StoryFilter {
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface StoryListResponse {
  stories: Story[];
  total: number;
  page: number;
  pageSize: number;
}

interface CreateStoryPayload {
  title: string;
  description: string;
  subject: string;
  taskType: Story["taskType"];
  taskData: Story["taskData"];
  isLocked: boolean;
  listenCount: number;
  uploadAudio?: boolean;
  audioFile?: File | null;
}

function toPositiveInt(value: unknown, fallback: number): number {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback;
}

function normalizeStory(raw: any): Story {
  return {
    id: String(raw?.id ?? ""),
    title: String(raw?.title ?? "Untitled Story"),
    description: String(raw?.description ?? ""),
    audioUrl: raw?.audioUrl || raw?.audio_url || undefined,
    coverImageUrl: raw?.coverImageUrl || raw?.cover_image_url || undefined,
    taskType: (raw?.taskType || raw?.task_type || "drawing") as Story["taskType"],
    taskData:
      raw?.taskData ||
      raw?.task_data || {
        type: (raw?.taskType || raw?.task_type || "drawing") as Story["taskType"],
        prompt: "Complete the task to unlock this story",
      },
    createdAt: new Date(raw?.createdAt || raw?.created_at || Date.now()),
    isLocked: Boolean(raw?.isLocked ?? raw?.is_locked ?? true),
    listenCount: Number(raw?.listenCount ?? raw?.listen_count ?? 0),
    subject: String(raw?.subject ?? "Family Story"),
  };
}

function normalizeStoryListResponse(raw: any, filters: StoryFilter): StoryListResponse {
  const data = raw?.data ?? raw ?? {};
  const rows = Array.isArray(data?.stories)
    ? data.stories
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
    data?.total ?? data?.totalCount ?? data?.count ?? (page === 1 && rows.length < pageSize ? rows.length : 0),
    0
  );

  return {
    stories: rows.map(normalizeStory),
    total,
    page,
    pageSize,
  };
}

export async function fetchStoriesPaginated(filters: StoryFilter): Promise<StoryListResponse> {
  const page = toPositiveInt(filters.page, 1);
  const pageSize = toPositiveInt(filters.pageSize, 4);

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("pageNum", String(page));
  params.append("pageNo", String(page));
  params.append("pageSize", String(pageSize));
  params.append("size", String(pageSize));
  params.append("limit", String(pageSize));
  if (filters.userId) params.append("userId", filters.userId);

  const response = await fetch(`${STORY_API_BASE_URL}/list?${params.toString()}`);
  const result = await response.json();

  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to fetch stories");
  }

  return normalizeStoryListResponse(result, filters);
}

export async function fetchStories(userId?: string): Promise<Story[]> {
  const list = await fetchStoriesPaginated({ userId, page: 1, pageSize: 4 });
  return list.stories;
}

export async function fetchStoryById(storyId: string): Promise<Story | null> {
  const response = await fetch(`${STORY_API_BASE_URL}/getById/${storyId}`);
  const result = await response.json();
  if (result?.code !== 0 || !result?.data) {
    return null;
  }
  return normalizeStory(result.data);
}

export async function createStory(story: CreateStoryPayload): Promise<Story> {
  const formData = new FormData();
  formData.append("title", story.title);
  formData.append("description", story.description);
  formData.append("subject", story.subject);
  formData.append("taskType", story.taskType);
  formData.append("taskData", JSON.stringify(story.taskData));
  formData.append("isLocked", String(story.isLocked));
  formData.append("listenCount", String(story.listenCount));
  formData.append("uploadAudio", String(Boolean(story.uploadAudio)));

  if (story.uploadAudio && story.audioFile) {
    formData.append("audioFile", story.audioFile);
  }

  const response = await fetch(`${STORY_API_BASE_URL}/create`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to create story");
  }

  return normalizeStory(result?.data);
}

export async function updateStory(storyId: string, updates: Partial<Story>): Promise<Story> {
  const response = await fetch(`${STORY_API_BASE_URL}/update/${storyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to update story");
  }

  return normalizeStory(result?.data || { id: storyId, ...updates });
}

export async function deleteStory(storyId: string): Promise<void> {
  const response = await fetch(`${STORY_API_BASE_URL}/delete/${storyId}`, {
    method: "DELETE",
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to delete story");
  }
}

export async function uploadAudioFile(file: File, storyId: string): Promise<string> {
  const formData = new FormData();
  formData.append("audioFile", file);
  formData.append("storyId", storyId);

  const response = await fetch(`${STORY_API_BASE_URL}/uploadAudio`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to upload audio");
  }

  return result?.data?.audioUrl || result?.data?.url || "";
}

export async function uploadCoverImage(file: File, storyId: string): Promise<string> {
  const formData = new FormData();
  formData.append("coverImage", file);
  formData.append("storyId", storyId);

  const response = await fetch(`${STORY_API_BASE_URL}/uploadCoverImage`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to upload cover image");
  }

  return result?.data?.coverImageUrl || result?.data?.url || "";
}

export async function deleteFile(fileUrl: string): Promise<void> {
  await fetch(`${STORY_API_BASE_URL}/file`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl }),
  });
}

export async function saveTaskCompletion(completion: TaskCompletion): Promise<void> {
  const response = await fetch(`${STORY_API_BASE_URL}/task-completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(completion),
  });

  const result = await response.json();
  if (result?.code !== 0) {
    throw new Error(result?.message || "Failed to save task completion");
  }
}

export async function checkTaskCompletion(storyId: string): Promise<TaskCompletion | null> {
  const response = await fetch(`${STORY_API_BASE_URL}/task-completions/${storyId}`);
  const result = await response.json();

  if (result?.code !== 0) {
    return null;
  }

  return result?.data ?? null;
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

export async function fetchFamilyPhotos(filters: FamilyPhotoFilter): Promise<FamilyPhotoListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters.subject) params.append("theme", filters.subject);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const page = toPositiveInt(filters.page, 1);
    const pageSize = toPositiveInt(filters.pageSize, 4);

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
