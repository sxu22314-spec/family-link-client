import { Story } from "../../../../types/story";

export const PRESET_CHILD_STORIES: Story[] = [
  {
    id: "preset-story-1",
    title: "Grandma's Mooncake Night",
    description: "A cozy Mid-Autumn evening when Grandma taught everyone how to shape mooncakes by hand.",
    subject: "Family Festival Night",
    taskType: "question",
    taskData: {
      type: "question",
      prompt: "Answer a simple question to unlock this story",
      question: "What festival did Grandma celebrate in this story?",
      correctAnswer: "mid-autumn",
    },
    isLocked: true,
    listenCount: 3,
    createdAt: new Date("2026-04-21T10:00:00"),
    audioUrl: "",
    coverImageUrl: "",
  },
  {
    id: "preset-story-2",
    title: "Grandpa and the Old Bicycle",
    description: "Grandpa shares how he rode an old bicycle to school and fixed it again and again.",
    subject: "Grandpa's Childhood",
    taskType: "drawing",
    taskData: {
      type: "drawing",
      prompt: "Draw a bicycle to unlock this story",
      drawingPrompt: "Draw your own dream bicycle with your favorite colors.",
    },
    isLocked: true,
    listenCount: 5,
    createdAt: new Date("2026-04-19T10:00:00"),
    audioUrl: "",
    coverImageUrl: "",
  },
  {
    id: "preset-story-3",
    title: "The Little Garden Secret",
    description: "A tiny garden behind the house where tomatoes and peppers grew every summer.",
    subject: "Backyard Garden",
    taskType: "question",
    taskData: {
      type: "question",
      prompt: "Answer a simple question to unlock this story",
      question: "Name one thing that grew in the garden.",
      correctAnswer: "tomato",
    },
    isLocked: true,
    listenCount: 2,
    createdAt: new Date("2026-04-17T10:00:00"),
    audioUrl: "",
    coverImageUrl: "",
  },
  {
    id: "preset-story-4",
    title: "A Rainy Day Storybook",
    description: "On a rainy afternoon, grandparents read stories together and made warm tea.",
    subject: "Rainy Afternoon",
    taskType: "drawing",
    taskData: {
      type: "drawing",
      prompt: "Draw a rainy day scene to unlock this story",
      drawingPrompt: "Draw rain, a window, and a warm cup of tea.",
    },
    isLocked: true,
    listenCount: 1,
    createdAt: new Date("2026-04-15T10:00:00"),
    audioUrl: "",
    coverImageUrl: "",
  },
];

export function getChildStories(): Story[] {
  return PRESET_CHILD_STORIES.map((story) => ({
    ...story,
    isLocked: true,
  }));
}

export function getChildStoryById(storyId: string): Story | null {
  return getChildStories().find((story) => story.id === storyId) ?? null;
}

export function unlockChildStory(_storyId: string) {
  // Intentionally disabled: grandchild stories cannot be unlocked by task input.
}
