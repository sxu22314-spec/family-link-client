import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { PUZZLE_WS_APP_PREFIX, PUZZLE_WS_HTTP_ENDPOINT, PUZZLE_WS_TOPIC_PREFIX } from "./api";

export type PuzzleRole = "grandson" | "grandparents";
export type PuzzleEventType =
  | "JOIN"
  | "START"
  | "MOVE"
  | "COMPLETE"
  | "HELP_REQUEST"
  | "HELP_ACCEPT";

export interface PuzzleSyncEnvelope<TPayload = unknown> {
  eventType: PuzzleEventType;
  roomId: string;
  puzzleId: string;
  actorRole: PuzzleRole;
  payload: TPayload;
  timestamp: string;
}

export interface PuzzleStartPayload {
  board: number[];
  imageUrl?: string;
  title?: string;
  theme?: string;
}

export interface PuzzleMovePayload {
  board: number[];
  fromIndex: number;
  toIndex: number;
  moves: number;
}

export interface PuzzleCompletePayload {
  board: number[];
  moves: number;
}

export interface PuzzleHelpRequestPayload {
  requestedBy: PuzzleRole;
}

export interface PuzzleHelpAcceptPayload {
  acceptedBy: PuzzleRole;
  newController: PuzzleRole;
}

interface PuzzleSyncClientOptions {
  roomId: string;
  puzzleId: string;
  role: PuzzleRole;
  onEvent: (event: PuzzleSyncEnvelope) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (message: string) => void;
}

/**
 * BACKEND REQUIRED (Spring Boot + STOMP):
 * 1. Expose SockJS endpoint:   registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
 * 2. Set app destination prefix: config.setApplicationDestinationPrefixes("/app");
 * 3. Set broker topic prefix:    config.enableSimpleBroker("/topic");
 * 4. Broadcast room topic:       /topic/puzzle/{roomId}
 * 5. Handle messages:
 *    - /app/puzzle.join
 *    - /app/puzzle.start
 *    - /app/puzzle.move
 *    - /app/puzzle.complete
 *    - /app/puzzle.help-request
 *    - /app/puzzle.help-accept
 */
export class PuzzleSyncClient {
  private client: Client;
  private subscription: StompSubscription | null = null;
  private readonly options: PuzzleSyncClientOptions;

  constructor(options: PuzzleSyncClientOptions) {
    this.options = options;
    this.client = new Client({
      webSocketFactory: () => new SockJS(PUZZLE_WS_HTTP_ENDPOINT),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.options.onConnectionChange?.(true);
        this.subscription = this.client.subscribe(
          `${PUZZLE_WS_TOPIC_PREFIX}/puzzle/${this.options.roomId}`,
          this.handleMessage
        );
      },
      onStompError: (frame) => {
        this.options.onError?.(frame.headers.message || "STOMP connection error");
      },
      onWebSocketClose: () => {
        this.options.onConnectionChange?.(false);
      },
    });
  }

  connect() {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  sendJoin() {
    this.publish("JOIN", "puzzle.join", {});
  }

  sendStart(payload: PuzzleStartPayload) {
    this.publish("START", "puzzle.start", payload);
  }

  sendMove(payload: PuzzleMovePayload) {
    this.publish("MOVE", "puzzle.move", payload);
  }

  sendComplete(payload: PuzzleCompletePayload) {
    this.publish("COMPLETE", "puzzle.complete", payload);
  }

  sendHelpRequest(payload: PuzzleHelpRequestPayload) {
    this.publish("HELP_REQUEST", "puzzle.help-request", payload);
  }

  sendHelpAccept(payload: PuzzleHelpAcceptPayload) {
    this.publish("HELP_ACCEPT", "puzzle.help-accept", payload);
  }

  private handleMessage = (message: IMessage) => {
    try {
      const parsed = JSON.parse(message.body) as PuzzleSyncEnvelope;
      this.options.onEvent(parsed);
    } catch {
      this.options.onError?.("Received malformed puzzle sync message.");
    }
  };

  private publish<TPayload>(
    eventType: PuzzleEventType,
    destinationSuffix: string,
    payload: TPayload
  ) {
    if (!this.client.connected) {
      return;
    }

    const envelope: PuzzleSyncEnvelope<TPayload> = {
      eventType,
      roomId: this.options.roomId,
      puzzleId: this.options.puzzleId,
      actorRole: this.options.role,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: `${PUZZLE_WS_APP_PREFIX}/${destinationSuffix}`,
      body: JSON.stringify(envelope),
    });
  }
}
