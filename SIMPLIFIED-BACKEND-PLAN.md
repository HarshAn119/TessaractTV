# Simplified Backend Implementation Plan

The original `BACKEND-PLAN.md` outlines a massive, enterprise-grade microservices architecture (NestJS API Gateway + 4 microservices + Python AI Service + ElasticSearch + Redis + MinIO + Kubernetes). **For a new project where we are just building out the MVP to connect to our Next.js frontend, this is massive overkill and will slow down development significantly.**

Here is a proposed **Simplified Monolithic Architecture** that perfectly supports the frontend we just built, while remaining scalable for the future.

## 1. Architecture: The Majestic Monolith
Instead of 5 separate services, we will build **one single Node.js API server**.

- **Framework**: Express.js or Fastify (Single App, optionally NestJS if preferred)
- **Database**: PostgreSQL (using Prisma ORM for type-safety with frontend)
- **Storage**: Local Disk (for MVP) transitioning to AWS S3/MinIO later
- **Video Processing**: Basic `fluent-ffmpeg` in a background queue (BullMQ + Redis)

## 2. Minimal Database Schema (Prisma)
This matches exactly what our frontend `types/index.ts` expects:

```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String   @unique
  password  String
  avatar    String?
  bio       String?
  videos    Video[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Video {
  id          String   @id @default(uuid())
  title       String
  description String?
  thumbnail   String?
  duration    Int      @default(0)
  views       Int      @default(0)
  likes       Int      @default(0)
  dislikes    Int      @default(0)
  status      String   @default("processing") // pending, processing, ready, error
  hlsUrl      String?
  tags        String[]
  creatorId   String
  creator     User     @relation(fields: [creatorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 3. Required API Endpoints & Payloads
These endpoints perfectly match the signatures defined in the frontend `lib/api/auth.ts` and `lib/api/videos.ts`.

### 3.1 Authentication (`/api/auth/*`)
All protected endpoints expect an `Authorization: Bearer <token>` header.

#### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-1234",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
    }
  }
  ```

#### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK): Same as `Register` response.

#### `GET /api/auth/me`
Fetches the currently authenticated user's profile.
- **Requires Auth**: Yes
- **Response** (200 OK):
  ```json
  {
    "id": "uuid-1234",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Video creator",
    "createdAt": "2024-03-14T12:00:00Z",
    "updatedAt": "2024-03-14T12:00:00Z"
  }
  ```

#### `POST /api/auth/refresh`
Refreshes an expired JWT.
- **Requires Auth**: Yes (or refresh token cookie)
- **Response** (200 OK):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new..."
  }
  ```

#### `POST /api/auth/logout`
Invalidates the current session (if using server-side sessions/cookies in addition to JWT).
- **Requires Auth**: Yes
- **Response** (200 OK)

---

### 3.2 Videos (`/api/videos/*`)

#### `GET /api/videos`
Fetches a paginated list of all videos (used for Browse and Search pages).
- **Query Params**:
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `q` (string, optional) - For search text
  - `category` (string, optional) - For tag filtering
- **Response** (200 OK):
  ```json
  {
    "videos": [
      {
        "id": "video-123",
        "title": "Nature Documentary",
        "thumbnail": "https://example.com/thumb.jpg",
        "duration": 1800,
        "views": 1200,
        "likes": 50,
        "dislikes": 2,
        "status": "ready",
        "createdAt": "2024-03-14T12:00:00Z",
        "creator": {
          "id": "uuid-1234",
          "username": "johndoe",
          "avatar": "https://example.com/avatar.jpg"
        }
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
  ```

#### `GET /api/videos/:id`
Fetches full details for a single video.
- **Response** (200 OK): Full `Video` object including `description`, `hlsUrl`, `tags`, and `creator` info.

#### `GET /api/videos/:id/related`
Fetches related videos for the sidebar.
- **Query Params**: `limit` (number, default: 10)
- **Response** (200 OK): Array of `Video` objects.

#### `POST /api/videos` (Upload)
Uploads a new video file and creates the database record.
- **Requires Auth**: Yes
- **Content-Type**: `multipart/form-data`
- **Payload**:
  - `file`: (Binary Video File, e.g., MP4)
  - `title`: (string)
  - `description`: (string, optional)
  - `tags`: (string, formatting e.g., "nature,documentary", optional)
- **Response** (201 Created):
  ```json
  {
    "id": "video-new-456",
    "title": "My Uploaded Video",
    "status": "pending",
    "createdAt": "2024-03-14T12:05:00Z",
    "creatorId": "uuid-1234"
  }
  ```

#### `PUT /api/videos/:id`
Updates video metadata (title, description, etc.).
- **Requires Auth**: Yes (Must be owner)
- **Request Body**: Partial Video Object
  ```json
  {
    "title": "Updated Title",
    "tags": ["new", "tags"]
  }
  ```
- **Response** (200 OK): Updated `Video` object.

#### `DELETE /api/videos/:id`
Deletes a video and its associated files.
- **Requires Auth**: Yes (Must be owner)
- **Response** (200 OK)

## 4. Simplified Video Processing Pipeline (MVP)
Instead of a complex streaming pipeline with Python AI right away:
1. User calls `POST /api/videos` with multipart form data.
2. Server saves the `.mp4` file to `/uploads/raw/video_id.mp4`.
3. Server inserts record into DB with `status = 'pending'`, and responds to user.
4. Server drops a job into a Redis-backed queue (e.g., BullMQ).
5. Background worker consumes job and uses `fluent-ffmpeg` to:
   - Extract a thumbnail to `/uploads/thumbnails/video_id.jpg`.
   - Transcode the MP4 into HLS format (e.g., 720p output) saved to `/uploads/hls/video_id/playlist.m3u8` and associated `.ts` segments.
6. DB record updated: `status = 'ready'`, `thumbnail = '/uploads/thumbnails/...'`, `hlsUrl = '/uploads/hls/...'`.

## 5. What We Cut Out (For Now)
- ❌ **Kubernetes & Microservices**: Hard to deploy, hard to debug locally.
- ❌ **ElasticSearch**: PostgreSQL `ILIKE` or full-text search is more than enough for our current search page.
- ❌ **Python AI Service**: We don't have the frontend built for this yet. We can add auto-transcription and AI thumbnails later.
- ❌ **Live Streaming (RTMP)**: Let's nail VOD (Video on Demand) first.
- ❌ **Complex Analytics Database**: We'll just increment the `views` integer on the Video table for now.
