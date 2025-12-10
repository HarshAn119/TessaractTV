export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface Video {
  id: string
  title: string
  description?: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  dislikes: number
  createdAt: string
  updatedAt: string
  creator: User
  status: 'processing' | 'ready' | 'failed'
  hlsUrl?: string
  renditions?: VideoRendition[]
}

export interface VideoRendition {
  id: string
  quality: string
  width: number
  height: number
  bitrate: number
  url: string
}

export interface Transcript {
  id: string
  videoId: string
  language: string
  segments: TranscriptSegment[]
}

export interface TranscriptSegment {
  start: number
  end: number
  text: string
}

export interface Comment {
  id: string
  videoId: string
  userId: string
  user: User
  content: string
  likes: number
  replies?: Comment[]
  createdAt: string
}

export interface WatchHistory {
  id: string
  videoId: string
  userId: string
  video: Video
  position: number
  watchedAt: string
}

export interface SearchResult {
  videos: Video[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

