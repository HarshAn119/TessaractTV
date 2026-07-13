# Product Context

TessaractTV is designed for both video viewers looking for a premium, buffer-free viewing experience, and video creators looking for a seamless path to upload, publish, and monitor their videos.

## Core User Flows

### 1. Viewers (Discovery & Playback)
- **Home & Browse Pages**: Discover trending and categorized videos using responsive grids with smooth stagger animations.
- **Search**: Perform keywords-based search (and in the future, semantic natural language search) to find specific video titles or scenes.
- **Playback**: Play videos using HLS adaptive bitrate streaming. The player adapts quality automatically based on connection speeds but allows manual override (e.g., locking 720p or 1080p). Features keyboard shortcuts (Space for Play/Pause, Left/Right Arrows to Seek, M to Mute, F for Fullscreen).
- **Social & Personalization**: Subscribe to channels, view related videos in the sidebar, like/dislike, track watch history, and continue watching from where they left off.

### 2. Creators (Upload & Analytics)
- **Video Upload**: Simple drag-and-drop file upload with validation (checks for file size up to 500MB and supported formats like MP4/MOV/AVI/MKV/WEBM).
- **Metadata Management**: Edit title, description, and comma-separated tags.
- **Processing States**: View uploading progress in real time. The platform tracks transcoding status (Pending, Processing, Ready, Error) as the video gets processed into multiple qualities.
- **Creator Dashboard**: Inspect views, watch time, subscriber count, and video analytics.

## Design Goals

- **Dark Mode & Aesthetics**: Implements a premium, dark layout utilizing deep blacks (`#050505`, `#0A0A0A`), refined greys, and electric indigo highlights (`#6366F1`).
- **Glassmorphism**: Elegant card styling with glass-like filters (`backdrop-blur-xl`, subtle translucent borders).
- **Interactions & Feedback**: Shimmer skeleton loaders, micro-interaction transitions on buttons/avatars, and stagger page entry animations.
