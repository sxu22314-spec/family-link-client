# StoryTime Backend + MySQL Guide (tb_story)1

This guide matches the current frontend `StoryTime.tsx` implementation and is ready for direct use.

## 1. Frontend contract (already implemented)

`StoryTime` now calls:

1. `GET /story/getByPuzzleId/{puzzleId}`
2. `POST /story/incrementListenCount/{storyId}` (best effort, optional)

Base URL is controlled by:

```env
VITE_STORY_API_BASE_URL=http://192.168.1.104:8080/story
```

## 2. Required MySQL table: `tb_story`

Use this SQL directly:

```sql
CREATE TABLE IF NOT EXISTS tb_story (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  puzzle_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(255),
  audio_url VARCHAR(1024),
  cover_image_url VARCHAR(1024),
  listen_count INT NOT NULL DEFAULT 0,
  is_locked TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tb_story_puzzle_id (puzzle_id)
);
```

Optional seed data:

```sql
INSERT INTO tb_story (
  puzzle_id, title, description, subject, audio_url, cover_image_url, listen_count, is_locked
) VALUES
(1, 'Grandma\'s Garden', 'A warm story about flowers and family.', 'Grandma\'s garden', 'https://example.com/audio/garden.mp3', 'https://example.com/image/garden.jpg', 12, 0),
(2, 'Uncle Tom\'s Workshop', 'A memory about craft and patience.', 'Uncle Tom', 'https://example.com/audio/workshop.mp3', 'https://example.com/image/workshop.jpg', 5, 0);
```

## 3. Spring Boot dependencies

`pom.xml`:

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  <dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>
```

## 4. Application config

`application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://192.168.1.104:3306/family_link?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

## 5. API response wrapper

Frontend accepts both plain object and wrapped object, but recommend unified wrapper:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private Integer code; // 0 success
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(0, "success", data);
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(1, message, null);
    }
}
```

## 6. Entity + Mapper + Service + Controller

### 6.1 Entity

```java
@Data
public class StoryEntity {
    private Long id;
    private Long puzzleId;
    private String title;
    private String description;
    private String subject;
    private String audioUrl;
    private String coverImageUrl;
    private Integer listenCount;
    private Integer isLocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 6.2 Mapper

```java
@Mapper
public interface StoryMapper {

    @Select("""
        SELECT id, puzzle_id, title, description, subject,
               audio_url, cover_image_url, listen_count, is_locked,
               created_at, updated_at
        FROM tb_story
        WHERE puzzle_id = #{puzzleId}
        ORDER BY id DESC
        LIMIT 1
    """)
    StoryEntity findLatestByPuzzleId(@Param("puzzleId") Long puzzleId);

    @Update("UPDATE tb_story SET listen_count = listen_count + 1 WHERE id = #{storyId}")
    int incrementListenCount(@Param("storyId") Long storyId);
}
```

### 6.3 Service

```java
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryMapper storyMapper;

    public StoryEntity getByPuzzleId(Long puzzleId) {
        return storyMapper.findLatestByPuzzleId(puzzleId);
    }

    public void incrementListenCount(Long storyId) {
        storyMapper.incrementListenCount(storyId);
    }
}
```

### 6.4 Controller

```java
@RestController
@RequestMapping("/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping("/getByPuzzleId/{puzzleId}")
    public ApiResponse<StoryEntity> getByPuzzleId(@PathVariable Long puzzleId) {
        StoryEntity story = storyService.getByPuzzleId(puzzleId);
        if (story == null) {
            return ApiResponse.fail("No story found for puzzleId=" + puzzleId);
        }
        return ApiResponse.ok(story);
    }

    @PostMapping("/incrementListenCount/{storyId}")
    public ApiResponse<Boolean> incrementListenCount(@PathVariable Long storyId) {
        storyService.incrementListenCount(storyId);
        return ApiResponse.ok(true);
    }
}
```

## 7. CORS configuration

If frontend is Vite dev server (example: `http://localhost:5173`):

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

## 8. End-to-end test flow

1. Ensure puzzle is completed and frontend navigates to `/story/{character}/{puzzleId}`.
2. Frontend calls `GET /story/getByPuzzleId/{puzzleId}`.
3. Backend returns row from `tb_story` with `code=0`.
4. Story page renders:
   - title
   - description
   - subject
   - cover image
   - audio playback URL
   - listen count
   - created date
5. On first play click, frontend calls `POST /story/incrementListenCount/{storyId}`.

## 9. Deployment steps

1. Create database and table:
   - Run SQL in section 2.
2. Configure datasource in `application.yml`.
3. Package and run backend:

```bash
mvn clean package -DskipTests
java -jar target/your-app.jar
```

4. Set frontend env and restart frontend:

```env
VITE_STORY_API_BASE_URL=http://<backend-host>:8080/story
```

5. Verify with browser/network panel:
   - `GET /story/getByPuzzleId/{puzzleId}` returns `code=0`
   - story fields show correctly
   - `POST /story/incrementListenCount/{storyId}` is sent when playing

## 10. Notes for compatibility

Frontend currently supports both camelCase and snake_case response fields:

- `audioUrl` or `audio_url`
- `coverImageUrl` or `cover_image_url`
- `listenCount` or `listen_count`
- `createdAt` or `created_at`

So your backend can keep snake_case DB naming while returning either style.


