import { useNavigate, useParams } from "react-router";
import { Puzzle, ArrowLeft, Book, Heart, Star, Lightbulb, Clock } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const { character } = useParams();

  const isGrandparent = character === "grandparents";

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回选择</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-2 text-amber-700">
            {isGrandparent ? "祖父母活动中心" : "孙辈活动中心"}
          </h1>
          <p className="text-base text-gray-700 mb-1">
            {isGrandparent ? "Grandparents Dashboard" : "Grandchild Dashboard"}
          </p>
          <p className="text-gray-600 px-4">
            {isGrandparent
              ? "选择一个活动，与孙辈分享您的智慧与温暖"
              : "选择一个有趣的活动，开始快乐的学习之旅"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl p-4 mb-5 border-2 border-orange-200">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" />
            <div>
              <h3 className="text-sm text-amber-800 mb-1">
                {isGrandparent ? "💡 温馨提示" : "💡 小贴士"}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {isGrandparent
                  ? "每完成一个活动，您都能为孙辈留下珍贵的记忆。请确保在安静的环境中录制故事，让声音更加清晰动人。"
                  : "完成拼图游戏后，就能解锁祖辈为你准备的温馨故事啦！仔细观察每一块拼图，它们会帮助你更快完成。"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-500 flex items-center justify-center shadow-md">
                <Puzzle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">记忆拼图</h2>
                <p className="text-sm text-purple-600">Memory Puzzles</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">可用</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 mb-4 border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {isGrandparent
                  ? "通过拼图游戏，让孙辈在娱乐中锻炼观察力和记忆力。完成后可以录制您的故事作为奖励。"
                  : "拼好图片就能听到祖辈为你准备的故事！这是一个既有趣又能学到东西的小游戏。"}
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                <Clock className="w-3.5 h-3.5" />
                <span>预计用时: 5-10分钟</span>
              </div>
            </div>

            {isGrandparent && (
              <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <span className="text-amber-700">使用建议：</span>
                    拼图难度适中，适合6岁以上儿童。您可以在旁引导，但让孩子独立完成会更有成就感。
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate(`/puzzle/${character}`)}
              className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base"
            >
              {isGrandparent ? "开始记忆拼图 →" : "开始玩拼图游戏 →"}
            </button>
          </div>

          <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 opacity-60 border-2 border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">故事图书馆</h2>
                <p className="text-sm text-sky-600">Story Library</p>
              </div>
              <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">即将上线</div>
            </div>
            <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {isGrandparent
                  ? "建立您的故事库，随时录制和管理各种温馨故事，让孙辈反复聆听。"
                  : "收听祖辈讲述的各种精彩故事，每个故事都充满智慧和爱。"}
              </p>
            </div>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl cursor-not-allowed text-base"
            >
              敬请期待...
            </button>
          </div>

          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-lg p-6 opacity-60 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 via-rose-400 to-orange-500 flex items-center justify-center shadow-md">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">家庭相册</h2>
                <p className="text-sm text-rose-600">Family Moments</p>
              </div>
              <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">即将上线</div>
            </div>
            <div className="bg-rose-50 rounded-xl p-3 mb-4 border border-rose-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {isGrandparent
                  ? "分享家庭照片和珍贵瞬间，让孙辈了解家族的历史和温暖回忆。"
                  : "浏览家庭照片，看看祖辈年轻时的样子，了解家族的精彩故事。"}
              </p>
            </div>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-4 rounded-2xl cursor-not-allowed text-base"
            >
              敬请期待...
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">点击"可用"的活动开始互动体验</p>
        </div>
      </div>
    </div>
  );
}