# Family Link

A mobile-first web application that connects grandparents and grandchildren through interactive activities — memory puzzles, story sharing, history guessing games, and family photo moments.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Routing** | React Router 7 (hash router) |
| **Styling** | Tailwind CSS 4 + tw-animate-css |
| **UI Library** | shadcn/ui (Radix primitives) |
| **Animation** | Motion (Framer Motion) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **State / Form** | React Hook Form |
| **Drag & Drop** | react-dnd |
| **Real-time** | STOMP.js + SockJS (WebSocket) |
| **Date** | date-fns + react-day-picker |
| **Notifications** | Sonner (toast) |
| **Image Gallery** | react-responsive-masonry |
| **Carousel** | Embla Carousel |

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root component (phone frame layout)
│   ├── routes.tsx               # Hash router configuration
│   └── components/
│       ├── core/                # Core screens (Welcome, CharacterSelection, Grandparent/Grandchild Centers)
│       ├── game/                # History guessing game
│       ├── moment/              # Family Moments (photo gallery & upload)
│       ├── puzzle/              # Memory puzzle game & story time
│       ├── story/               # Story library (create, play, task completion)
│       │   └── data/            # Preset child stories
│       ├── figma/               # ImageWithFallback utility
│       └── ui/                  # shadcn components (button, dialog, input, select, utils)
├── assets/                      # Static images
├── services/
│   ├── api.ts                   # Backend API client
│   └── puzzleSyncClient.ts      # WebSocket puzzle sync client
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
└── types/
    └── story.ts                 # Story type definitions
```

## Features

- **Role Selection** — Choose between Grandparent or Grandchild mode
- **Memory Puzzles** — Drag-and-drop picture puzzles with difficulty selection
- **Story Library** — Record, upload, and listen to audio stories; complete tasks to unlock stories
- **History Guessing Game** — Grandparents think of a historical figure, grandchildren ask yes/no questions
- **Family Moments** — Upload and browse family photos with categorized themes
- **Real-time Puzzle Sync** — Collaborate on puzzles via WebSocket

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
pnpm build
```

Output will be in the `dist/` directory.

## Environment Variables

Copy the following into a `.env` file at the project root:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BACKEND_BASE_URL` | `http://192.168.1.106:8080` | Backend server base URL |
| `VITE_STORY_API_BASE_URL` | `{base}/story` | Story API base URL |
| `VITE_PUZZLE_API_BASE_URL` | `{base}/puzzle` | Puzzle API base URL |
| `VITE_USER_API_BASE_URL` | `{base}/user` | User API base URL |
| `VITE_FAMILY_MOMENTS_API_BASE_URL` | `{base}/family-moment` | Family moments API base URL |
| `VITE_PUZZLE_WS_HTTP_ENDPOINT` | `{base}/ws` | WebSocket endpoint |

## Backend

This frontend connects to the `family-link-server` Spring Boot backend in this monorepo.
