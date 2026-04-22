import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Clock, Lightbulb, CheckCircle, XCircle } from "lucide-react";

interface GameState {
  time: number;
  started: boolean;
  person: string;
  questions: { question: string; answer: string }[];
  timer: number;
  gameOver: boolean;
}

const STORAGE_KEY = 'historyGame';

export function HistoryGame() {
  const navigate = useNavigate();
  const { character } = useParams();
  const isGrandparent = character === "grandparents";

  const [gameState, setGameState] = useState<GameState>({
    time: 60,
    started: false,
    person: '',
    questions: [],
    timer: 60,
    gameOver: false
  });

  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setGameState(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (gameState.started && !gameState.gameOver) {
      const interval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;
          if (newTimer <= 0) {
            const updated = { ...prev, timer: 0, gameOver: true };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          }
          const updated = { ...prev, timer: newTimer };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.started, gameState.gameOver]);

  const updateGameState = (updates: Partial<GameState>) => {
    const newState = { ...gameState, ...updates };
    setGameState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const startGame = () => {
    updateGameState({ started: true, timer: gameState.time });
  };

  const askQuestion = () => {
    if (newQuestion.trim()) {
      updateGameState({ questions: [...gameState.questions, { question: newQuestion, answer: '' }] });
      setNewQuestion('');
    }
  };

  const answerQuestion = (index: number, answer: 'Yes' | 'No') => {
    const newQuestions = [...gameState.questions];
    newQuestions[index].answer = answer;
    updateGameState({ questions: newQuestions });
  };

  const endGame = () => {
    updateGameState({ gameOver: true });
  };

  const resetGame = () => {
    const newState: GameState = {
      time: 60,
      started: false,
      person: '',
      questions: [],
      timer: 60,
      gameOver: false
    };
    setGameState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  if (isGrandparent) {
    return (
      <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
        <div className="px-6 py-6">
          <button
            onClick={() => navigate("/dashboard/grandparents")}
            className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-6">
            <h1 className="text-3xl mb-2 text-amber-700">History Guessing Game</h1>
            <p className="text-base text-gray-700">Grandparents Side</p>
          </div>

          {!gameState.started ? (
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-xl mb-4 text-gray-800">Setup Game</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Choose Time Limit</label>
                  <select
                    value={gameState.time}
                    onChange={(e) => updateGameState({ time: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  >
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                    <option value={120}>120 seconds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Historical Figure</label>
                  <input
                    type="text"
                    value={gameState.person}
                    onChange={(e) => updateGameState({ person: e.target.value })}
                    placeholder="e.g., Confucius, Qin Shi Huang"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <button
                  onClick={startGame}
                  disabled={!gameState.person.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl disabled:opacity-50"
                >
                  Start Game
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-800">Game in Progress</h2>
                  <div className="flex items-center gap-2 text-lg font-bold text-amber-600">
                    <Clock className="w-5 h-5" />
                    {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">Historical Figure: <span className="font-bold">{gameState.person}</span></p>
                {gameState.questions.length === 0 ? (
                  <p className="text-gray-600">Waiting for grandchild's questions...</p>
                ) : (
                  <div className="space-y-3">
                    {gameState.questions.map((q, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-800 mb-2">Q{index + 1}: {q.question}</p>
                        {q.answer ? (
                          <p className="text-green-600 font-bold">Answer: {q.answer}</p>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => answerQuestion(index, 'Yes')}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => answerQuestion(index, 'No')}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={endGame}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl mt-4"
                >
                  End Game (Grandchild Guessed Correctly)
                </button>
              </div>
              {gameState.gameOver && (
                <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                  <h2 className="text-2xl text-green-600 mb-4">Game Over!</h2>
                  <button
                    onClick={resetGame}
                    className="bg-amber-500 text-white px-6 py-3 rounded-xl"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grandchild side
  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate("/dashboard/grandson")}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl mb-2 text-amber-700">History Guessing Game</h1>
          <p className="text-base text-gray-700">Grandchild Side</p>
        </div>

        {!gameState.started ? (
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
            <Lightbulb className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-700">Waiting for grandparents to start the game...</p>
          </div>
        ) : gameState.gameOver ? (
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl text-green-600 mb-4">Game Over!</h2>
            <p className="text-gray-700 mb-4">Time: {gameState.time - gameState.timer} seconds</p>
            <button
              onClick={() => navigate("/dashboard/grandson")}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-800">Guess the Historical Figure!</h2>
                <div className="flex items-center gap-2 text-lg font-bold text-amber-600">
                  <Clock className="w-5 h-5" />
                  {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700">
                  Ask yes/no questions to figure out who your grandparents have in mind. Be strategic!
                </p>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a yes/no question..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                />
                <button
                  onClick={askQuestion}
                  className="bg-blue-500 text-white px-4 py-3 rounded-xl"
                >
                  Ask
                </button>
              </div>
              {gameState.questions.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {gameState.questions.map((q, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-800 text-sm">Q{index + 1}: {q.question}</p>
                      {q.answer && (
                        <p className="text-green-600 text-sm font-bold mt-1">A: {q.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}