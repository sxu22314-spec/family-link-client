import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Book, Lock, Unlock, Play, Star, CheckCircle } from "lucide-react";
import { Story } from "../../../types/story";
import { getChildStories } from "./data/presetChildStories";

export function StoryLibraryChild() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      setStories(getChildStories());
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = stories.filter((s) => !s.isLocked).length;
  const totalCount = stories.length;

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/dashboard/grandson")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Story Library</h1>
          <p className="text-base text-gray-700 mb-2">Stories from Grandparents</p>
          <p className="text-sm text-gray-600 px-4">
            Complete tasks to unlock and listen to stories
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 mb-5 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-purple-600" fill="currentColor" />
            <div className="flex-1">
              <h3 className="text-sm text-purple-800 mb-1">Your Progress</h3>
              <p className="text-xs text-gray-700">
                You've unlocked {unlockedCount} out of {totalCount} stories!
              </p>
            </div>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-4 mb-5 border-2 border-sky-200">
          <div className="flex items-start gap-3">
            <Book className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm text-sky-800 mb-1">💡 How It Works</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Each story has a special task just for you! Complete the task to unlock
                the story and hear what your grandparents have to share. Have fun!
              </p>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-3">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-gray-200">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg text-gray-700 mb-2">No Stories Yet</h3>
              <p className="text-sm text-gray-500">
                Your grandparents haven't created any stories yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Unlocked Stories */}
              {stories.filter((s) => !s.isLocked).length > 0 && (
                <>
                  <h2 className="text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-green-600" />
                    Unlocked Stories ({stories.filter((s) => !s.isLocked).length})
                  </h2>
                  {stories
                    .filter((s) => !s.isLocked)
                    .map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        navigate={navigate}
                      />
                    ))}
                </>
              )}

              {/* Locked Stories */}
              {stories.filter((s) => s.isLocked).length > 0 && (
                <>
                  <h2 className="text-lg text-gray-800 mb-3 mt-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-600" />
                    Locked Stories ({stories.filter((s) => s.isLocked).length})
                  </h2>
                  {stories
                    .filter((s) => s.isLocked)
                    .map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        navigate={navigate}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Complete tasks to unlock more wonderful stories
          </p>
        </div>
      </div>
    </div>
  );
}

// Story Card Component
function StoryCard({
  story,
  navigate,
}: {
  story: Story;
  navigate: (path: string) => void;
}) {
  const taskLabels: Record<string, string> = {
    drawing: "🎨 Drawing",
    question: "Question",
    "memory-match": "🎮 Memory Match",
    "photo-upload": "📸 Photo",
  };

  return (
    <div
      className={`bg-gradient-to-br rounded-3xl shadow-lg p-5 border-2 transition-all ${
        story.isLocked
          ? "from-white to-amber-50 border-amber-200 opacity-75"
          : "from-white to-green-50 border-green-200"
      }`}
    >
      <div className="flex items-start gap-4 mb-3">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
            story.isLocked
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-green-400 to-emerald-500"
          }`}
        >
          {story.isLocked ? (
            <Lock className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg text-gray-800 mb-1 truncate">{story.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {story.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full border border-sky-200">
              About: {story.subject}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
              {taskLabels[story.taskType] || story.taskType}
            </span>
          </div>
        </div>
      </div>

      {story.isLocked ? (
        <div className="bg-amber-50 rounded-xl p-3 mb-3 border border-amber-200">
          <p className="text-xs text-gray-700 mb-2">
            🔒 Complete the task to unlock this story
          </p>
          <p className="text-xs text-amber-700">
            Task: {story.taskData.prompt}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 rounded-xl p-3 mb-3 border border-green-200">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Story unlocked! Listened {story.listenCount} times</span>
          </div>
        </div>
      )}

      <button
        onClick={() =>
          navigate(
            story.isLocked
              ? `/story-library/task/${story.id}`
              : `/story-library/listen/${story.id}`
          )
        }
        className={`w-full py-3 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium flex items-center justify-center gap-2 ${
          story.isLocked
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white"
            : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white"
        }`}
      >
        {story.isLocked ? (
          <>
            <Lock className="w-5 h-5" />
            Complete Task to Unlock
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Listen to Story
          </>
        )}
      </button>
    </div>
  );
}
