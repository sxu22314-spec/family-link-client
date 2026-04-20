# Memory Puzzle Real-Time Sync Backend Guide (Spring Boot + WebSocket + STOMP)

This document explains exactly how to build the backend required by the new frontend sync flow.

## 1. What the frontend now expects

The frontend now sends and receives STOMP messages for a live puzzle room.

### Required WebSocket/STOMP configuration

- SockJS endpoint: `/ws`
- STOMP app prefix: `/app`
- STOMP topic prefix: `/topic`
- Room topic format: `/topic/puzzle/{roomId}`

### Required inbound destinations

- `/app/puzzle.join`
- `/app/puzzle.start`
- `/app/puzzle.move`
- `/app/puzzle.complete`
- `/app/puzzle.help-request`
- `/app/puzzle.help-accept`

### Message envelope (must match this shape)

```json
{
  "eventType": "START",
  "roomId": "memory-puzzle-12",
  "puzzleId": "12",
  "actorRole": "grandson",
  "payload": {
    "board": [3, 0, 2, 4, 1, 5, 6, 7, 8],
    "title": "Family Picnic",
    "imageUrl": "https://.../photo.jpg"
  },
  "timestamp": "2026-04-18T10:10:10.000Z"
}
```

## 2. Maven dependencies

Add to `pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
</dependencies>
```

## 3. WebSocket config

Create `WebSocketConfig.java`:

```java
package com.example.familylink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }
}
```

## 4. DTOs

### `PuzzleEventType.java`

```java
package com.example.familylink.puzzle;

public enum PuzzleEventType {
    JOIN,
    START,
    MOVE,
    COMPLETE,
    HELP_REQUEST,
    HELP_ACCEPT
}
```

### `PuzzleSyncEnvelope.java`

```java
package com.example.familylink.puzzle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class PuzzleSyncEnvelope {
    @NotNull
    private PuzzleEventType eventType;

    @NotBlank
    private String roomId;

    @NotBlank
    private String puzzleId;

    @NotBlank
    private String actorRole; // grandson | grandparents

    @NotNull
    private Map<String, Object> payload;

    @NotBlank
    private String timestamp;
}
```

## 5. STOMP controller

Create `PuzzleSyncController.java`:

```java
package com.example.familylink.puzzle;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class PuzzleSyncController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/puzzle.join")
    public void join(@Valid @Payload PuzzleSyncEnvelope event) {
        broadcast(event);
    }

    @MessageMapping("/puzzle.start")
    public void start(@Valid @Payload PuzzleSyncEnvelope event) {
        // Optional validation: only allow actorRole=grandson
        broadcast(event);
    }

    @MessageMapping("/puzzle.move")
    public void move(@Valid @Payload PuzzleSyncEnvelope event) {
        // Optional validation: only allow actorRole=grandson
        broadcast(event);
    }

    @MessageMapping("/puzzle.complete")
    public void complete(@Valid @Payload PuzzleSyncEnvelope event) {
        broadcast(event);
    }

    @MessageMapping("/puzzle.help-request")
    public void helpRequest(@Valid @Payload PuzzleSyncEnvelope event) {
        // Optional validation: only allow actorRole=grandson
        broadcast(event);
    }

    @MessageMapping("/puzzle.help-accept")
    public void helpAccept(@Valid @Payload PuzzleSyncEnvelope event) {
        // Optional validation: only allow actorRole=grandparents
        // payload example: { "acceptedBy":"grandparents", "newController":"grandparents" }
        broadcast(event);
    }

    private void broadcast(PuzzleSyncEnvelope event) {
        String topic = "/topic/puzzle/" + event.getRoomId();
        messagingTemplate.convertAndSend(topic, event);
    }
}
```

## 6. Optional: room safety and authorization (recommended)

For production:

- Validate that `puzzleId` belongs to this family/session.
- Validate actor role by authenticated user token, not by `actorRole` from frontend.
- Keep room state for `currentControllerRole`.
- Reject `MOVE` and `COMPLETE` if sender is not the current controller.
- Start with `currentControllerRole=grandson` after START.
- On HELP_ACCEPT, set `currentControllerRole=grandparents`.
- Add room timeout and cleanup if no heartbeat/activity.

## 7. CORS and security notes

If frontend runs on Vite dev server (example `http://localhost:5173`), allow that origin for both REST and WebSocket.

Example (if using Spring Security):

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
    return http.build();
}
```

For production, do not leave all endpoints public.

## 8. Integration checklist with current frontend

- Frontend STOMP endpoint defaults to: `http://192.168.1.104:8080/ws`
- Frontend sends to:
  - `/app/puzzle.join`
  - `/app/puzzle.start`
  - `/app/puzzle.move`
  - `/app/puzzle.complete`
  - `/app/puzzle.help-request`
  - `/app/puzzle.help-accept`
- Frontend subscribes to:
  - `/topic/puzzle/{roomId}`

### Optional environment variables in frontend

Set in `.env` if you need different prefixes:

```env
VITE_PUZZLE_WS_HTTP_ENDPOINT=http://192.168.1.104:8080/ws
VITE_PUZZLE_WS_APP_PREFIX=/app
VITE_PUZZLE_WS_TOPIC_PREFIX=/topic
```

## 9. End-to-end test steps

1. Start backend on `:8080`.
2. Open two browser windows:
   - Window A: choose `Grandchild` -> choose one puzzle.
   - Window B: choose `Grandparents` -> choose the same puzzle.
3. Verify B shows waiting message.
4. Click `Start Puzzle` in A.
5. Verify A and B enter same board instantly.
6. Move pieces in A:
   - Verify B updates piece positions live.
   - Verify move highlight is visible in B.
7. In A (grandchild), click `Ask Grandparent for Help`.
8. Verify B (grandparent) receives a real-time help request prompt.
9. Click `Accept and Take Control` in B.
10. Verify B can move puzzle pieces and A becomes spectator.
11. Complete puzzle in B:
   - Verify B shows "Listen Together" prompt.
   - Verify A also sees completed state and can listen to story.

## 10. Troubleshooting

- If both pages never leave waiting state:
  - Check WebSocket endpoint `/ws` is registered with SockJS.
  - Check `/topic` broker and `/app` prefix exactly match frontend config.
- If connected but no messages received:
  - Inspect browser network WS frames.
  - Confirm topic path includes the same `roomId`.
- If disconnected repeatedly:
  - Check reverse proxy websocket upgrade settings.
  - Increase heartbeat timeout and verify server resources.

## 11. Deployment Summary (Spring Boot)

1. Build package:
   - `mvn clean package -DskipTests`
2. Run locally:
   - `java -jar target/your-app.jar`
3. Production reverse proxy (Nginx) must support WebSocket upgrade for `/ws`:

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8080/ws/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

4. Open required server ports:
   - App port (for example `8080`) or proxy port (`80/443`).
5. Configure frontend `.env`:
   - `VITE_PUZZLE_WS_HTTP_ENDPOINT=http://<your-domain-or-ip>/ws`
6. Health checks before release:
   - Two-role sync works (`START`, `MOVE`, `COMPLETE`).
   - Help transfer works (`HELP_REQUEST`, `HELP_ACCEPT`).
   - Completion updates puzzle `isLocked` to `0` via REST endpoint.

---

If you want, I can also generate a complete Spring Boot starter module structure (controller + config + DTO + test) that you can paste directly into your backend project.
