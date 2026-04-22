import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, FileText, Mic, Image as ImageIcon } from "lucide-react";

export function FamilyMomentStoryUpload() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6 pb-24">
        <button
          onClick={() => navigate("/family-moments")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Family Moments</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Story Upload</h1>
          <p className="text-base text-gray-700 mb-1">Create a Story for This Puzzle Photo</p>
          <p className="text-sm text-gray-600 px-4">
            This page is UI-only for now. Story upload logic will be connected next.
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700 mb-3">
            <Sparkles className="w-5 h-5" />
            <p className="font-medium">Planned Steps</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
              <div className="flex items-center gap-2 text-gray-800">
                <FileText className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">1. Enter Story Details</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Title, topic, and a short description.</p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
              <div className="flex items-center gap-2 text-gray-800">
                <Mic className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium">2. Upload Audio</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Record or upload narration for the story.</p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
              <div className="flex items-center gap-2 text-gray-800">
                <ImageIcon className="w-4 h-4 text-fuchsia-500" />
                <span className="text-sm font-medium">3. Link Puzzle Photo</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Bind this photo to a playable puzzle flow.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 text-sm text-gray-700">
          <p className="font-medium text-gray-800 mb-1">Status</p>
          <p>UI mock is ready. Backend/API integration is not enabled yet.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 via-amber-50 to-transparent">
        <button
          onClick={() => navigate("/family-moments")}
          className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg transition-all text-base font-medium"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
