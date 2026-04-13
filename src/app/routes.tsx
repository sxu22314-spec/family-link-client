import { createBrowserRouter } from "react-router";
import { Welcome } from "./components/Welcome";
import { CharacterSelection } from "./components/CharacterSelection";
import { Dashboard } from "./components/Dashboard";
import { MemoryPuzzle } from "./components/MemoryPuzzle";
import { StoryTime } from "./components/StoryTime";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/character-selection",
    Component: CharacterSelection,
  },
  {
    path: "/dashboard/:character",
    Component: Dashboard,
  },
  {
    path: "/puzzle/:character",
    Component: MemoryPuzzle,
  },
  {
    path: "/story/:character",
    Component: StoryTime,
  },
]);
