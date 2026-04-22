import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Puzzle, ArrowLeft, Book, Heart, Star, Lightbulb, Clock, Image } from "lucide-react";

const FAMILY_MOMENTS_KEY = "family-moment-photos";

export function GrandchildCenter() {
  const navigate = useNavigate();
  const [familyPhotos, setFamilyPhotos] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAMILY_MOMENTS_KEY);
    if (stored) {
      try {
        setFamilyPhotos(JSON.parse(stored));
      } catch {
        setFamilyPhotos([]);
      }
    }
  }, []);

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
          {/* Family Moments Card */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-lg p-6 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-orange-500 flex items-center justify-center shadow-md">
                <Image className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Family Moments</h2>
                <p className="text-sm text-rose-600">Grandparents' Photos</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Live View</div>
            </div>

            <div className="bg-rose-50 rounded-xl p-3 mb-4 border border-rose-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Peek at the warm photos your grandparents shared. These little moments help you feel closer and learn about family stories.
              </p>
              <div className="flex items-center gap-2 text-xs text-rose-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Photos are synced from grandparents' Family Moments</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/family-moments")}
              className="w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Enter Family Moments →
            </button>
          </div>

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
              onClick={() => navigate(`/puzzle-selection/grandson`)}
              className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Play Puzzle Game →
            </button>
          </div>

          {/* Story Library Card */}
          <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 border-2 border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Story Library</h2>
                <p className="text-sm text-sky-600">Wisdom & Tales</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Listen to wonderful stories told by your grandparents, each filled with love and wisdom. Complete fun tasks to unlock new stories!
              </p>
              <div className="flex items-center gap-2 text-xs text-sky-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Complete tasks to unlock stories</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/story-library/grandson`)}
              className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Explore Story Library →
            </button>
          </div>

          {/* History Game Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-lg p-6 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">History Guessing Game</h2>
                <p className="text-sm text-emerald-600">Fun & Learning</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Guess famous Chinese historical figures! Ask yes/no questions to your grandparents and find out who they have in mind.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Choose time: 60, 90, or 120 seconds</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/history-game/grandson`)}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Start History Game →
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
