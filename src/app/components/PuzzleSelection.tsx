import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, CheckCircle, Play, Puzzle as PuzzleIcon, Star, Trophy } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PuzzleOption {
  id: string;
  title: string;
  theme: string;
  imageUrl: string;
  isLocked: number | string | boolean | null | undefined;
}

export function PuzzleSelection() {
  const navigate = useNavigate();
  const { character } = useParams();

  const [puzzles, setPuzzles] = useState<PuzzleOption[]>([]);
  const [completedPuzzles, setCompletedPuzzles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPuzzle, setSelectedPuzzle] = useState<string | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);

  // Normalize backend values to a predictable 0/1 lock state.
  // 1 means locked, 0 means unlocked(completed).
  const normalizeLockValue = (value: number | string | boolean | null | undefined) => {
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
      if (value.toLowerCase() === "true") return 1;
      if (value.toLowerCase() === "false") return 0;
    }
    return 1;
  };

  const isPuzzleCompletedByBackend = (lockValue: number | string | boolean | null | undefined) =>
    normalizeLockValue(lockValue) === 0;

  const buildPuzzleRouteState = (puzzle: PuzzleOption | undefined) => ({
    imageUrl: puzzle?.imageUrl ?? "",
    title: puzzle?.title ?? "Family Memory",
    theme: puzzle?.theme ?? "",
    syncEnabled: true,
    syncRoomId: puzzle?.id ? `memory-puzzle-${puzzle.id}` : undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://192.168.1.104:8080/puzzle/getAllpuzzles");
        const result = await response.json();

        if (result.code === 0) {
          const mappedPuzzles: PuzzleOption[] = result.data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            theme: item.theme,
            imageUrl: encodeURI(item.imageUrl),
            isLocked: item.isLocked,
          }));

          setPuzzles(mappedPuzzles);

          const completedIds = result.data
            .filter((item: any) => isPuzzleCompletedByBackend(item.isLocked))
            .map((item: any) => item.id.toString());

          setCompletedPuzzles(completedIds);
        }
      } catch (error) {
        console.error("Failed to sync with backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePuzzleClick = (puzzleId: string) => {
    const isCompleted = completedPuzzles.includes(puzzleId);
    const selectedData = puzzles.find((p) => p.id === puzzleId);

    if (isCompleted) {
      setSelectedPuzzle(puzzleId);
      setShowActionDialog(true);
      return;
    }

    navigate(`/puzzle/${character}/${puzzleId}`, {
      state: buildPuzzleRouteState(selectedData),
    });
  };

  const handlePlayAgain = () => {
    if (!selectedPuzzle) return;

    const selectedData = puzzles.find((p) => p.id === selectedPuzzle);
    navigate(`/puzzle/${character}/${selectedPuzzle}`, {
      state: buildPuzzleRouteState(selectedData),
    });
  };

  const handleListenStory = () => {
    if (selectedPuzzle) navigate(`/story/${character}/${selectedPuzzle}`);
  };

  const isGrandparent = character === "grandparents";
  const completedCount = completedPuzzles.length;
  const totalCount = puzzles.length;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-amber-50">
        <div className="text-amber-700 animate-pulse font-medium">Loading Family Memories...</div>
      </div>
    );
  }

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
              ? "Wait for your grandchild to start, then watch every puzzle move in real time."
              : "Pick a puzzle and unlock a special story!"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 mb-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-purple-600" fill="currentColor" />
              <div>
                <p className="text-sm text-purple-800 font-medium">
                  Progress: {completedCount}/{totalCount} Completed
                </p>
                <p className="text-xs text-gray-600">
                  {totalCount > 0 && completedCount === totalCount
                    ? "All puzzles unlocked! Amazing!"
                    : `${totalCount - completedCount} more to unlock!`}
                </p>
              </div>
            </div>
            <div className="bg-purple-500 text-white text-lg font-bold px-4 py-2 rounded-full">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {puzzles.map((puzzle) => {
            const isCompleted = completedPuzzles.includes(puzzle.id);

            return (
              <div
                key={puzzle.id}
                className={`bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg overflow-hidden border-2 transition-all ${
                  isCompleted ? "border-green-300" : "border-purple-200"
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageWithFallback src={puzzle.imageUrl} alt={puzzle.title} className="w-full h-full object-cover" />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur rounded-full p-3 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                      <CheckCircle className="w-3 h-3" />
                      Unlocked
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl text-gray-800 mb-1">{puzzle.title}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                      <span className="text-sm text-purple-600">{puzzle.theme}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePuzzleClick(puzzle.id)}
                    className={`w-full py-3 rounded-2xl font-medium text-base transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-xl shadow-green-100"
                        : "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white hover:shadow-xl shadow-purple-100"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Play className="w-5 h-5" /> Play or Listen
                      </>
                    ) : (
                      <>
                        <PuzzleIcon className="w-5 h-5" /> Start Puzzle
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
              <p className="text-sm text-gray-700 mb-1">Complete puzzles to unlock more stories!</p>
              <p className="text-xs text-gray-600">Each puzzle reveals a special memory from your grandparents.</p>
            </div>
          </div>
        )}
      </div>

      {showActionDialog && selectedPuzzle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl scale-in-center">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Puzzle Unlocked!</h3>
              <p className="text-sm text-gray-600">What would you like to do with this memory?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base font-bold shadow-md shadow-purple-100"
              >
                <PuzzleIcon className="w-5 h-5" /> Play Puzzle Again
              </button>

              <button
                onClick={handleListenStory}
                className="w-full bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base font-bold shadow-md shadow-orange-100"
              >
                <Play className="w-5 h-5" /> Listen to Story
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
