import { createBrowserRouter } from "react-router";
import { Welcome } from "./components/Welcome";
import { CharacterSelection } from "./components/CharacterSelection";
import { GrandparentsCenter } from "./components/GrandparentsCenter";
import { GrandchildCenter } from "./components/GrandchildCenter";
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
    path: "/dashboard/grandparents",
    Component: GrandparentsCenter,
  },
  {
    path: "/dashboard/grandson",
    Component: GrandchildCenter,
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
