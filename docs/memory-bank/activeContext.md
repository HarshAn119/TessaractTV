# Active Context

## Current State

The frontend for **TessaractTV** has been fully structured with Next.js 14, React 18, and TailwindCSS. The UI contains complete logic for:
1. **Adaptive HLS Video Playback**: Fully functional playback controls, custom seekbars, volume adjustments, fullscreen, quality level switching (mapping indices from HLS playlist resolutions), and keyboard shortcut listeners.
2. **Video Upload Form**: Drag & drop interface checking size limits, collecting title/description/tags metadata, and displaying mockup processing/upload indicators.
3. **Authentication Flows**: Interactive login and registration forms interacting with the backend API layer. State persists using Zustand combined with Next.js middleware checking cookies.
4. **Browse & Discovery Grid**: Dynamic pill filters built by extracting unique tags from actual uploaded video payloads, with smooth stagger page animations.

## Current Setup & Configuration
- **API URL**: Configured to point to `http://localhost:4000/api` inside `.env.local`.
- **Target Backend Server**: The project is structured to connect to a backend server. A simplified monolithic Node.js backend (using Express/NestJS, BullMQ, Redis, Prisma, and fluent-ffmpeg) is designed in `SIMPLIFIED-BACKEND-PLAN.md` to transcode uploaded videos into HLS.
- **Mock Data Sandbox**: `app/test-video` provides a sandbox to test actual HLS streams (using a Tears of Steel demo URL from unified-streaming).

## Active Focus

- **Dynamic Data Integrations**: The sandbox page has been cleaned of redundant local mock data definitions in favor of the centralized `lib/mockData.ts` exports, and the Browse category pills dynamically pull from actual video tags.
- **Future Backend Connection**: Next steps involve initializing the Node.js/Prisma backend server as defined in `SIMPLIFIED-BACKEND-PLAN.md` to run on port 4000 and handle actual user registration, login, uploads, and transcoding workflows.
