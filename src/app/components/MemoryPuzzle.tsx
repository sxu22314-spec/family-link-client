import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Shuffle, Trophy, PlayCircle, Lightbulb, Target, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
}

export function MemoryPuzzle() {
  const navigate = useNavigate();
  const { character } = useParams();
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
          onClick={() => navigate(`/dashboard/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回活动中心</span>
        </button>

        <div className="text-center mb-4">
          <h1 className="text-3xl mb-1 text-amber-700">记忆拼图</h1>
          <p className="text-base text-gray-700 mb-2">Memory Puzzle Game</p>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "见证孙辈成长的每一步"
              : "完成拼图，解锁温馨故事"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-4 mb-4 border-2 border-purple-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">游戏进度</span>
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
              <span className="text-gray-600">移动次数: <span className="text-purple-600">{moves}</span></span>
            </div>
            <div className="text-gray-600">
              正确: <span className="text-green-600">{correctPieces}/{gridSize}</span>
            </div>
          </div>
        </div>

        {!completed && (
          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-4 mb-4 border-2 border-sky-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm text-sky-800 mb-1.5">
                  {isGrandparent ? "📌 家长指导" : "🎯 游戏提示"}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {isGrandparent
                    ? "鼓励孩子先观察整体图案，从边角开始拼起会更容易。适当的提示可以帮助建立信心，但给予充分的思考时间更重要。"
                    : "点击两块拼图可以交换它们的位置。先找边角的图案，再慢慢拼中间部分会更容易哦！"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "耐心陪伴" : "仔细观察"}
                  </span>
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "适时鼓励" : "从边角开始"}
                  </span>
                  <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-gray-700">
                    {isGrandparent ? "共同成长" : "不要着急"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {completed && (
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-xl p-6 mb-4 text-center border-2 border-yellow-300">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-3 drop-shadow-lg" />
            <h2 className="text-2xl mb-1 text-gray-800">拼图完成！🎉</h2>
            <p className="text-base text-gray-700 mb-1">Puzzle Complete!</p>
            <p className="text-gray-600 mb-4">
              {isGrandparent
                ? `孩子用 ${moves} 步完成了拼图，真棒！`
                : `太棒了！你只用了 ${moves} 步就完成了！`}
            </p>
            <div className="bg-amber-50 rounded-xl p-3 mb-4 border border-amber-200">
              <p className="text-sm text-gray-700">
                {isGrandparent
                  ? "现在可以一起聆听您录制的温馨故事了"
                  : "现在可以聆听祖辈为你准备的温馨故事啦"}
              </p>
            </div>
            <button
              onClick={() => navigate(`/story/${character}`)}
              className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto text-base"
            >
              <PlayCircle className="w-6 h-6" />
              {isGrandparent ? "聆听故事" : "解锁故事"}
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4 border-2 border-orange-100">
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600">
              {selectedPiece !== null
                ? "再点击另一块拼图进行交换"
                : "点击一块拼图开始"}
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
                        backgroundImage: `url(https://images.unsplash.com/photo-1640533463401-e8ed75d2c296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxncmFuZHBhcmVudHMlMjBncmFuZGNoaWxkcmVuJTIwaGFwcHklMjB0b2dldGhlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzc2MDY4OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080)`,
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
          {completed ? "开始新游戏" : "重新打乱"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {isGrandparent
              ? "陪伴是最温暖的教育"
              : "完成拼图可以获得精彩故事奖励"}
          </p>
        </div>
      </div>
    </div>
  );
}