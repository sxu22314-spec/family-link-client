import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Lock, CheckCircle, Play, Puzzle as PuzzleIcon, Star, Trophy } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PuzzleOption {
  id: string;
  title: string;
  theme: string;
  imageUrl: string;
  difficulty: string;
  estimatedTime: string;
}

const PUZZLES: PuzzleOption[] = [
  {
    id: "family-picnic",
    title: "Family Picnic",
    theme: "Outdoor Fun",
    imageUrl: "https://images.unsplash.com/photo-1775441522416-9cf438595465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBwaWNuaWMlMjBvdXRkb29ycyUyMGhhcHB5fGVufDF8fHx8MTc3NjQwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    difficulty: "Easy",
    estimatedTime: "5 mins",
  },
  {
    id: "park-play",
    title: "Park Adventure",
    theme: "Playing Together",
    imageUrl: "https://images.unsplash.com/photo-1577897113051-1a0395bfc3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZHBhcmVudHMlMjBwbGF5aW5nJTIwY2hpbGRyZW4lMjBwYXJrfGVufDF8fHx8MTc3NjQwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    difficulty: "Medium",
    estimatedTime: "7 mins",
  },
  {
    id: "cooking-together",
    title: "Cooking Time",
    theme: "Kitchen Fun",
    imageUrl: "https://images.unsplash.com/photo-1758874960466-fb0a3e0007bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjb29raW5nJTIwdG9nZXRoZXIlMjBraXRjaGVufGVufDF8fHx8MTc3NjM4ODk5NHww&ixlib=rb-4.1.0&q=80&w=1080",
    difficulty: "Medium",
    estimatedTime: "7 mins",
  },
  {
    id: "birthday-celebration",
    title: "Birthday Party",
    theme: "Special Moments",
    imageUrl: "https://images.unsplash.com/photo-1768767278997-136b49ce5d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjZWxlYnJhdGluZyUyMGJpcnRoZGF5JTIwY2FrZXxlbnwxfHx8fDE3NzY0MDc1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    difficulty: "Hard",
    estimatedTime: "10 mins",
  },
];

const COMPLETED_PUZZLES_KEY = "completed-puzzles";

export function PuzzleSelection() {
  const navigate = useNavigate();
  const { character } = useParams();
  const [completedPuzzles, setCompletedPuzzles] = useState<string[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<string | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COMPLETED_PUZZLES_KEY);
    if (stored) {
      try {
        setCompletedPuzzles(JSON.parse(stored));
      } catch {
        setCompletedPuzzles([]);
      }
    }
  }, []);

  const handlePuzzleClick = (puzzleId: string) => {
    const isCompleted = completedPuzzles.includes(puzzleId);
    
    if (isCompleted) {
      setSelectedPuzzle(puzzleId);
      setShowActionDialog(true);
    } else {
      navigate(`/puzzle/${character}/${puzzleId}`);
    }
  };

  const handlePlayAgain = () => {
    if (selectedPuzzle) {
      navigate(`/puzzle/${character}/${selectedPuzzle}`);
    }
  };

  const handleListenStory = () => {
    if (selectedPuzzle) {
      navigate(`/story/${character}/${selectedPuzzle}`);
    }
  };

  const isGrandparent = character === "grandparents";
  const completedCount = completedPuzzles.length;
  const totalCount = PUZZLES.length;

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(`/dashboard/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Center</span>
        </button>

        <div className="text-center mb-5">
          <h1 className="text-3xl mb-1 text-amber-700">Choose Your Puzzle</h1>
          <p className="text-base text-gray-700 mb-2">Select a Photo Puzzle</p>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "Watch your grandchild solve beautiful family memories"
              : "Pick a puzzle and unlock a special story!"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 mb-5 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-600" fill="currentColor" />
              <div>
                <p className="text-sm text-purple-800 font-medium">
                  Progress: {completedCount}/{totalCount} Completed
                </p>
                <p className="text-xs text-gray-600">
                  {completedCount === totalCount
                    ? "All puzzles unlocked! Amazing!"
                    : `${totalCount - completedCount} more to unlock!`}
                </p>
              </div>
            </div>
            <div className="bg-purple-500 text-white text-lg font-bold px-4 py-2 rounded-full">
              {Math.round((completedCount / totalCount) * 100)}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {PUZZLES.map((puzzle) => {
            const isCompleted = completedPuzzles.includes(puzzle.id);

            return (
              <div
                key={puzzle.id}
                className={`bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg overflow-hidden border-2 ${
                  isCompleted ? "border-green-300" : "border-purple-200"
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback
                    src={puzzle.imageUrl}
                    alt={puzzle.title}
                    className="w-full h-full object-cover"
                  />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur rounded-full p-3 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                    </div>
                  )}
                  {!isCompleted && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {puzzle.difficulty}
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Unlocked
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl text-gray-800 mb-1">{puzzle.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                      <span className="text-sm text-purple-600">{puzzle.theme}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated Time: {puzzle.estimatedTime}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePuzzleClick(puzzle.id)}
                    className={`w-full py-3 rounded-2xl font-medium text-base transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-xl"
                        : "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white hover:shadow-xl"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Play className="w-5 h-5" />
                        Play or Listen
                      </>
                    ) : (
                      <>
                        <PuzzleIcon className="w-5 h-5" />
                        Start Puzzle
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isGrandparent && (
          <div className="mt-6 bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl p-4 border-2 border-orange-200">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-1">
                💡 Complete puzzles to unlock more stories!
              </p>
              <p className="text-xs text-gray-600">
                Each puzzle reveals a special memory from your grandparents
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Dialog for Completed Puzzles */}
      {showActionDialog && selectedPuzzle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-gray-800 mb-2">Puzzle Unlocked!</h3>
              <p className="text-sm text-gray-600">
                What would you like to do?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base font-medium"
              >
                <PuzzleIcon className="w-5 h-5" />
                Play Puzzle Again
              </button>

              <button
                onClick={handleListenStory}
                className="w-full bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base font-medium"
              >
                <Play className="w-5 h-5" />
                Listen to Story
              </button>

              <button
                onClick={() => {
                  setShowActionDialog(false);
                  setSelectedPuzzle(null);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl hover:bg-gray-200 transition-all text-base font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
