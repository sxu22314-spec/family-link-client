import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Book,
  Mic,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Play,
} from "lucide-react";
import { Story } from "../../types/story";
import { fetchStories, deleteStory } from "../../services/api";

export function StoryLibraryGrandparent() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual user ID from auth context
      const userId = "grandparent-1";
      const fetchedStories = await fetchStories(userId);
      setStories(fetchedStories);
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteStory(storyId);
        setStories(stories.filter((s) => s.id !== storyId));
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/dashboard/grandparents")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Story Library</h1>
          <p className="text-base text-gray-700 mb-2">Your Collection of Stories</p>
          <p className="text-sm text-gray-600 px-4">
            Create and manage stories for your grandchildren
          </p>
        </div>

        <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-4 mb-5 border-2 border-sky-200">
          <div className="flex items-start gap-3">
            <Book className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm text-sky-800 mb-1">💡 How It Works</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Create a story about a family member or object, record your voice, and
                assign a fun task. Your grandchild must complete the task to unlock
                and listen to your story!
              </p>
            </div>
          </div>
        </div>

        {/* Create New Story Button */}
        <button
          onClick={() => navigate("/story-library/create")}
          className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 mb-6 flex items-center justify-center gap-2 text-base font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Story
        </button>

        {/* Stories List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-3">Loading your stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-gray-200">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg text-gray-700 mb-2">No Stories Yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Start creating stories to share with your grandchild
              </p>
              <button
                onClick={() => navigate("/story-library/create")}
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-5 border-2 border-sky-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg text-gray-800 mb-1 truncate">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {story.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full border border-sky-200">
                        About: {story.subject}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
                        Task: {story.taskType.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {story.isLocked ? (
                      <Lock className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Unlock className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="bg-sky-50 rounded-xl p-3 mb-3 border border-sky-100">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5" />
                      <span>Listened {story.listenCount} times</span>
                    </div>
                    <div>
                      Created {new Date(story.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/story-library/edit/${story.id}`)
                    }
                    className="flex-1 bg-sky-100 text-sky-700 py-2 rounded-xl hover:bg-sky-200 transition-all flex items-center justify-center gap-2 text-sm border border-sky-200"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/story-library/preview/${story.id}`)
                    }
                    className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-xl hover:bg-blue-200 transition-all flex items-center justify-center gap-2 text-sm border border-blue-200"
                  >
                    <Play className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="bg-red-100 text-red-600 py-2 px-4 rounded-xl hover:bg-red-200 transition-all flex items-center justify-center border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Stories are locked until your grandchild completes the task
          </p>
        </div>
      </div>
    </div>
  );
}
