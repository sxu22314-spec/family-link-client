import { useNavigate } from "react-router";
import { Puzzle, ArrowLeft, Book, Heart, Star, Lightbulb, Clock } from "lucide-react";

export function GrandchildCenter() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/character-selection")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Selection</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-2 text-amber-700">Grandchild Center</h1>
          <p className="text-base text-gray-700 mb-1">Grandchild Dashboard</p>
          <p className="text-gray-600 px-4">
            Choose a fun activity and start your joyful learning journey
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl p-4 mb-5 border-2 border-orange-200">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" />
            <div>
              <h3 className="text-sm text-amber-800 mb-1">💡 Quick Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Finish the puzzle to unlock a special story prepared just for you! Look closely at the pieces to help you finish faster.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Memory Puzzle Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-500 flex items-center justify-center shadow-md">
                <Puzzle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Memory Puzzles</h2>
                <p className="text-sm text-purple-600">Cognitive & Fun</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 mb-4 border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Solve the puzzle to hear a story from your grandparents! It's a fun way to learn and discover.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Time: 5-10 mins</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/puzzle/grandson`)}
              className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Play Puzzle Game →
            </button>
          </div>

          {/* Story Library Card - Coming Soon */}
          <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 opacity-60 border-2 border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Story Library</h2>
                <p className="text-sm text-sky-600">Wisdom & Tales</p>
              </div>
              <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">Coming Soon</div>
            </div>
            <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                Listen to wonderful stories told by your grandparents, each filled with love and wisdom.
              </p>
            </div>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl cursor-not-allowed text-base"
            >
              Coming Soon...
            </button>
          </div>

          {/* Family Moments Card - Coming Soon */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-lg p-6 opacity-60 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 via-rose-400 to-orange-500 flex items-center justify-center shadow-md">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Family Moments</h2>
                <p className="text-sm text-rose-600">Treasured Memories</p>
              </div>
              <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">Coming Soon</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 mb-4 border border-rose-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                Browse family photos to see how your grandparents looked when they were young and hear their stories.
              </p>
            </div>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl cursor-not-allowed text-base"
            >
              Coming Soon...
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Tap on "Available" activities to start the experience</p>
        </div>
      </div>
    </div>
  );
}
