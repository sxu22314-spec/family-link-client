import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Shuffle, Trophy, PlayCircle, Lightbulb, Target, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
}

const PUZZLE_IMAGES: { [key: string]: string } = {
  "family-picnic": "https://images.unsplash.com/photo-1775441522416-9cf438595465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBwaWNuaWMlMjBvdXRkb29ycyUyMGhhcHB5fGVufDF8fHx8MTc3NjQwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "park-play": "https://images.unsplash.com/photo-1577897113051-1a0395bfc3e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZHBhcmVudHMlMjBwbGF5aW5nJTIwY2hpbGRyZW4lMjBwYXJrfGVufDF8fHx8MTc3NjQwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "cooking-together": "https://images.unsplash.com/photo-1758874960466-fb0a3e0007bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjb29raW5nJTIwdG9nZXRoZXIlMjBraXRjaGVufGVufDF8fHx8MTc3NjM4ODk5NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "birthday-celebration": "https://images.unsplash.com/photo-1768767278997-136b49ce5d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBjZWxlYnJhdGluZyUyMGJpcnRoZGF5JTIwY2FrZXxlbnwxfHx8fDE3NzY0MDc1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

const COMPLETED_PUZZLES_KEY = "completed-puzzles";

export function MemoryPuzzle() {
  const navigate = useNavigate();
  const { character, puzzleId } = useParams();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  const isGrandparent = character === "grandparents";
  const gridSize = 9; // 3x3 puzzle

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const newPieces: PuzzlePiece[] = Array.from({ length: gridSize }, (_, i) => ({
      id: i,
      currentIndex: i,
      correctIndex: i,
    }));

    // Shuffle the pieces
    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempIndex = shuffled[i].currentIndex;
      shuffled[i].currentIndex = shuffled[j].currentIndex;
      shuffled[j].currentIndex = tempIndex;
    }

    setPieces(shuffled);
    setCompleted(false);
    setMoves(0);
    setSelectedPiece(null);
  };

  const handlePieceClick = (index: number) => {
    if (completed) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      if (selectedPiece === index) {
        setSelectedPiece(null);
        return;
      }

      // Swap pieces
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.currentIndex === selectedPiece);
      const piece2 = newPieces.find(p => p.currentIndex === index);

      if (piece1 && piece2) {
        const tempIndex = piece1.currentIndex;
        piece1.currentIndex = piece2.currentIndex;
        piece2.currentIndex = tempIndex;
      }

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // Check if puzzle is complete
      const isComplete = newPieces.every(p => p.currentIndex === p.correctIndex);
      if (isComplete) {
        setCompleted(true);
        const completedPuzzles = JSON.parse(localStorage.getItem(COMPLETED_PUZZLES_KEY) || "[]");
        if (!completedPuzzles.includes(puzzleId)) {
          completedPuzzles.push(puzzleId);
          localStorage.setItem(COMPLETED_PUZZLES_KEY, JSON.stringify(completedPuzzles));
        }
      }
    }
  };

  const getPieceAtPosition = (position: number) => {
    return pieces.find(p => p.currentIndex === position);
  };

  const correctPieces = pieces.filter(p => p.currentIndex === p.correctIndex).length;
  const progress = Math.round((correctPieces / gridSize) * 100);

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(`/puzzle-selection/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Puzzle Selection</span>
        </button>

        <div className="text-center mb-4">
          <h1 className="text-3xl mb-1 text-amber-700">Memory Puzzle</h1>
          <p className="text-base text-gray-700 mb-2">Memory Puzzle Game</p>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "Witness every step of your grandchild's growth"
              : "Complete the puzzle to unlock a warm story"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-4 mb-4 border-2 border-purple-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">Game Progress</span>
            </div>
            <span className="text-lg text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600">Moves: <span className="text-purple-600">{moves}</span></span>
            </div>
            <div className="text-gray-600">
              Correct: <span className="text-green-600">{correctPieces}/{gridSize}</span>
            </div>
          </div>
        </div>

        {!completed && (
          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-4 mb-4 border-2 border-sky-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-sky-800 mb-1.5">
                  {isGrandparent ? "📌 Guidance" : "🎯 Game Tips"}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {isGrandparent
                    ? "Encourage them to observe the whole image first. Starting from the corners is usually easier. Giving them time to think is key to building confidence."
                    : "Tap two pieces to swap their positions. Try finding the corner pieces first, then fill in the middle!"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "Patience" : "Observe Closely"}
                  </span>
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "Encouragement" : "Start from Corners"}
                  </span>
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "Grow Together" : "Take Your Time"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {completed && (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-xl p-6 mb-4 text-center border-2 border-yellow-300">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-3 drop-shadow-lg" />
            <h2 className="text-2xl mb-1 text-gray-800">Puzzle Complete! 🎉</h2>
            <p className="text-base text-gray-700 mb-1">Great Job!</p>
            <p className="text-gray-600 mb-4">
              {isGrandparent
                ? `The puzzle was completed in ${moves} moves. Wonderful!`
                : `Awesome! You finished the puzzle in just ${moves} moves!`}
            </p>
            <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-200">
              <p className="text-sm text-gray-700">
                {isGrandparent
                  ? "Now you can listen to the recorded story together."
                  : "You've unlocked a special story from your grandparents!"}
              </p>
            </div>
            <button
              onClick={() => navigate(`/story/${character}`)}
              className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto text-base"
            >
              <PlayCircle className="w-6 h-6" />
              {isGrandparent ? "Listen to Story" : "Unlock Story"}
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4 border-2 border-orange-100">
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600">
              {selectedPiece !== null
                ? "Select another piece to swap"
                : "Tap a piece to start"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: gridSize }, (_, i) => {
              const piece = getPieceAtPosition(i);
              const isSelected = selectedPiece === i;
              const isCorrect = piece?.currentIndex === piece?.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => handlePieceClick(i)}
                  disabled={completed}
                  className={`aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                    isSelected
                      ? "border-purple-500 scale-95 shadow-lg"
                      : isCorrect && !completed
                      ? "border-green-300"
                      : "border-orange-100 hover:border-purple-300"
                  } ${completed ? "cursor-default border-green-400" : "cursor-pointer active:scale-90"}`}
                >
                  {piece && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${PUZZLE_IMAGES[puzzleId || "family-picnic"]})`,
                        backgroundPosition: `${(piece.correctIndex % 3) * 50}% ${
                          Math.floor(piece.correctIndex / 3) * 50
                        }%`,
                        backgroundSize: "300%",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={initializePuzzle}
          className="w-full bg-gradient-to-r from-white to-orange-50 text-amber-700 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-orange-200 flex items-center justify-center gap-2 text-base"
        >
          <Shuffle className="w-5 h-5" />
          {completed ? "New Game" : "Reshuffle"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {isGrandparent
              ? "Your presence is the warmest education"
              : "Complete the puzzle for a special reward!"}
          </p>
        </div>
      </div>
    </div>
  );
}