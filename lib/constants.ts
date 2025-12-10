export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:9000'

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const VIDEO_QUALITIES = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
  { label: '480p', value: '480p' },
  { label: '360p', value: '360p' },
] as const

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const

export const KEYBOARD_SHORTCUTS = {
  playPause: ' ',
  mute: 'm',
  fullscreen: 'f',
  theater: 't',
  skipForward: 'ArrowRight',
  skipBackward: 'ArrowLeft',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
} as const

