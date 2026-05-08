import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Unlock,
  Sparkles,
} from "lucide-react";
import { Story, TaskCompletion as TaskCompletionType } from "../../../types/story";
import { getChildStoryById } from "./data/presetChildStories";

export function TaskCompletion() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [answer, setAnswer] = useState("");
  const [drawingCanvas, setDrawingCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const foundStory = storyId ? getChildStoryById(storyId) : null;
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

      const completion: TaskCompletionType = {
        storyId: story.id,
        completedAt: new Date(),
        taskResponse: {
          type: story.taskType,
        },
      };

      if (story.taskType === "question") {
        completion.taskResponse.answer = answer.trim().toLowerCase();
      }

      if (story.taskType === "drawing" && drawingCanvas) {
        completion.taskResponse.drawingDataUrl = drawingCanvas.toDataURL();
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
      console.log("Task completion saved locally:", completion);
      alert("Please try again.");
      setSubmitting(false);
    } catch (error) {
      console.error("Error finishing submission:", error);
      setSubmitting(false);
    }
  };

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

        <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-2xl p-4 mb-5 border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm text-purple-800 mb-1">Your Task</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {story.taskData.prompt}
              </p>
            </div>
          </div>
        </div>

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
                Any answer is accepted for this demo task.
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
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
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
            After unlock, you can enter the story directly next time.
          </p>
        </div>
      </div>
    </div>
  );
}
