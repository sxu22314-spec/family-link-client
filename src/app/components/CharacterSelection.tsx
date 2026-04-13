import { useNavigate } from "react-router";
import { Users, Baby, Heart, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CharacterSelection() {
  const navigate = useNavigate();

  const handleCharacterSelect = (character: string) => {
    navigate(`/dashboard/${character}`);
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
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

        <div className="bg-white/80 backdrop-blur rounded-3xl p-5 mb-6 border-2 border-amber-200">
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

        <div className="space-y-5">
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
                <p className="text-base text-gray-700 mb-1">Grandparents</p>
                <p className="text-sm text-amber-600">Passing on wisdom and warmth</p>
              </div>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden mb-3 border-2 border-orange-100">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1689782243186-ac0da84bb1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxncmFuZHBhcmVudHMlMjBncmFuZGNoaWxkcmVuJTIwaGFwcHklMjB0b2dldGhlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzc2MDY4OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Grandparents"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="text-amber-700">✨ You can:</span> Record stories, create puzzles, and share precious memories.
              </p>
            </div>
          </button>

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
                <p className="text-base text-gray-700 mb-1">Grandchild</p>
                <p className="text-sm text-teal-600">Explore joy and growth</p>
              </div>
            </div>
            <div className="h-32 rounded-2xl overflow-hidden mb-3 border-2 border-sky-100">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1574492909706-09f2b2f0d909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHxfHxjaGlsZCUyMHBsYXlpbmclMjBwdXp6bGUlMjBoYXBweXxlbnwxfHx8fDE3NzYwNjg5ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Grandchild"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-sky-50 rounded-xl p-3 border border-sky-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="text-teal-700">✨ You can:</span> Play puzzles, listen to stories, and feel the love.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Tap a card to choose your identity and get started</p>
          <p className="text-xs text-gray-400 mt-1">Tap a card to begin your journey</p>
        </div>
      </div>
    </div>
  );
}