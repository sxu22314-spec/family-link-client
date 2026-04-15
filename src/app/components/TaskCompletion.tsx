import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Unlock,
  Send,
  Sparkles,
} from "lucide-react";
import { Story, TaskCompletion as TaskCompletionType } from "../../types/story";
import { fetchStories, saveTaskCompletion, updateStory } from "../../services/api";

export function TaskCompletion() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Task response states
  const [answer, setAnswer] = useState("");
  const [drawingCanvas, setDrawingCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStory();
  }, [storyId]);

  useEffect(() => {
    if (canvasRef.current && story?.taskType === "drawing") {
      setDrawingCanvas(canvasRef.current);
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [story]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const userId = "grandparent-1";
      const stories = await fetchStories(userId);
      const foundStory = stories.find((s) => s.id === storyId);
      if (foundStory) {
        setStory(foundStory);
      }
    } catch (error) {
      console.error("Error loading story:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!story) return;

    try {
      setSubmitting(true);

      // Build task completion based on type
      const completion: TaskCompletionType = {
        storyId: story.id,
        completedAt: new Date(),
        taskResponse: {
          type: story.taskType,
        },
      };

      switch (story.taskType) {
        case "question":
          completion.taskResponse.answer = answer.trim().toLowerCase();
          // Validate answer
          if (
            story.taskData.correctAnswer &&
            completion.taskResponse.answer !== story.taskData.correctAnswer
          ) {
            alert("That's not quite right. Try again!");
            setSubmitting(false);
            return;
          }
          break;

        case "drawing":
          if (drawingCanvas) {
            completion.taskResponse.drawingDataUrl = drawingCanvas.toDataURL();
          }
          break;

        case "photo-upload":
          if (photoFile) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              completion.taskResponse.photoDataUrl = e.target?.result as string;
              await finishSubmission(completion);
            };
            reader.readAsDataURL(photoFile);
            return;
          }
          break;
      }

      await finishSubmission(completion);
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Error submitting task. Please try again.");
      setSubmitting(false);
    }
  };

  const finishSubmission = async (completion: TaskCompletionType) => {
    try {
      // Save task completion
      await saveTaskCompletion(completion);

      // Unlock the story
      await updateStory(story!.id, { isLocked: false });

      // Show success and navigate to listen
      alert("🎉 Great job! Story unlocked!");
      navigate(`/story-library/listen/${story!.id}`);
    } catch (error) {
      console.error("Error finishing submission:", error);
      setSubmitting(false);
    }
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingCanvas) return;
    setIsDrawing(true);
    const rect = drawingCanvas.getBoundingClientRect();
    const ctx = drawingCanvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingCanvas) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const ctx = drawingCanvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!drawingCanvas) return;
    const ctx = drawingCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600">Loading task...</p>
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

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Complete the Task</h1>
          <p className="text-base text-gray-700 mb-2">{story.title}</p>
          <p className="text-sm text-gray-600 px-4">
            Finish this task to unlock the story!
          </p>
        </div>

        {/* Task Instructions */}
        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 mb-5 border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm text-purple-800 mb-1">✨ Your Task</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {story.taskData.prompt}
              </p>
            </div>
          </div>
        </div>

        {/* Task Interface */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-lg mb-5">
          {story.taskType === "question" && (
            <div>
              <label className="block text-base text-gray-800 mb-3">
                {story.taskData.question}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Hint: Think about what you learned from the story description
              </p>
            </div>
          )}

          {story.taskType === "drawing" && (
            <div>
              <p className="text-sm text-gray-700 mb-3">
                {story.taskData.drawingPrompt}
              </p>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden mb-3">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full cursor-crosshair bg-white"
                />
              </div>
              <button
                onClick={clearCanvas}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-all"
              >
                Clear & Start Over
              </button>
            </div>
          )}

          {story.taskType === "photo-upload" && (
            <div>
              <p className="text-sm text-gray-700 mb-3">
                {story.taskData.photoPrompt}
              </p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhotoFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                className="w-full border-2 border-dashed border-sky-300 rounded-xl p-6 bg-sky-50 hover:bg-sky-100 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">📸</span>
                  <p className="text-sm text-gray-700">
                    {photoFile ? photoFile.name : "Tap to upload photo"}
                  </p>
                </div>
              </button>
              {photoFile && (
                <div className="mt-3 bg-green-50 rounded-xl p-2 border border-green-200">
                  <p className="text-xs text-green-700 text-center">
                    Photo selected! ✓
                  </p>
                </div>
              )}
            </div>
          )}

          {story.taskType === "memory-match" && (
            <div>
              <p className="text-sm text-gray-700 mb-3">
                Match the pairs to complete the task
              </p>
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Memory match interface coming soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            (story.taskType === "question" && !answer.trim()) ||
            (story.taskType === "photo-upload" && !photoFile)
          }
          className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Submitting...
            </>
          ) : (
            <>
              <Unlock className="w-5 h-5" />
              Submit & Unlock Story
            </>
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Complete the task correctly to unlock the story
          </p>
        </div>
      </div>
    </div>
  );
}
