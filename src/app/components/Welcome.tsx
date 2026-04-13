import { useNavigate } from "react-router";
import { Heart, Sparkles } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/character-selection");
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
            <h1 className="text-4xl text-amber-600">Family Link</h1>
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
          </div>
          <p className="text-lg text-amber-800 mb-2">Family Link</p>
          <p className="text-gray-600 px-4">Let love span across time and space, let memories stay forever</p>
          <p className="text-sm text-gray-500 mt-1">Connecting hearts across generations</p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-3xl p-5 border-2 border-amber-200 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-base mb-1 text-gray-800">Welcome to Family Space</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A place for grandparents and grandchildren to create beautiful memories together. Choose your identity to start the journey.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        >
          Tap to Continue
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Ready to start your journey?</p>
        </div>
      </div>
    </div>
  );
}
