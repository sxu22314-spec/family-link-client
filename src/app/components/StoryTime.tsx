import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Calendar, Clock, BookOpen, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function StoryTime() {
  const navigate = useNavigate();
  const { character } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);

  const isGrandparent = character === "grandparents";
  const duration = 180; // 3 minutes in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(`/puzzle/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回拼图</span>
        </button>

        <div className="text-center mb-5">
          <h1 className="text-3xl mb-1 text-amber-700">故事时光</h1>
          <p className="text-base text-gray-700 mb-2">Story Time</p>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "这是您为孙辈录制的珍贵回忆"
              : "聆听祖辈的温馨故事"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl p-6 mb-4 border-2 border-orange-200">
          <div className="mb-6">
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border-2 border-orange-100 shadow-md">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758874961197-893028499f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxncmFuZHBhcmVudCUyMHJlYWRpbmclMjBzdG9yeSUyMGNoaWxkJTIwd2FybXxlbnwxfHx8fDE3NzYwNjg5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Story time"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mb-4">
              <h2 className="text-2xl mb-1 text-gray-800">夏日花园的秘密</h2>
              <p className="text-base text-gray-700 mb-2">The Summer Garden Adventure</p>
              <p className="text-sm text-gray-500">
                由 {isGrandparent ? "您" : "爷爷奶奶"} 温情讲述
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs text-gray-600">时长</span>
                </div>
                <p className="text-sm text-center text-gray-800">3分钟</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-2 border border-rose-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-xs text-gray-600">录制</span>
                </div>
                <p className="text-sm text-center text-gray-800">2026年3月</p>
              </div>
              <div className="bg-sky-50 rounded-lg p-2 border border-sky-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3.5 h-3.5 text-sky-600" fill="currentColor" />
                  <span className="text-xs text-gray-600">收听</span>
                </div>
                <p className="text-sm text-center text-gray-800">12次</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-orange-100 rounded-full h-3 mb-2 shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(currentTime / duration) * 100}%` }}
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
              <span>{liked ? "已收藏" : "收藏故事"}</span>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200">
              <Volume2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 mb-4 border-2 border-sky-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg text-gray-800">故事简介</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            还记得我们一起度过的那个美妙夏天吗？在花园深处，我们发现了一个隐藏的鸟巢。
            从那天起，我们每天都去看望那些小鸟，看着它们一天天长大。这是一段充满发现与惊喜的神奇时光，
            让我们感受到大自然的美好与生命的奇迹。
          </p>
          <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
            <p className="text-xs text-gray-600 mb-2">
              {isGrandparent
                ? "💭 讲述要点：强调观察的耐心、生命的珍贵、陪伴的温暖"
                : "💭 聆听重点：感受大自然的美好，学习爷爷奶奶的耐心与关爱"}
            </p>
            {isGrandparent && (
              <p className="text-xs text-amber-700">
                建议：讲述时可以放慢语速，增加细节描述，让孩子身临其境
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm border border-emerald-200">
              🌿 自然探索
            </span>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm border border-amber-200">
              ☀️ 夏日回忆
            </span>
            <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm border border-rose-200">
              ❤️ 亲情时刻
            </span>
            <span className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm border border-sky-200">
              🐦 生命教育
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 border-2 border-purple-200">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2">
              {isGrandparent
                ? "每一个故事都是给孩子最珍贵的礼物"
                : "每一次聆听都是与祖辈心灵的相遇"}
            </p>
            <p className="text-xs text-gray-500">
              {isGrandparent
                ? "Stories are the precious gifts we give to our grandchildren"
                : "Every story is a heartfelt connection with your grandparents"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
