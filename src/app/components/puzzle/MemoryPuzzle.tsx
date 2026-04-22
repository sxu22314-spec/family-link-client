import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  ArrowLeft,
  Shuffle,
  Trophy,
  PlayCircle,
  Target,
  Sparkles,
  Hourglass,
  Radio,
  Eye,
} from "lucide-react";
import {
  PuzzleSyncClient,
  PuzzleSyncEnvelope,
  PuzzleStartPayload,
  PuzzleMovePayload,
  PuzzleCompletePayload,
  PuzzleHelpRequestPayload,
  PuzzleHelpAcceptPayload,
  PuzzleRole,
} from "../../../services/puzzleSyncClient";
import { PUZZLE_API_BASE_URL } from "../../../services/api";

interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
}

interface PuzzleRouteState {
  imageUrl?: string;
  title?: string;
  theme?: string;
  syncEnabled?: boolean;
  syncRoomId?: string;
}

interface MoveHighlight {
  fromIndex: number;
  toIndex: number;
  token: number;
}

const GRID_SIZE = 9;

export function MemoryPuzzle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { character, puzzleId } = useParams();

  const routeState = (location.state as PuzzleRouteState | null) ?? null;

  const [puzzleInfo, setPuzzleInfo] = useState({
    imageUrl: routeState?.imageUrl ?? "",
    title: routeState?.title ?? "Family Memory",
    theme: routeState?.theme ?? "",
  });

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasSessionStarted, setHasSessionStarted] = useState(!(routeState?.syncEnabled && puzzleId));
  const [syncConnected, setSyncConnected] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastMoveHighlight, setLastMoveHighlight] = useState<MoveHighlight | null>(null);
  const [activeControllerRole, setActiveControllerRole] = useState<PuzzleRole>("grandson");
  const [helpRequested, setHelpRequested] = useState(false);
  const [incomingHelpRequest, setIncomingHelpRequest] = useState(false);

  const syncClientRef = useRef<PuzzleSyncClient | null>(null);

  const isGrandparent = character === "grandparents";
  const role: PuzzleRole = isGrandparent ? "grandparents" : "grandson";
  const syncEnabled = Boolean(routeState?.syncEnabled && puzzleId);
  const roomId = routeState?.syncRoomId || `memory-puzzle-${puzzleId ?? "default"}`;
  const canOperatePuzzle = !syncEnabled || role === activeControllerRole;

  const createShuffledBoard = () => {
    const board = Array.from({ length: GRID_SIZE }, (_, index) => index);

    for (let i = board.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = board[i];
      board[i] = board[randomIndex];
      board[randomIndex] = temp;
    }

    // Prevent the edge case where the board starts fully solved.
    if (board.every((pieceId, index) => pieceId === index)) {
      [board[0], board[1]] = [board[1], board[0]];
    }

    return board;
  };

  const boardToPieces = (board: number[]) =>
    board.map((pieceId, position) => ({
      id: pieceId,
      currentIndex: position,
      correctIndex: pieceId,
    }));

  const piecesToBoard = (sourcePieces: PuzzlePiece[]) => {
    const board = Array.from({ length: GRID_SIZE }, () => -1);
    sourcePieces.forEach((piece) => {
      board[piece.currentIndex] = piece.id;
    });
    return board;
  };

  const applyBoard = (board: number[], nextMoves: number, isCompleted: boolean) => {
    if (board.length !== GRID_SIZE) {
      return;
    }

    setPieces(boardToPieces(board));
    setMoves(nextMoves);
    setCompleted(isCompleted);
    setSelectedPiece(null);
    setHasSessionStarted(true);
  };

  const initializePuzzle = () => {
    const board = createShuffledBoard();
    applyBoard(board, 0, false);
    setLastMoveHighlight(null);
  };

  const markPuzzleCompletedOnBackend = async (id: string) => {
    try {
      // BACKEND REQUIRED:
      // Expected endpoint: POST /puzzle/updateIsLocked
      // Request body: { id: number|string, isLocked: 0 }
      await fetch(`${PUZZLE_API_BASE_URL}/updateIsLocked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          isLocked: 0,
        }),
      });
    } catch (error) {
      console.error("Failed to update puzzle isLocked to 0:", error);
    }
  };

  useEffect(() => {
    setPuzzleInfo({
      imageUrl: routeState?.imageUrl ?? "",
      title: routeState?.title ?? "Family Memory",
      theme: routeState?.theme ?? "",
    });
  }, [puzzleId, routeState?.imageUrl, routeState?.title, routeState?.theme]);

  useEffect(() => {
    if (!syncEnabled) {
      initializePuzzle();
      return;
    }

    setPieces([]);
    setMoves(0);
    setCompleted(false);
    setSelectedPiece(null);
    setHasSessionStarted(false);
    setLastMoveHighlight(null);
    setActiveControllerRole("grandson");
    setHelpRequested(false);
    setIncomingHelpRequest(false);
  }, [puzzleId, syncEnabled]);

  useEffect(() => {
    if (!syncEnabled || !puzzleId) {
      return;
    }

    const handleEvent = (event: PuzzleSyncEnvelope) => {
      // Be tolerant to backend type differences (number/string) for IDs.
      const eventRoomId = String(event.roomId ?? "");
      const eventPuzzleId = String(event.puzzleId ?? "");
      const currentRoomId = String(roomId ?? "");
      const currentPuzzleId = String(puzzleId ?? "");

      if (eventRoomId !== currentRoomId || eventPuzzleId !== currentPuzzleId) {
        return;
      }

      if (event.eventType === "START") {
        const payload = event.payload as PuzzleStartPayload;
        const nextBoard = payload.board ?? [];

        if (payload.imageUrl || payload.title || payload.theme) {
          setPuzzleInfo((previous) => ({
            imageUrl: payload.imageUrl ?? previous.imageUrl,
            title: payload.title ?? previous.title,
            theme: payload.theme ?? previous.theme,
          }));
        }

        applyBoard(nextBoard, 0, false);
        setActiveControllerRole("grandson");
        setHelpRequested(false);
        setIncomingHelpRequest(false);
      }

      if (event.eventType === "MOVE") {
        const payload = event.payload as PuzzleMovePayload;
        const nextBoard = payload.board ?? [];
        const hasCompletedBoard = nextBoard.every((pieceId, index) => pieceId === index);

        applyBoard(nextBoard, payload.moves ?? 0, hasCompletedBoard);
        setLastMoveHighlight({
          fromIndex: payload.fromIndex,
          toIndex: payload.toIndex,
          token: Date.now(),
        });
      }

      if (event.eventType === "COMPLETE") {
        const payload = event.payload as PuzzleCompletePayload;
        applyBoard(payload.board ?? [], payload.moves ?? moves, true);

        if (role === "grandson" && puzzleId) {
          const completedPuzzles = JSON.parse(localStorage.getItem("completed-puzzles") || "[]");
          if (!completedPuzzles.includes(puzzleId)) {
            completedPuzzles.push(puzzleId);
            localStorage.setItem("completed-puzzles", JSON.stringify(completedPuzzles));
          }
        }
      }

      if (event.eventType === "HELP_REQUEST") {
        const payload = event.payload as PuzzleHelpRequestPayload;
        if (payload.requestedBy === "grandson") {
          setHelpRequested(true);
          if (role === "grandparents") {
            setIncomingHelpRequest(true);
          }
        }
      }

      if (event.eventType === "HELP_ACCEPT") {
        const payload = event.payload as PuzzleHelpAcceptPayload;
        setActiveControllerRole(payload.newController ?? "grandparents");
        setHelpRequested(false);
        setIncomingHelpRequest(false);
      }
    };

    const client = new PuzzleSyncClient({
      roomId,
      puzzleId,
      role,
      onEvent: handleEvent,
      onConnectionChange: (connected) => {
        setSyncConnected(connected);
        if (connected) {
          setSyncError(null);
          client.sendJoin();
        }
      },
      // BACKEND REQUIRED: if broker/topic config is wrong, this message helps the UI display a useful hint.
      onError: (message) => {
        setSyncError(message);
      },
    });

    syncClientRef.current = client;
    client.connect();

    return () => {
      client.disconnect();
      syncClientRef.current = null;
      setSyncConnected(false);
    };
  }, [syncEnabled, puzzleId, roomId, role]);

  const handleStartSynchronizedPuzzle = () => {
    if (!syncEnabled || !puzzleId || role !== "grandson") {
      return;
    }

    const board = createShuffledBoard();
    applyBoard(board, 0, false);
    setActiveControllerRole("grandson");
    setHelpRequested(false);
    setIncomingHelpRequest(false);

    // BACKEND REQUIRED: this message should be broadcast by Spring Boot to both roles in the room.
    syncClientRef.current?.sendStart({
      board,
      imageUrl: puzzleInfo.imageUrl,
      title: puzzleInfo.title,
      theme: puzzleInfo.theme,
    });
  };

  const handleRequestGrandparentHelp = () => {
    if (!syncEnabled || completed || role !== "grandson" || activeControllerRole !== "grandson") {
      return;
    }

    setHelpRequested(true);
    // BACKEND REQUIRED: broadcast HELP_REQUEST to room so the grandparent can accept in real time.
    syncClientRef.current?.sendHelpRequest({
      requestedBy: "grandson",
    });
  };

  const handleAcceptHelpRequest = () => {
    if (!syncEnabled || completed || role !== "grandparents" || !incomingHelpRequest) {
      return;
    }

    setActiveControllerRole("grandparents");
    setHelpRequested(false);
    setIncomingHelpRequest(false);
    // BACKEND REQUIRED: broadcast HELP_ACCEPT and new controller role for both clients.
    syncClientRef.current?.sendHelpAccept({
      acceptedBy: "grandparents",
      newController: "grandparents",
    });
  };

  const handlePieceClick = (clickedPosition: number) => {
    if (completed || !canOperatePuzzle || (syncEnabled && !hasSessionStarted)) {
      return;
    }

    if (selectedPiece === null) {
      setSelectedPiece(clickedPosition);
      return;
    }

    if (selectedPiece === clickedPosition) {
      setSelectedPiece(null);
      return;
    }

    const newPieces = [...pieces];
    const pieceA = newPieces.find((piece) => piece.currentIndex === selectedPiece);
    const pieceB = newPieces.find((piece) => piece.currentIndex === clickedPosition);

    if (!pieceA || !pieceB) {
      setSelectedPiece(null);
      return;
    }

    const tempIndex = pieceA.currentIndex;
    pieceA.currentIndex = pieceB.currentIndex;
    pieceB.currentIndex = tempIndex;

    const nextMoves = moves + 1;
    const nextCompleted = newPieces.every((piece) => piece.currentIndex === piece.correctIndex);
    const nextBoard = piecesToBoard(newPieces);

    setPieces(newPieces);
    setSelectedPiece(null);
    setMoves(nextMoves);
    setCompleted(nextCompleted);
    setLastMoveHighlight({
      fromIndex: selectedPiece,
      toIndex: clickedPosition,
      token: Date.now(),
    });

    if (syncEnabled && role === activeControllerRole) {
      // BACKEND REQUIRED: relay move for spectator rendering on grandparent page.
      syncClientRef.current?.sendMove({
        board: nextBoard,
        fromIndex: selectedPiece,
        toIndex: clickedPosition,
        moves: nextMoves,
      });
    }

    if (nextCompleted && puzzleId) {
      if (role === "grandson") {
        const completedPuzzles = JSON.parse(localStorage.getItem("completed-puzzles") || "[]");
        if (!completedPuzzles.includes(puzzleId)) {
          completedPuzzles.push(puzzleId);
          localStorage.setItem("completed-puzzles", JSON.stringify(completedPuzzles));
        }
      }

      // Sync completion state to backend so PuzzleSelection can rely on isLocked from server.
      void markPuzzleCompletedOnBackend(puzzleId);

      if (syncEnabled && role === activeControllerRole) {
        // BACKEND REQUIRED: emit COMPLETE so the grandparent UI can show "listen together" prompt immediately.
        syncClientRef.current?.sendComplete({
          board: nextBoard,
          moves: nextMoves,
        });
      }
    }
  };

  const getPieceAtPosition = (position: number) => pieces.find((piece) => piece.currentIndex === position);

  const correctPieces = pieces.filter((piece) => piece.currentIndex === piece.correctIndex).length;
  const progress = Math.round((correctPieces / GRID_SIZE) * 100);

  const waitingMessage = useMemo(() => {
    if (!syncEnabled) {
      return "";
    }

    if (!syncConnected) {
      return "Connecting to live puzzle room...";
    }

    return role === "grandparents"
      ? "Waiting for your grandchild to press Start Puzzle..."
      : "Press Start Puzzle when your grandparent is ready.";
  }, [syncConnected, syncEnabled, role]);

  return (
    <div className="h-full bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 overflow-y-auto">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(`/puzzle-selection/${character}`)}
          className="flex items-center gap-2 text-amber-700 mb-4 hover:text-amber-900 bg-white/60 px-4 py-2 rounded-full backdrop-blur"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Selection</span>
        </button>

        <div className="text-center mb-4">
          <h1 className="text-3xl mb-1 text-amber-700">{puzzleInfo.title}</h1>
          <p className="text-sm text-gray-600 px-4">
            {isGrandparent
              ? "Watch each move and cheer your grandchild on."
              : "Complete the puzzle to unlock a warm story."}
          </p>
        </div>

        {syncEnabled && (
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-4 border-2 border-orange-200 shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-orange-700 font-semibold">
                <Radio className="w-5 h-5" />
                <span>{syncConnected ? "Live Sync Connected" : "Live Sync Disconnected"}</span>
              </div>
              <div className="text-xs text-gray-600">Room: {roomId}</div>
            </div>
            {syncError && <p className="text-xs text-red-600 mt-2">Sync error: {syncError}</p>}
          </div>
        )}

        {syncEnabled && !hasSessionStarted && (
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl p-6 mb-4 border-2 border-amber-200 text-center">
            <Hourglass className="w-14 h-14 text-amber-500 mx-auto mb-3 animate-pulse" />
            <h2 className="text-2xl text-amber-700 mb-2">Ready to Start Together</h2>
            <p className="text-sm text-gray-700 mb-5">{waitingMessage}</p>

            {role === "grandson" ? (
              <button
                onClick={handleStartSynchronizedPuzzle}
                disabled={!syncConnected}
                className="w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Start Puzzle
              </button>
            ) : (
              <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 text-amber-900 text-sm">
                Your grandchild will start the puzzle. You will automatically enter the same board.
              </div>
            )}
          </div>
        )}

        {(hasSessionStarted || !syncEnabled) && (
          <>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-4 border-2 border-purple-200 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-600 font-bold">
                  <Target className="w-5 h-5" />
                  <span>{progress}% Finished</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Moves: {moves}
                </div>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {syncEnabled && isGrandparent && (
              <div className="bg-amber-100 border border-amber-300 rounded-2xl p-3 mb-4 flex items-center gap-2 text-amber-900 text-sm">
                <Eye className="w-4 h-4" />
                {activeControllerRole === "grandson"
                  ? "Spectator mode: your grandchild is currently operating the puzzle."
                  : "You now have control and can help complete the puzzle."}
              </div>
            )}

            {syncEnabled && role === "grandson" && activeControllerRole === "grandson" && !completed && (
              <div className="mb-4">
                <button
                  onClick={handleRequestGrandparentHelp}
                  disabled={helpRequested}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {helpRequested ? "Help Request Sent to Grandparent" : "Ask Grandparent for Help"}
                </button>
              </div>
            )}

            {syncEnabled && role === "grandparents" && incomingHelpRequest && !completed && (
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-300 rounded-2xl p-4 mb-4">
                <p className="text-sm text-sky-900 mb-3">
                  Your grandchild is asking for help. Accept to take puzzle control now.
                </p>
                <button
                  onClick={handleAcceptHelpRequest}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-bold shadow-md"
                >
                  Accept and Take Control
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl p-4 mb-4 border-2 border-orange-100">
              <div className="grid grid-cols-3 gap-1.5 aspect-square">
                {Array.from({ length: GRID_SIZE }, (_, index) => {
                  const piece = getPieceAtPosition(index);
                  const isSelected = selectedPiece === index;
                  const isCorrect = piece?.currentIndex === piece?.correctIndex;
                  const isMoveHighlighted =
                    lastMoveHighlight &&
                    (lastMoveHighlight.fromIndex === index || lastMoveHighlight.toIndex === index);

                  return (
                    <button
                      key={`${index}-${lastMoveHighlight?.token ?? 0}`}
                      onClick={() => handlePieceClick(index)}
                      disabled={completed || !canOperatePuzzle}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-500 ${
                        isSelected
                          ? "border-purple-500 scale-95 shadow-inner z-10"
                          : isMoveHighlighted
                            ? "border-amber-400 ring-4 ring-amber-300/80 scale-105 z-20"
                            : isCorrect && !completed
                              ? "border-green-300"
                              : "border-transparent shadow-sm"
                      }`}
                    >
                      {piece && (
                        <div
                          className="w-full h-full bg-no-repeat"
                          style={{
                            backgroundImage: `url(${puzzleInfo.imageUrl})`,
                            backgroundPosition: `${(piece.correctIndex % 3) * 50}% ${
                              Math.floor(piece.correctIndex / 3) * 50
                            }%`,
                            backgroundSize: "300% 300%",
                          }}
                        />
                      )}

                      {isSelected && <div className="absolute inset-0 bg-purple-500/20" />}
                      {isMoveHighlighted && <div className="absolute inset-0 bg-amber-400/25 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {completed ? (
              <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-xl p-6 text-center border-2 border-yellow-300 animate-in zoom-in duration-300">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {syncEnabled && isGrandparent ? "Puzzle Completed Together!" : "Memory Unlocked!"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {syncEnabled && isGrandparent
                    ? "You can now listen to the story together with your grandchild."
                    : "Great job! You can now continue to the story."}
                </p>
                <button
                  onClick={() => navigate(`/story/${character}/${puzzleId}`)}
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-6 h-6" />
                  {syncEnabled && isGrandparent ? "Listen Together" : "Listen to Story"}
                </button>
              </div>
            ) : (
              <button
                onClick={initializePuzzle}
                disabled={syncEnabled}
                className="w-full bg-white text-amber-700 py-4 rounded-2xl shadow-md border-2 border-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-5 h-5" />
                {syncEnabled ? "Shuffle disabled during live sync" : "Shuffle Pieces"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
