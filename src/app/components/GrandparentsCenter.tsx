import { useNavigate } from "react-router";
import { Puzzle, ArrowLeft, Book, Heart, Star, Lightbulb, Clock, Image } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FAMILY_MOMENTS_KEY = "family-moment-photos";

export function GrandparentsCenter() {
  const navigate = useNavigate();
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(FAMILY_MOMENTS_KEY);
    if (stored) {
      try {
        setUploadedPhotos(JSON.parse(stored));
      } catch {
        setUploadedPhotos([]);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedPhotos((prev) => {
              const next = [...prev, event.target.result as string];
              localStorage.setItem(FAMILY_MOMENTS_KEY, JSON.stringify(next));
              return next;
            });
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(FAMILY_MOMENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/character-selection")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Selection</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-2 text-amber-700">Grandparents Center</h1>
          <p className="text-base text-gray-700 mb-1">Grandparents Dashboard</p>
          <p className="text-gray-600 px-4">
            Select an activity to share your wisdom and warmth with your grandchild
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-rose-100 rounded-2xl p-4 mb-5 border-2 border-orange-200">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" />
            <div>
              <h3 className="text-sm text-amber-800 mb-1">💡 Gentle Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Every activity creates a precious memory for your grandchild. Recording stories in a quiet place makes your voice clearer and more touching.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Family Moments - Photo Upload Card */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-lg p-6 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 via-rose-400 to-orange-500 flex items-center justify-center shadow-md">
                <Image className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Family Moments</h2>
                <p className="text-sm text-rose-600">Share Precious Memories</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-rose-50 rounded-xl p-3 mb-4 border border-rose-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                Share family photos and precious moments, letting your grandchild learn about family history and warmth.
              </p>
            </div>

            {/* Upload Box */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-rose-300 rounded-2xl p-6 bg-rose-50/50 hover:bg-rose-100 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Image className="w-8 h-8 text-rose-400" />
                  <p className="text-sm text-gray-700 font-medium">Tap to upload photos</p>
                </div>
              </button>
            </div>

            {/* Display uploaded photos */}
            {uploadedPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">Uploaded ({uploadedPhotos.length}):</p>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-20 rounded-lg object-cover border border-rose-200"
                      />
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              {uploadedPhotos.length > 0 
                ? `View & Share Moments (${uploadedPhotos.length}) →` 
                : "Start Sharing Photos"}
            </button>
          </div>

          {/* Memory Puzzle Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-500 flex items-center justify-center shadow-md">
                <Puzzle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Memory Puzzles</h2>
                <p className="text-sm text-purple-600">Cognitive & Fun</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-3 mb-4 border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Help your grandchild improve observation and memory through puzzles. You can record a story as a reward upon completion.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Time: 5-10 mins</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  <span className="text-amber-700 font-bold">Suggestion: </span>
                  Complexity is moderate, suitable for children aged 6+. You can guide them, but letting them finish independently builds more confidence.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/puzzle-selection/grandparents`)}
              className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Start Memory Puzzle
            </button>
          </div>

          {/* History Game Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl shadow-lg p-6 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">History Guessing Game</h2>
                <p className="text-sm text-emerald-600">Interactive Fun</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Think of a famous Chinese historical figure and answer your grandchild's yes/no questions. Help them learn history through fun interaction!
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Set time limit and choose a historical figure</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/history-game/grandparents`)}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Start History Game
            </button>
          </div>

          {/* Story Library Card */}
          <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-lg p-6 border-2 border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl text-gray-800 mb-0.5">Story Library</h2>
                <p className="text-sm text-sky-600">Wisdom & Tales</p>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available</div>
            </div>

            <div className="bg-sky-50 rounded-xl p-3 mb-4 border border-sky-100">
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Build your story library, record and manage warm tales for your grandchild to listen to anytime. Assign tasks to make listening more engaging!
              </p>
              <div className="flex items-center gap-2 text-xs text-sky-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Create stories with tasks to unlock</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  <span className="text-amber-700 font-bold">Tip: </span>
                  Record stories about family members, objects, or special memories. Add fun tasks to make your grandchild think and engage!
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/story-library/grandparents`)}
              className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base font-medium"
            >
              Open Story Library
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Tap on "Available" activities to start the experience</p>
        </div>
      </div>
    </div>
  );
}

