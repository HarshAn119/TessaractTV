import { create } from 'zustand'
import { Video } from '@/types'

interface VideoState {
  currentVideo: Video | null
  playbackPosition: number
  playbackSpeed: number
  quality: string
  isPlaying: boolean
  volume: number
  muted: boolean
  setCurrentVideo: (video: Video | null) => void
  setPlaybackPosition: (position: number) => void
  setPlaybackSpeed: (speed: number) => void
  setQuality: (quality: string) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  playbackPosition: 0,
  playbackSpeed: 1,
  quality: 'auto',
  isPlaying: false,
  volume: 1,
  muted: false,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setPlaybackPosition: (position) => set({ playbackPosition: position }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setQuality: (quality) => set({ quality }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
}))

