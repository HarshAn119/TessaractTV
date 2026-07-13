# System Patterns & Architecture

## Repository Structure

```
├── app/                      # Next.js 14 App Router Pages
│   ├── browse/               # Categorized video browse feed
│   ├── login/                # JWT Auth Login Page
│   ├── profile/              # User Profile and Analytics
│   ├── register/             # User Registration
│   ├── search/               # Video Search Results
│   ├── test-video/           # Sandbox testing HLS streams
│   ├── upload/               # Drag & drop upload wrapper
│   ├── video/[id]/           # Video player page + related sidebar
│   ├── globals.css           # Global styles and tailwind directives
│   ├── layout.tsx            # Main layout wrapper with ErrorBoundary & React Query Provider
│   └── template.tsx          # Motion-based page transition template
├── components/               # React UI & Functional Components
│   ├── layout/               # Header, navigation
│   ├── shared/               # LoadingSpinner, ErrorBoundary
│   ├── ui/                   # Reusable elements (Button, Card, Input, Skeleton, MotionPrimitives)
│   └── video/                # VideoPlayer (Hls.js wrapper), VideoGrid, VideoCard, VideoUpload
├── lib/                      # Utilities, Hooks, API client, Stores
│   ├── animations/           # Anime.js presets
│   ├── api/                  # Axios HTTP client handlers (authApi, videoApi)
│   ├── hooks/                # Custom hooks (useAnime, useStagger, useScrollAnimation, useDebounce)
│   ├── providers/            # React Query provider wrapper
│   ├── store/                # Zustand stores (authStore, videoStore)
│   ├── constants.ts          # API Base URL, breakpoints, and hotkeys
│   ├── mockData.ts           # Initial test categories and video mock payload
│   └── utils.ts              # Timing and number formatting functions
├── types/                    # Shared TypeScript interfaces
├── middleware.ts             # Route guard middleware
└── tailwind.config.js        # Design tokens and extend patterns
```

## Architecture & Communication Flow

### 1. HTTP and API Layer
- **Base client**: Axios instance configured in `lib/api/client.ts`.
- **Authentication**: A request interceptor automatically appends the `Authorization: Bearer <token>` header from `localStorage`. A response interceptor handles `401 Unauthorized` responses by flushing credentials and redirecting to the `/login` route.
- **Base URL**: Defaults to `http://localhost:4001/api` but overridden to `http://localhost:4000/api` in `.env.local`.

### 2. State Management Strategy
- **Zustand Stores**:
  - `useAuthStore` (`lib/store/authStore.ts`): Persists authorization state, active user records, and updates tokens. Synchronizes a cookie (`auth-token`) on changes, which is read by Next.js edge middleware for SSR routing protection.
  - `useVideoStore` (`lib/store/videoStore.ts`): Governs state of active playing video, playback position tracking, volume, mute toggle, playing status, speed, and streaming quality.
- **React Query** (`@tanstack/react-query`): Wraps the page hierarchy via `QueryProvider` to handle caching, background refetching, and request states (Loading, Error, Success).

### 3. Video Playback (HLS.js Wrapper)
- Configured inside `components/video/VideoPlayer.tsx`.
- Detects browser capability via `Hls.isSupported()`. If supported, it hooks up web workers and loads the master `.m3u8` playlist asynchronously.
- Reads qualities from `hls.levels` on `MANIFEST_PARSED` and presents them to the user.
- Falls back to native Safari streaming (`canPlayType('application/vnd.apple.mpegurl')`) when HLS.js is unsupported.

### 4. Route Guarding (Middleware)
- Configured in `middleware.ts` running at edge level.
- Restricts unauthenticated access to `protectedRoutes` (`/upload`, `/profile`) by checking the `auth-token` cookie.
- Redirects logged-in users away from `authRoutes` (`/login`, `/register`) to `/browse`.
