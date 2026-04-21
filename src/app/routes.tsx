import { createHashRouter } from "react-router";
import { Welcome } from "./components/Welcome";
import { CharacterSelection } from "./components/CharacterSelection";
import { GrandparentsCenter } from "./components/GrandparentsCenter";
import { GrandchildCenter } from "./components/GrandchildCenter";
import { MemoryPuzzle } from "./components/MemoryPuzzle";
import { PuzzleSelection } from "./components/PuzzleSelection";
import { StoryTime } from "./components/StoryTime";
import { StoryLibraryGrandparent } from "./components/StoryLibraryGrandparent";
import { StoryLibraryChild } from "./components/StoryLibraryChild";
import { CreateStory } from "./components/CreateStory";
import { TaskCompletion } from "./components/TaskCompletion";
import { StoryPlayer } from "./components/StoryPlayer";
import { HistoryGame } from "./components/HistoryGame";
import { FamilyMoments } from "./components/FamilyMoments";

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
    Component: StoryPlayer, // Can reuse StoryPlayer for preview
  },
]);