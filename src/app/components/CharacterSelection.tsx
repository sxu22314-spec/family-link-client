import { useNavigate } from "react-router";
import { Users, Baby, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import elderlyImage from "../../assets/elderly.png";
import childrenImage from "../../assets/children.png"; 
import { selectRole } from "../../services/api/userApi";

export function CharacterSelection() {
  const navigate = useNavigate();

  // ============================================================================
  // 2. 核心处理逻辑
  // ============================================================================
  const handleCharacterSelect = async (character: "grandparents" | "grandson") => {
    // 映射前端角色到后端 ID
    const roleId = character === "grandparents" ? 2 : 1;

    // 调用 API 获取数据
    const userInfo = await selectRole(roleId);

    if (userInfo) {
      // 将用户信息保存到本地，供后续 Dashboard 或上传功能使用
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      
      // 跳转到对应的 Dashboard
      navigate(`/dashboard/${character}`);
    } else {
      alert("无法获取用户信息，请检查后端服务是否启动。");
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Welcome</span>
        </button>

        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
            <h1 className="text-4xl text-amber-600">Family Link</h1>
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
          </div>
          <p className="text-lg text-amber-800 mb-2">Family Link</p>
          <p className="text-gray-600 px-4">Let love span across time and space, let memories stay forever</p>
        </div>

        {/* Info Card */}
        <div className="bg-white/80 backdrop-blur rounded-3xl p-5 mb-6 border-2 border-amber-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-base mb-1 text-gray-800">Choose your identity to start the journey.</h3>
            </div>
          </div>
        </div>

        {/* Character Cards */}
        <div className="space-y-5">
          {/* Grandparents Card */}
          <button
            onClick={() => handleCharacterSelect("grandparents")}
            className="w-full bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-orange-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl mb-1 text-gray-800">Grandparents</h2>
                <p className="text-sm text-amber-600">Passing on wisdom and warmth</p>
              </div>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden mb-3 border-2 border-orange-100">
              <ImageWithFallback src={elderlyImage} className="w-full h-full object-cover" />
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-sm text-gray-700 leading-relaxed text-left">
                <span className="text-amber-700 font-bold">✨ You can:</span> Record stories, upload photos, and share memories.
              </p>
            </div>
          </button>

          {/* Grandson Card */}
          <button
            onClick={() => handleCharacterSelect("grandson")}
            className="w-full bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-sky-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Baby className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl mb-1 text-gray-800">Grandchild</h2>
                <p className="text-sm text-teal-600">Explore joy and growth</p>
              </div>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden mb-3 border-2 border-sky-100">
              <ImageWithFallback src={childrenImage} alt="Grandchild" className="w-full h-full object-cover" />
            </div>
            <div className="bg-sky-50 rounded-xl p-3 border border-sky-200">
              <p className="text-sm text-gray-700 leading-relaxed text-left">
                <span className="text-teal-700 font-bold">✨ You can:</span> Play puzzles, listen to stories, and feel the love.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Tap a card to choose your identity and begin your journey</p>
        </div>
      </div>
    </div>
  );
}