import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";
import { Story } from "../../../types/story";
import { getChildStoryById } from "./data/presetChildStories";

export function StoryPlayer() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const foundStory = storyId ? getChildStoryById(storyId) : null;
      if (foundStory) {
        setStory(foundStory);
      }
    } catch (error) {
      console.error("Error loading story:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      return;
    }

    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
      return;
    }

    setCurrentTime((prev) => Math.min(duration, prev + 10));
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <p className="text-gray-600">Story not found</p>
      </div>
    );
  }

  if (story.isLocked) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">Locked</span>
          </div>
          <h2 className="text-xl text-gray-800 mb-2">Story Locked</h2>
          <p className="text-gray-600 mb-4">
            Complete the task first to unlock this story
          </p>
          <button
            onClick={() => navigate(`/story-library/task/${story.id}`)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all"
          >
            Complete Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/story-library/grandson")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Library</span>
        </button>

        <div className="text-center mb-5">
          <h1 className="text-3xl mb-1 text-amber-700">Story Time</h1>
          <p className="text-base text-gray-700 mb-2">{story.title}</p>
          <p className="text-sm text-gray-600 px-4">A story from your grandparents</p>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl p-6 mb-4 border-2 border-green-200">
          <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center border-2 border-green-100 shadow-md">
            <span className="text-5xl">Story</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl mb-1 text-gray-800">{story.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{story.description}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                About: {story.subject}
              </span>
              <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full border border-sky-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Play className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-gray-600">Listened</span>
              </div>
              <p className="text-sm text-center text-gray-800">{story.listenCount} times</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-600" fill="currentColor" />
                <span className="text-xs text-gray-600">Duration</span>
              </div>
              <p className="text-sm text-center text-gray-800">{formatTime(duration)}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-green-100 rounded-full h-3 mb-2 shadow-inner">
              <div
                className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="text-green-700">{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 mb-4">
            <button
              onClick={handleSkipBack}
              className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all border-2 border-green-200 active:scale-90"
            >
              <SkipBack className="w-6 h-6 text-green-700" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" fill="white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all border-2 border-green-200 active:scale-90"
            >
              <SkipForward className="w-6 h-6 text-green-700" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-base ${
                liked
                  ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-600 border-2 border-red-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200"
              }`}
            >
              <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
              <span>{liked ? "Loved" : "Love It"}</span>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200">
              <Volume2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {story.audioUrl && (
            <audio
              ref={audioRef}
              src={story.audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 border-2 border-purple-200">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2">Every story is a precious gift from your grandparents</p>
            <p className="text-xs text-gray-500">Each tale carries love, wisdom, and memories to cherish forever</p>
          </div>
        </div>
      </div>
    </div>
  );
}
