import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router"; // 必须引入 useLocation
import { ArrowLeft, Shuffle, Trophy, PlayCircle, Lightbulb, Target, Sparkles } from "lucide-react";

interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
}

export function MemoryPuzzle() {
  const navigate = useNavigate();
  const location = useLocation(); // 获取从 PuzzleSelection 传来的 state
  const { character, puzzleId } = useParams();

  // --- 核心数据获取：直接使用传过来的 state ---
  // 如果用户刷新页面导致 state 丢失，这里提供一个兜底方案
  const puzzleInfo = location.state || {
    imageUrl: "", 
    title: "Family Memory",
    theme: ""
  };

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  const isGrandparent = character === "grandparents";
  const gridSize = 9; // 3x3 拼图

  // 初始化拼图
  useEffect(() => {
    initializePuzzle();
  }, [puzzleId]);

  const initializePuzzle = () => {
    // 生成 0-8 的序列
    const newPieces: PuzzlePiece[] = Array.from({ length: gridSize }, (_, i) => ({
      id: i,
      currentIndex: i,
      correctIndex: i,
    }));

    // 打乱顺序
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

  const handlePieceClick = (clickedPosition: number) => {
    if (completed) return;

    if (selectedPiece === null) {
      setSelectedPiece(clickedPosition);
    } else {
      if (selectedPiece === clickedPosition) {
        setSelectedPiece(null);
        return;
      }

      // 执行交换逻辑
      const newPieces = [...pieces];
      const piece1 = newPieces.find(p => p.currentIndex === selectedPiece);
      const piece2 = newPieces.find(p => p.currentIndex === clickedPosition);

      if (piece1 && piece2) {
        const tempIndex = piece1.currentIndex;
        piece1.currentIndex = piece2.currentIndex;
        piece2.currentIndex = tempIndex;
      }

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // 检查是否完成
      const isComplete = newPieces.every(p => p.currentIndex === p.correctIndex);
      if (isComplete) {
        setCompleted(true);
        // 保存解锁状态到本地（作为备份）
        const completedPuzzles = JSON.parse(localStorage.getItem("completed-puzzles") || "[]");
        if (!completedPuzzles.includes(puzzleId)) {
          completedPuzzles.push(puzzleId);
          localStorage.setItem("completed-puzzles", JSON.stringify(completedPuzzles));
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
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(`/puzzle-selection/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Selection</span>
        </button>

        <div className="text-center mb-4">
          <h1 className="text-3xl mb-1 text-amber-700">{puzzleInfo.title}</h1>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "Witness every step of your grandchild's growth"
              : "Complete the puzzle to unlock a warm story"}
          </p>
        </div>

        {/* 游戏进度卡片 */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-4 border-2 border-purple-200 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold">
              <Target className="w-5 h-5" />
              <span>{progress}% Finished</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Moves: {moves}
            </div>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 拼图核心网格 */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-4 border-2 border-orange-100">
          <div className="grid grid-cols-3 gap-1.5 aspect-square">
            {Array.from({ length: gridSize }, (_, i) => {
              const piece = getPieceAtPosition(i);
              const isSelected = selectedPiece === i;
              const isCorrect = piece?.currentIndex === piece?.correctIndex;

              return (
                <button
                  key={i}
                  onClick={() => handlePieceClick(i)}
                  disabled={completed}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? "border-purple-500 scale-95 shadow-inner z-10"
                      : isCorrect && !completed
                      ? "border-green-300"
                      : "border-transparent shadow-sm"
                  }`}
                >
                  {piece && (
                    <div
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${puzzleInfo.imageUrl})`,
                        // 3x3 对应 0%, 50%, 100% 的背景位置
                        backgroundPosition: `${(piece.correctIndex % 3) * 50}% ${
                          Math.floor(piece.correctIndex / 3) * 50
                        }%`,
                        backgroundSize: "300% 300%",
                      }}
                    />
                  )}
                  {/* 选中时的微光效果 */}
                  {isSelected && <div className="absolute inset-0 bg-purple-500/20" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 完成状态显示 */}
        {completed ? (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-xl p-6 text-center border-2 border-yellow-300 animate-in zoom-in duration-300">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Memory Unlocked!</h2>
            <button
              onClick={() => navigate(`/story/${character}/${puzzleId}`)}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-6 h-6" />
              Listen to Story
            </button>
          </div>
        ) : (
          <button
            onClick={initializePuzzle}
            className="w-full bg-white text-amber-700 py-4 rounded-2xl shadow-md border-2 border-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Shuffle className="w-5 h-5" />
            Shuffle Pieces
          </button>
        )}
      </div>
    </div>
  );
}