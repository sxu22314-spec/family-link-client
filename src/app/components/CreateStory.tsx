import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  Mic,
  Image as ImageIcon,
  Save,
  AlertCircle,
} from "lucide-react";
import { Story, TaskType, TaskData } from "../../types/story";
import { createStory, uploadAudioFile, uploadCoverImage, updateStory } from "../../services/api";

export function CreateStory() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Story Info, 2: Task Selection, 3: Upload Audio
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("drawing");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [taskDetails, setTaskDetails] = useState<Partial<TaskData>>({});
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Build task data
      const taskData: TaskData = {
        type: taskType,
        prompt: taskPrompt,
        ...taskDetails,
      };

      // Create story in database (without audio/image URLs)
      const newStory = await createStory({
        title,
        description,
        subject,
        taskType,
        taskData,
        isLocked: true,
        listenCount: 0,
      });

      // Upload audio file to MinIO
      if (audioFile) {
        const audioUrl = await uploadAudioFile(audioFile, newStory.id);
        await updateStory(newStory.id, { audioUrl });
      }

      // Upload cover image to MinIO (optional)
      if (coverImage) {
        const coverImageUrl = await uploadCoverImage(coverImage, newStory.id);
        await updateStory(newStory.id, { coverImageUrl });
      }

      // Navigate back to library
      alert("Story created successfully!");
      navigate("/story-library/grandparents");
    } catch (error) {
      console.error("Error creating story:", error);
      alert("Error creating story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/story-library/grandparents")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Library</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-1 text-amber-700">Create New Story</h1>
          <p className="text-sm text-gray-600 px-4">
            Step {step} of 3: {step === 1 ? "Story Details" : step === 2 ? "Task Setup" : "Upload Audio"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? "bg-sky-500 scale-125"
                  : s < step
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Story Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-lg">
              <h2 className="text-lg text-gray-800 mb-4">Story Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Grandma's Garden"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    What/Who is this story about? *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Grandma, Uncle Tom, the old oak tree"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Story Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this story is about..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Cover Image (Optional)
                  </label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-sky-300 rounded-xl p-4 bg-sky-50 hover:bg-sky-100 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-6 h-6 text-sky-500" />
                      <p className="text-sm text-gray-700">
                        {coverImage ? coverImage.name : "Tap to upload image"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!title || !subject || !description}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next: Choose Task →
            </button>
          </div>
        )}

        {/* Step 2: Task Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-lg">
              <h2 className="text-lg text-gray-800 mb-2">Task Setup</h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose what your grandchild needs to do to unlock this story
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Task Type *
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => {
                      setTaskType(e.target.value as TaskType);
                      setTaskDetails({});
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  >
                    <option value="drawing">🎨 Drawing Task</option>
                    <option value="question">❓ Answer a Question</option>
                    <option value="memory-match">🎮 Memory Match</option>
                    <option value="photo-upload">📸 Upload a Photo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Task Prompt *
                  </label>
                  <input
                    type="text"
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    placeholder="e.g., Draw your favorite flower"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Task-specific fields */}
                {taskType === "question" && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        value={taskDetails.question || ""}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            question: e.target.value,
                          })
                        }
                        placeholder="e.g., What color were Grandma's roses?"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Correct Answer (lowercase)
                      </label>
                      <input
                        type="text"
                        value={taskDetails.correctAnswer || ""}
                        onChange={(e) =>
                          setTaskDetails({
                            ...taskDetails,
                            correctAnswer: e.target.value.toLowerCase(),
                          })
                        }
                        placeholder="e.g., red"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {taskType === "drawing" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Drawing Instructions
                    </label>
                    <textarea
                      value={taskDetails.drawingPrompt || ""}
                      onChange={(e) =>
                        setTaskDetails({
                          ...taskDetails,
                          drawingPrompt: e.target.value,
                        })
                      }
                      placeholder="Give specific instructions for the drawing..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {taskType === "photo-upload" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Photo Request
                    </label>
                    <textarea
                      value={taskDetails.photoPrompt || ""}
                      onChange={(e) =>
                        setTaskDetails({
                          ...taskDetails,
                          photoPrompt: e.target.value,
                        })
                      }
                      placeholder="e.g., Take a photo of a flower in your garden"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl hover:bg-gray-300 transition-all font-medium"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!taskPrompt}
                className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next: Upload Audio →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Audio */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-lg">
              <h2 className="text-lg text-gray-800 mb-2">Upload Audio</h2>
              <p className="text-sm text-gray-600 mb-4">
                Record or upload your story audio
              </p>

              <div className="bg-rose-50 rounded-xl p-4 mb-4 border border-rose-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 mb-1">
                      💡 Recording Tips:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Find a quiet place to record</li>
                      <li>Speak clearly and at a moderate pace</li>
                      <li>Add emotion and expression to your voice</li>
                      <li>Keep it under 5 minutes for best engagement</li>
                    </ul>
                  </div>
                </div>
              </div>

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioSelect}
                className="hidden"
              />
              <button
                onClick={() => audioInputRef.current?.click()}
                className="w-full border-2 border-dashed border-rose-300 rounded-xl p-6 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Mic className="w-8 h-8 text-rose-500" />
                  <p className="text-sm text-gray-700 font-medium">
                    {audioFile ? audioFile.name : "Tap to upload audio file"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported: MP3, WAV, M4A
                  </p>
                </div>
              </button>

              {audioFile && (
                <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-200">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Audio file ready: {audioFile.name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl hover:bg-gray-300 transition-all font-medium"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!audioFile || loading}
                className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Story
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
