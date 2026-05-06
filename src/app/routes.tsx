import { createHashRouter } from "react-router";
import { Welcome } from "./components/core/Welcome";
import { CharacterSelection } from "./components/core/CharacterSelection";
import { GrandparentsCenter } from "./components/core/GrandparentsCenter";
import { GrandchildCenter } from "./components/core/GrandchildCenter";
import { MemoryPuzzle } from "./components/puzzle/MemoryPuzzle";
import { PuzzleSelection } from "./components/puzzle/PuzzleSelection";
import { StoryTime } from "./components/puzzle/StoryTime";
import { StoryLibraryGrandparent } from "./components/story/StoryLibraryGrandparent";
import { StoryLibraryChild } from "./components/story/StoryLibraryChild";
import { CreateStory } from "./components/story/CreateStory";
import { TaskCompletion } from "./components/story/TaskCompletion";
import { StoryPlayer } from "./components/story/StoryPlayer";
import { HistoryGame } from "./components/game/HistoryGame";
import { FamilyMoments } from "./components/moment/FamilyMoments";
import { FamilyMomentStoryUpload } from "./components/moment/FamilyMomentStoryUpload";

export const router = createHashRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/character-selection",
    Component: CharacterSelection,
  },
  {
    path: "/dashboard/grandparents",
    Component: GrandparentsCenter,
  },
  {
    path: "/grandparents-center",
    Component: GrandparentsCenter,
  },
  {
    path: "/family-moments",
    Component: FamilyMoments,
  },
  {
    path: "/family-moments/story-upload",
    Component: FamilyMomentStoryUpload,
  },
  {
    path: "/dashboard/grandson",
    Component: GrandchildCenter,
  },
  {
    path: "/puzzle-selection/:character",
    Component: PuzzleSelection,
  },
  {
    path: "/puzzle/:character/:puzzleId",
    Component: MemoryPuzzle,
  },
  {
    path: "/puzzle/:character",
    Component: MemoryPuzzle,
  },
  {
    path: "/history-game/:character",
    Component: HistoryGame,
  },
  {
    path: "/story/:character/:puzzleId",
    Component: StoryTime,
  },
  {
    path: "/story/:character",
    Component: StoryTime,
  },
  // Story Library Routes
  {
    path: "/story-library/grandparents",
    Component: StoryLibraryGrandparent,
  },
  {
    path: "/story-library/grandson",
    Component: StoryLibraryChild,
  },
  {
    path: "/story-library/create",
    Component: CreateStory,
  },
  {
    path: "/story-library/edit/:storyId",
    Component: CreateStory, // Can reuse CreateStory with edit mode
  },
  {
    path: "/story-library/task/:storyId",
    Component: TaskCompletion,
  },
  {
    path: "/story-library/listen/:storyId",
    Component: StoryPlayer,
  },
  {
    path: "/story-library/preview/:storyId",
    Component: StoryTime,
  },
]);
