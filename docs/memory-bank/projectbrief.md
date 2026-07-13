# TessaractTV - Project Brief

TessaractTV is an industry-grade video streaming platform built to support modern, high-performance adaptive video delivery (HLS/DASH) combined with user profile management, creator dashboard analytics, and planned AI-powered enhancements.

## Core Objectives

- **High Quality Adaptive Streaming**: Real-time adaptive bitrate video streaming utilizing HLS.js, allowing high-performance play/pause, seeking, quality settings (auto vs manual resolution selection), and full keyboard shortcuts.
- **Modern & Premium User Interface**: A polished frontend designed with Next.js 14 App Router, styled with TailwindCSS, utilizing state-of-the-art animations via Framer Motion and Anime.js, matching high visual standards (dark mode, glassmorphism, glowing accents).
- **Asynchronous Video Pipeline**: Uploaded video files (MP4, MOV, etc.) are transcoded asynchronously into HLS streams (.m3u8 master playlists and .ts chunks) through FFmpeg, ensuring fast first-frame load time and minimum bandwidth consumption.
- **Creator Dashboard & User Profiles**: Creator statistics, video detail views, subscriber features, and watch history tracking.
- **AI-Powered Discovery (Future)**: Support for transcription, scene selection, semantic vector search, auto-generated thumbnails, and content safety filtering.

## Tech Stack Overview

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS
- **State Management**: Zustand, React Query (TanStack Query v5)
- **Video Playback**: HLS.js
- **Animations**: Framer Motion, Anime.js
- **Form Handling**: React Hook Form, Zod
- **Backend API target**: Node.js (monolithic Express/NestJS with Prisma/PostgreSQL or distributed microservices as planned).
