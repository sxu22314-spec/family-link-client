import { useNavigate } from "react-router";
import { Heart, Sparkles } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/character-selection");
  };

  return (
    /* h-screen 确保容器至少占据整个视口高度，flex-col 开启纵向布局 */
    <div className="h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex flex-col px-6 overflow-y-auto">
      {/* 内部容器逻辑：
        1. min-h-full: 确保内容区域至少和父级一样高
        2. justify-center: 将所有子元素在垂直方向居中对齐
        3. flex-1: 自动填充剩余空间
      */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-1 gap-10 py-10">
        
        {/* 顶部：标题与 Logo 区域 */}
        <div className="text-center animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-rose-500 animate-pulse" fill="currentColor" />
            <h1 className="text-4xl font-bold text-amber-600 tracking-tight">Family Link</h1>
            <Heart className="w-10 h-10 text-rose-500 animate-pulse" fill="currentColor" />
          </div>
          <p className="text-xl font-medium text-amber-800 mb-2">Family Link</p>
          <p className="text-gray-600 px-6 leading-relaxed">
            Let love span across time and space, let memories stay forever
          </p>
          <p className="text-sm text-gray-400 mt-2 italic">Connecting hearts across generations</p>
        </div>

        {/* 中间：提示卡片 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-amber-100 shadow-sm w-full">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-800">Welcome to Family Space</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A warm place for grandparents and grandchildren to create, share and preserve beautiful memories together.
              </p>
            </div>
          </div>
        </div>

        {/* 底部：交互区域 */}
        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            className="w-full max-w-[280px] bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            Tap to Continue
          </button>
          <button
            onClick={() => window.open("https://www.figma.com/make/wdkGDys0joKM7vPCE8KL8o/high-fi?p=f&t=YjOzSYGDD8jaGrDD-0&fullscreen=1", "_blank")}
            className="w-full max-w-[280px] bg-white/60 backdrop-blur-sm text-[#2D2D2D] rounded-full px-8 py-3 text-sm border border-[#D4D0CB] hover:shadow-md transition-all transform hover:scale-[1.02] active:scale-95"
          >
            try time museum?
          </button>
          <p className="text-xs text-gray-400 animate-bounce mt-2">Ready to start your journey?</p>
        </div>

      </div>
    </div>
  );
}