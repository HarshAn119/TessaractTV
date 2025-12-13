'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useVideoStore } from '@/lib/store/videoStore'
import { Video } from '@/types'

interface VideoPlayerProps {
  video: Video
  className?: string
  autoPlay?: boolean
}

export default function VideoPlayer({ video, className, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousVolumeRef = useRef<number>(1)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState('auto')
  const [showSettings, setShowSettings] = useState(false)
  const [availableQualities, setAvailableQualities] = useState(['auto'])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { setCurrentVideo, setPlaybackPosition, setIsPlaying: setStoreIsPlaying } = useVideoStore()

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl || !video.hlsUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      
      hlsRef.current = hls
      hls.loadSource(video.hlsUrl)
      hls.attachMedia(videoEl)
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Get available quality levels and clean them up
        const levelHeights = [...new Set(hls.levels.map(level => level.height))]
        const qualities = ['auto', ...levelHeights.sort((a, b) => b - a).map(height => `${height}p`)]
        setAvailableQualities(qualities)
        
        if (autoPlay) {
          videoEl.play()
        }
      })

      // When video starts loading
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('Video element connected')
      })

      // When an error occurs
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log('Error:', data.type, data.details)
      })

      // When quality level changes
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log('Switched to quality:', data.level)
      })

    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = video.hlsUrl
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [video.hlsUrl, autoPlay])

  useEffect(() => {
    setCurrentVideo(video)
  }, [video, setCurrentVideo])

  const togglePlay = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (videoEl.paused) {
      videoEl.play()
    } else {
      videoEl.pause()
    }
  }

  const handleTimeUpdate = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    setCurrentTime(videoEl.currentTime)
    setPlaybackPosition(videoEl.currentTime)
  }

  const handleLoadedMetadata = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    setDuration(videoEl.duration)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoEl = videoRef.current
    const progressBar = e.currentTarget
    if (!videoEl || !progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    videoEl.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (newVolume: number) => {
    const videoEl = videoRef.current
    if (!videoEl) return

    videoEl.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    
    // Store non-zero volume for unmuting
    if (newVolume > 0) {
      previousVolumeRef.current = newVolume
    }
  }

  const toggleMute = () => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (videoEl.muted || videoEl.volume === 0) {
      videoEl.muted = false
      videoEl.volume = previousVolumeRef.current
      setIsMuted(false)
      setVolume(previousVolumeRef.current)
    } else {
      previousVolumeRef.current = videoEl.volume
      videoEl.muted = true
      setIsMuted(true)
    }
  }

  const handleQualityChange = (selectedQuality: string) => {
    const hls = hlsRef.current
    if (!hls) return

    setQuality(selectedQuality)

    if (selectedQuality === 'auto') {
      hls.currentLevel = -1 // Auto quality
    } else {
      // Extract height from quality string (e.g., '720p' -> 720)
      const targetHeight = parseInt(selectedQuality.replace('p', ''))
      
      // Find exact matching level
      const targetLevel = hls.levels.findIndex(level => level.height === targetHeight)
      
      if (targetLevel !== -1) {
        hls.currentLevel = targetLevel
      }
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime -= 10
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime += 10
          }
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        'aspect-video w-full',
        className
      )}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onPlay={() => {
          setIsPlaying(true)
          setStoreIsPlaying(true)
        }}
        onPause={() => {
          setIsPlaying(false)
          setStoreIsPlaying(false)
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          setStoreIsPlaying(false)
        }}
      />

      {/* Controls Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
          'transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {/* Play/Pause Button (Center) */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm hover:bg-black/70 transition-colors">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4 hover:h-3 transition-all"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-150"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-primary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-8 right-0 bg-surface border border-border rounded-lg p-2 min-w-32">
                    <div className="text-white text-sm font-medium mb-2">Quality</div>
                    {availableQualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          handleQualityChange(q)
                          setShowSettings(false)
                        }}
                        className={cn(
                          'block w-full text-left px-2 py-1 text-sm rounded hover:bg-surface-elevated transition-colors',
                          quality === q ? 'text-primary' : 'text-text-secondary'
                        )}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}