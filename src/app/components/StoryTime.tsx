import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Calendar,
  Clock,
  BookOpen,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StoryDetail {
  id: string;
  title: string;
  description: string;
  subject: string;
  audioUrl: string;
  coverImageUrl: string;
  listenCount: number;
  createdAt: string;
  durationSeconds: number;
}

const STORY_API_BASE_URL = import.meta.env.VITE_STORY_API_BASE_URL || "http://192.168.1.104:8080/story";
const DEFAULT_STORY_IMAGE =
  "https://images.unsplash.com/photo-1758874961197-893028499f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxncmFuZHBhcmVudCUyMHJlYWRpbmclMjBzdG9yeSUyMGNoaWxkJTIwd2FybXxlbnwxfHx8fDE3NzYwNjg5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080";
const DEFAULT_DURATION_SECONDS = 180;

export function StoryTime() {
  const navigate = useNavigate();
  const { character, puzzleId } = useParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [hasReportedListen, setHasReportedListen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const isGrandparent = character === "grandparents";
  const duration = story?.durationSeconds ?? DEFAULT_DURATION_SECONDS;

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const normalizeStory = (raw: any): StoryDetail => {
    const listenCount = Number(raw.listenCount ?? raw.listen_count ?? 0);
    const rawDuration = Number(raw.durationSeconds ?? raw.duration_seconds ?? raw.audioDurationSeconds ?? raw.audio_duration_seconds ?? 0);

    return {
      id: String(raw.id ?? ""),
      title: String(raw.title ?? "Family Story"),
      description: String(raw.description ?? "A warm family memory story."),
      subject: String(raw.subject ?? raw.topic ?? "Family Moments"),
      audioUrl: raw.audioUrl ? encodeURI(raw.audioUrl) : "",
      coverImageUrl: String(raw.coverImageUrl ?? raw.cover_image_url ?? raw.imageUrl ?? raw.image_url ?? DEFAULT_STORY_IMAGE),
      listenCount: Number.isFinite(listenCount) ? listenCount : 0,
      createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
      durationSeconds: Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : DEFAULT_DURATION_SECONDS,
    };
  };

  const extractStoryFromResponse = (responseJson: any) => {
    const payload = responseJson?.data ?? responseJson;
    if (!payload) return null;

    if (Array.isArray(payload)) {
      return payload.length > 0 ? payload[0] : null;
    }

    return payload;
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchStoryDetail = async () => {
      if (!puzzleId) {
        setLoading(false);
        setLoadError("Missing photo id. Please return and complete a photo first.");
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        // BACKEND REQUIRED:
        // Recommended endpoint: GET /story/getByphotoId/{photoId}
        // Compatible response shape:
        // 1) { code: 0, data: {...tb_story row...} }
        // 2) { code: 0, data: [{...tb_story row...}] }
        const response = await fetch(`${STORY_API_BASE_URL}/getByPhotoId/${puzzleId}`);
        const result = await response.json();

        if (result?.code !== undefined && result.code !== 0) {
          throw new Error(result?.message || "Backend returned a non-success code.");
        }

        const extracted = extractStoryFromResponse(result);
        if (!extracted) {
          throw new Error("No story found for this puzzle.");
        }

        const normalized = normalizeStory(extracted);

        if (!isCancelled) {
          setStory(normalized);
          setCurrentTime(0);
          setHasReportedListen(false);
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load story from backend.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchStoryDetail();

    return () => {
      isCancelled = true;
    };
  }, [puzzleId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setIsPlaying(false);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setStory((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            durationSeconds: Math.floor(audio.duration),
          };
        });
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [story?.audioUrl]);

  const reportListenOnce = async () => {
    if (!story || hasReportedListen) return;

    try {
      setHasReportedListen(true);
      // BACKEND REQUIRED:
      // Optional endpoint: POST /story/incrementListenCount/{storyId}
      await fetch(`${STORY_API_BASE_URL}/incrementListenCount/${story.id}`, {
        method: "POST",
      });

      setStory((prev) => (prev ? { ...prev, listenCount: prev.listenCount + 1 } : prev));
    } catch {
      // Best effort only, should not block playback.
    }
  };

  const handlePlayPause = () => {
    if (!story) return;

    const audio = audioRef.current;
    if (!audio || !story.audioUrl) {
      return;
    }

    if (!isPlaying) {
      void reportListenOnce();
      void audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (audio && story?.audioUrl) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
      return;
    }

    setCurrentTime((previous) => Math.max(0, previous - 10));
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (audio && story?.audioUrl) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
      return;
    }

    setCurrentTime((previous) => Math.min(duration, previous + 10));
  };

  const recordedText = story?.createdAt
    ? new Date(story.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const storyTitle = story?.title ?? "Story Time";
  const storyDescription = story?.description ?? "Loading story details...";
  const storySubject = story?.subject ?? "Family Moments";
  const storyImage = story?.coverImageUrl || DEFAULT_STORY_IMAGE;

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

        <div className="text-center mb-5">
          <h1 className="text-3xl mb-1 text-amber-700">Story Time</h1>
          <p className="text-base text-gray-700 mb-2">Listen & Learn</p>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "This is a precious memory recorded for your grandchild"
              : "Listen to a warm story from your grandparents"}
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border-2 border-orange-200 p-8 text-center text-amber-700">Loading story from backend...</div>
        ) : loadError ? (
          <div className="bg-white rounded-3xl border-2 border-red-200 p-6 text-center">
            <p className="text-red-600 mb-2">Failed to load story</p>
            <p className="text-sm text-gray-600 mb-4">{loadError}</p>
            <button
              onClick={() => navigate(`/puzzle-selection/${character}`)}
              className="px-4 py-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-800"
            >
              Back to Puzzle Selection
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl p-6 mb-4 border-2 border-orange-200">
              <div className="mb-6">
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border-2 border-orange-100 shadow-md">
                  <ImageWithFallback src={storyImage} alt={storyTitle} className="w-full h-full object-cover" />
                </div>
                <div className="text-center mb-4">
                  <h2 className="text-2xl mb-1 text-gray-800">{storyTitle}</h2>
                  <p className="text-sm text-gray-500">Told by {isGrandparent ? "You" : "Grandparents"}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs text-gray-600">Duration</span>
                    </div>
                    <p className="text-sm text-center text-gray-800">{Math.max(1, Math.round(duration / 60))} mins</p>
                  </div>
                  <div className="bg-rose-50 rounded-lg p-2 border border-rose-200">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-xs text-gray-600">Recorded</span>
                    </div>
                    <p className="text-sm text-center text-gray-800">{recordedText}</p>
                  </div>
                  <div className="bg-sky-50 rounded-lg p-2 border border-sky-200">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-3.5 h-3.5 text-sky-600" fill="currentColor" />
                      <span className="text-xs text-gray-600">Listened</span>
                    </div>
                    <p className="text-sm text-center text-gray-800">{story?.listenCount ?? 0} times</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-orange-100 rounded-full h-3 mb-2 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${(Math.min(currentTime, duration) / Math.max(duration, 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-amber-700">{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-5 mb-6">
                <button
                  onClick={handleSkipBack}
                  className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-all border-2 border-orange-200 active:scale-90"
                >
                  <SkipBack className="w-6 h-6 text-orange-700" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" fill="white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  )}
                </button>

                <button
                  onClick={handleSkipForward}
                  className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-all border-2 border-orange-200 active:scale-90"
                >
                  <SkipForward className="w-6 h-6 text-orange-700" />
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
                  <span>{liked ? "Saved" : "Save Story"}</span>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 mb-4 border-2 border-sky-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg text-gray-800">Story Summary</h3>
              </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    ......
                  </p>
              <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
                <p className="text-xs text-gray-600 mb-2">{storyDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm border border-emerald-200">Story</span>
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm border border-amber-200">{storySubject}</span>
                <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm border border-rose-200">Family Memories</span>
                <span className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm border border-sky-200">Love & Wisdom</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 border-2 border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">
                  {isGrandparent
                    ? "Every story is a precious gift to our grandchildren"
                    : "Every listening is a heartfelt connection with grandparents"}
                </p>
                <p className="text-xs text-gray-500">Stories create bonds that last forever</p>
              </div>
            </div>

            {story?.audioUrl && <audio ref={audioRef} src={story.audioUrl} preload="metadata" />}
          </>
        )}
      </div>
    </div>
  );
}
