# Progress Roadmap

## Feature Checklists

### Phase 1: Core Video Streaming & Player
- [x] Integrate HLS.js adaptive player
- [x] Playback controls (Play, Pause, Volume, Seek, Fullscreen)
- [x] Keyboard shortcuts (Space, Arrow keys, F, M)
- [x] Manual & auto quality selection (parsing heights from levels)
- [x] Video cards and grid listings with stagger entry animations
- [x] Basic client-side related videos sidebar layout
- [ ] Save playback position to database history hook (depends on backend)

### Phase 2: Video Uploading & Processing
- [x] Drag & drop video files selector interface
- [x] Client side file verification (type constraints, size limit up to 500MB)
- [x] Metadata form input (Title, Description, Tags)
- [x] Pseudo progress indicators for uploading/processing
- [x] Delete video button on browse page — hover-revealed trash icon with animated inline confirm popover (Yes/No), React Query mutation invalidates cache on success
- [ ] Backend ingestion endpoint & raw storage (needs backend)
- [ ] FFmpeg transcoding queue (needs BullMQ, Redis, FFmpeg backend workers)

### Phase 3: Auth & User Profiles
- [x] Frontend Login/Register layout & validation (Zod, React Hook Form)
- [x] Zustand state synchronization & cookie-level headers setting
- [x] Client-side route guards (middleware protecting `/upload` and `/profile`)
- [ ] Dynamic User profile management (avatar uploads, creator details)
- [ ] Watch History and user subscription database bindings

### Phase 4: Search & Discovery
- [x] Keyword text search redirection
- [x] Categorized feed filters (Category pills dynamically constructed from video tags)
- [ ] Autocomplete searches
- [ ] AI-powered semantic search integration (CLIP / Vector DB)
- [ ] Recommender engine integration

## Current Status Summary

- **Frontend Core**: Completed and ready.
- **Backend Core**: In planning. Setup specifications written in `SIMPLIFIED-BACKEND-PLAN.md` and detailed NestJS specifications in `BACKEND-PLAN.md`.
- **Integration Status**: Ready to connect once the backend API is stood up.

## Recent Changes (Session Log)

| Change | Files Affected |
|---|---|
| Removed inline duplicate mock data in test-video page | `app/test-video/page.tsx` |
| Category pills now built from real video tags via API | `app/browse/page.tsx` |
| Delete button added to VideoCard (hover-reveal + inline confirm) | `components/video/VideoCard.tsx`, `components/video/VideoGrid.tsx`, `app/browse/page.tsx` |
