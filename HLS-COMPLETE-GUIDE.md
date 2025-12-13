# Complete HLS (HTTP Live Streaming) Guide
## Everything You Need to Know About HLS Implementation

---

## Table of Contents
1. [What is HLS?](#what-is-hls)
2. [HLS vs Regular Video Files](#hls-vs-regular-video-files)
3. [HLS File Structure](#hls-file-structure)
4. [How HLS Works](#how-hls-works)
5. [Quality Levels & Adaptive Streaming](#quality-levels--adaptive-streaming)
6. [HLS.js Integration](#hlsjs-integration)
7. [Event System](#event-system)
8. [Video Processing Pipeline](#video-processing-pipeline)
9. [Implementation Examples](#implementation-examples)
10. [Troubleshooting](#troubleshooting)

---

## What is HLS?

**HLS (HTTP Live Streaming)** is like having multiple versions of the same video file, chopped into small pieces, with a "menu" that tells the player which pieces to download.

### Key Concepts
- **Adaptive Streaming**: Automatically adjusts quality based on internet speed
- **Segmented Delivery**: Video split into 6-10 second chunks
- **Multiple Qualities**: Same video in different resolutions/bitrates
- **Progressive Download**: Downloads only what's needed

---

## HLS vs Regular Video Files

### Visual Comparison

```
📁 Regular Video (.mp4)
└── movie.mp4 (500MB - entire video in one file)
    ├── Video Track (H.264)
    ├── Audio Track (AAC)
    └── Metadata

📁 HLS Streaming (.m3u8 + .ts)
├── master.m3u8 (playlist - points to qualities)
├── 240p/
│   ├── playlist.m3u8 (240p playlist)
│   ├── segment_001.ts (10 seconds)
│   ├── segment_002.ts (10 seconds)
│   └── segment_003.ts (10 seconds)
├── 480p/
│   ├── playlist.m3u8 (480p playlist)
│   ├── segment_001.ts (10 seconds)
│   ├── segment_002.ts (10 seconds)
│   └── segment_003.ts (10 seconds)
└── 720p/
    ├── playlist.m3u8 (720p playlist)
    ├── segment_001.ts (10 seconds)
    ├── segment_002.ts (10 seconds)
    └── segment_003.ts (10 seconds)
```

### Comparison Table

| Feature | Regular MP4 | HLS (.m3u8 + .ts) |
|---------|-------------|-------------------|
| **File Structure** | One big file | Many small segments |
| **Quality Options** | Fixed quality | Multiple qualities |
| **Download Strategy** | Must download all | Downloads as needed |
| **Bandwidth Adaptation** | No adaptation | Adapts automatically |
| **Buffering** | Can buffer entire video | Minimal buffering |
| **Seeking** | Jump within file | Load different segment |
| **Storage** | 500MB for 30min video | ~1.2GB total (all qualities) |
| **User Downloads** | 500MB always | Only what they watch |
| **Start Time** | Wait for large download | Plays immediately |

---

## HLS File Structure

### Master Playlist (master.m3u8)
```m3u8
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=426x240,CODECS="avc1.42e00a,mp4a.40.2"
240p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480,CODECS="avc1.42e01e,mp4a.40.2"
480p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,CODECS="avc1.42e01f,mp4a.40.2"
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,CODECS="avc1.42e028,mp4a.40.2"
1080p/playlist.m3u8
```

### Individual Quality Playlist (720p/playlist.m3u8)
```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0

#EXTINF:10.0,
segment_001.ts
#EXTINF:10.0,
segment_002.ts
#EXTINF:10.0,
segment_003.ts
#EXTINF:9.5,
segment_004.ts
#EXT-X-ENDLIST
```

### File Breakdown
- **master.m3u8**: "Table of contents" listing all available qualities
- **BANDWIDTH**: Bitrate in bits per second (400000 = 400 Kbps)
- **RESOLUTION**: Video dimensions (width x height)
- **CODECS**: Video and audio encoding formats
- **playlist.m3u8**: Individual quality playlist with segment list
- **segment_xxx.ts**: Actual video chunks (Transport Stream format)

---

## How HLS Works

### Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   User      │    │   HLS.js     │    │   Server    │
│   Player    │    │   Library    │    │   (CDN)     │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │ 1. Load Video     │                   │
       ├──────────────────►│                   │
       │                   │ 2. GET master.m3u8│
       │                   ├──────────────────►│
       │                   │ 3. Master Playlist│
       │                   │◄──────────────────┤
       │                   │                   │
       │                   │ 4. Parse Qualities│
       │                   │ [240p,480p,720p]  │
       │                   │                   │
       │ 5. Qualities Ready│                   │
       │◄──────────────────┤                   │
       │                   │                   │
       │ 6. Start Playing  │                   │
       ├──────────────────►│                   │
       │                   │ 7. GET 480p/playlist.m3u8
       │                   ├──────────────────►│
       │                   │ 8. Segment List   │
       │                   │◄──────────────────┤
       │                   │                   │
       │                   │ 9. GET segment_001.ts
       │                   ├──────────────────►│
       │                   │ 10. Video Data    │
       │                   │◄──────────────────┤
       │                   │                   │
       │ 11. Video Plays   │                   │
       │◄──────────────────┤                   │
       │                   │                   │
       │                   │ 12. GET segment_002.ts
       │                   ├──────────────────►│ (continues...)
```

### Step-by-Step Process

1. **User clicks play** → HLS.js starts loading
2. **Download master playlist** → Gets list of available qualities
3. **Parse qualities** → Extracts resolution, bitrate info
4. **Choose initial quality** → Usually middle quality (480p)
5. **Download quality playlist** → Gets segment list for chosen quality
6. **Download first segments** → Gets first 2-3 video chunks
7. **Start playback** → Video begins playing
8. **Monitor bandwidth** → Measures download speed
9. **Adapt quality** → Switches up/down based on connection
10. **Continue downloading** → Gets segments ahead of playback

---

## Quality Levels & Adaptive Streaming

### Understanding level.height

```typescript
// HLS Level Object Structure
interface HLSLevel {
  height: number      // 720 (pixels) - THIS IS THE KEY
  width: number       // 1280 (pixels)
  bitrate: number     // 2500000 (bits per second)
  url: string         // "720p/playlist.m3u8"
  codecs: string      // "avc1.64001f,mp4a.40.2"
}

// Example levels from your stream:
hls.levels = [
  { height: 100, width: 178, bitrate: 100000 },   // 100p (very low)
  { height: 200, width: 356, bitrate: 200000 },   // 200p (low)
  { height: 350, width: 622, bitrate: 500000 },   // 350p (medium)
  { height: 750, width: 1334, bitrate: 1500000 }  // 750p (high)
]
```

### Why Height is Used for Quality

```
Video Resolution Examples:
1920x1080 (1080p) ← Height = 1080 pixels
1280x720  (720p)  ← Height = 720 pixels
854x480   (480p)  ← Height = 480 pixels
426x240   (240p)  ← Height = 240 pixels

Industry Standard:
✅ "Watch in 720p" (everyone understands)
❌ "Watch in 1280x720" (too technical)

Aspect Ratios Vary, Height Stays Consistent:
720p: 1280x720  (16:9 widescreen)
720p: 960x720   (4:3 old TV)
720p: 1440x720  (2:1 ultrawide)
→ Same height = Same quality perception
```

### Adaptive Streaming Logic

```typescript
// Automatic Quality Selection
function selectQuality(bandwidth, levels) {
  if (bandwidth > 3000000) {        // > 3 Mbps
    return levels.find(l => l.height >= 720)  // HD quality
  } else if (bandwidth > 1500000) { // > 1.5 Mbps  
    return levels.find(l => l.height >= 480)  // Standard quality
  } else {                          // < 1.5 Mbps
    return levels.find(l => l.height >= 240)  // Low quality
  }
}

// Quality Switch Process
// 1. User has slow internet (1 Mbps)
currentLevel = 240p  // { height: 240, bitrate: 400000, url: "240p/playlist.m3u8" }

// 2. Internet improves (3 Mbps)
currentLevel = 720p  // { height: 720, bitrate: 2500000, url: "720p/playlist.m3u8" }

// 3. HLS.js automatically:
// - Stops downloading 240p segments
// - Starts downloading 720p segments
// - Video quality improves seamlessly
```

### Manual Quality Selection

```typescript
// Our Implementation
const handleQualityChange = (selectedQuality: string) => {
  // Extract height: "720p" → 720
  const targetHeight = parseInt(selectedQuality.replace('p', ''))
  
  // Find matching level
  const levelIndex = hls.levels.findIndex(level => level.height === targetHeight)
  
  // Switch to that level (gets height + width + bitrate + segments)
  hls.currentLevel = levelIndex
}

// What happens when user selects "720p":
// 1. Find level with height: 720
// 2. Switch to that complete level package:
//    - Resolution: 1280x720
//    - Bitrate: 2.5 Mbps  
//    - Segments: 720p/segment_xxx.ts files
// 3. Video quality changes on next segment
```

---

## HLS.js Integration

### Basic Setup

```typescript
import Hls from 'hls.js'

// 1. Create HLS instance
const hls = new Hls({
  enableWorker: true,      // Use web worker for better performance
  lowLatencyMode: true,    // Reduce delay
  debug: false            // Disable console logs
})

// 2. Load video source
hls.loadSource('https://example.com/video.m3u8')

// 3. Attach to video element
hls.attachMedia(videoElement)

// 4. Handle events
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  console.log('Available qualities:', hls.levels)
})
```

### Complete React Implementation

```typescript
export default function VideoPlayer({ video }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [availableQualities, setAvailableQualities] = useState(['auto'])
  const [currentQuality, setCurrentQuality] = useState('auto')

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl || !video.hlsUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      
      // Load the stream
      hls.loadSource(video.hlsUrl)
      hls.attachMedia(videoEl)
      
      // When manifest is parsed, get available qualities
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levelHeights = [...new Set(hls.levels.map(level => level.height))]
        const qualities = ['auto', ...levelHeights.sort((a, b) => b - a).map(h => `${h}p`)]
        setAvailableQualities(qualities)
      })
      
      // Handle errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data)
      })
      
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      videoEl.src = video.hlsUrl
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [video.hlsUrl])

  const handleQualityChange = (quality: string) => {
    const hls = hlsRef.current
    if (!hls) return

    setCurrentQuality(quality)

    if (quality === 'auto') {
      hls.currentLevel = -1  // Auto selection
    } else {
      const targetHeight = parseInt(quality.replace('p', ''))
      const levelIndex = hls.levels.findIndex(level => level.height === targetHeight)
      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex
      }
    }
  }

  return (
    <div className="video-player">
      <video ref={videoRef} controls />
      
      {/* Quality Selector */}
      <select value={currentQuality} onChange={(e) => handleQualityChange(e.target.value)}>
        {availableQualities.map(quality => (
          <option key={quality} value={quality}>{quality}</option>
        ))}
      </select>
    </div>
  )
}
```

---

## Event System

### Understanding hls.on()

```typescript
// Event System Concept (similar to DOM events)
button.addEventListener('click', () => console.log('Clicked!'))
hls.on(Hls.Events.MANIFEST_PARSED, () => console.log('Manifest ready!'))

// Why Events Instead of Direct Calls?
// ❌ This won't work - levels not ready yet
hls.loadSource('video.m3u8')
console.log(hls.levels) // [] - Empty! Still downloading

// ✅ This works - waits for parsing to complete  
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  console.log(hls.levels) // [240p, 480p, 720p] - Ready!
})
```

### Event Timeline

```
hls.loadSource('video.m3u8')
         ↓
┌─────────────────────────────────────────────────────────────┐
│                    HLS.js Event Flow                        │
├─────────────────────────────────────────────────────────────┤
│ 1. MEDIA_ATTACHING    → Connecting to video element        │
│ 2. MEDIA_ATTACHED     → Connected successfully             │
│ 3. MANIFEST_LOADING   → Downloading master playlist        │
│ 4. MANIFEST_LOADED    → Master playlist downloaded         │
│ 5. MANIFEST_PARSED    → ✅ Levels ready, qualities known   │
│ 6. LEVEL_LOADING      → Downloading quality playlist       │
│ 7. LEVEL_LOADED       → Quality playlist ready             │
│ 8. FRAG_LOADING       → Downloading video segment          │
│ 9. FRAG_LOADED        → Video segment ready                │
│ 10. Video starts playing                                   │
└─────────────────────────────────────────────────────────────┘
```

### Common Events

```typescript
// Essential Events
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  // Master playlist parsed - qualities available
  console.log('Available qualities:', hls.levels.map(l => `${l.height}p`))
})

hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
  // Quality changed (auto or manual)
  console.log('Switched to quality:', hls.levels[data.level].height + 'p')
})

hls.on(Hls.Events.ERROR, (event, data) => {
  // Handle errors
  if (data.fatal) {
    console.error('Fatal error:', data.type, data.details)
  }
})

hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
  // Segment downloaded successfully
  console.log('Downloaded segment:', data.frag.sn)
})

// Bandwidth Monitoring
hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
  const bandwidth = hls.bandwidthEstimate
  console.log('Current bandwidth estimate:', bandwidth, 'bps')
})
```

---

## Video Processing Pipeline

### Server-Side Conversion Process

```bash
# 1. User uploads original video
user_uploads: vacation_video.mp4 (500MB, 30 minutes, 1920x1080)

# 2. Server transcoding with FFmpeg
# Create multiple quality versions
ffmpeg -i vacation_video.mp4 \
  -filter_complex \
  "[0:v]split=4[v1][v2][v3][v4]; \
   [v1]scale=426:240[v240p]; \
   [v2]scale=854:480[v480p]; \
   [v3]scale=1280:720[v720p]; \
   [v4]scale=1920:1080[v1080p]" \
  -map "[v240p]" -c:v libx264 -b:v 400k -map 0:a -c:a aac -b:a 64k \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename "240p/segment_%03d.ts" 240p/playlist.m3u8 \
  -map "[v480p]" -c:v libx264 -b:v 1000k -map 0:a -c:a aac -b:a 128k \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename "480p/segment_%03d.ts" 480p/playlist.m3u8 \
  -map "[v720p]" -c:v libx264 -b:v 2500k -map 0:a -c:a aac -b:a 128k \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename "720p/segment_%03d.ts" 720p/playlist.m3u8 \
  -map "[v1080p]" -c:v libx264 -b:v 5000k -map 0:a -c:a aac -b:a 192k \
    -hls_time 10 -hls_playlist_type vod -hls_segment_filename "1080p/segment_%03d.ts" 1080p/playlist.m3u8

# 3. Create master playlist
cat > master.m3u8 << EOF
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=426x240
240p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
EOF
```

### File Structure After Processing

```
📁 /videos/abc123/
├── 📄 master.m3u8                    # Master playlist (5KB)
├── 📁 240p/
│   ├── 📄 playlist.m3u8              # 240p playlist (2KB)
│   ├── 🎬 segment_001.ts             # 0-10s (1MB)
│   ├── 🎬 segment_002.ts             # 10-20s (1MB)
│   ├── 🎬 segment_003.ts             # 20-30s (1MB)
│   └── ... (180 segments total)      # Total: ~180MB
├── 📁 480p/
│   ├── 📄 playlist.m3u8              # 480p playlist (2KB)
│   ├── 🎬 segment_001.ts             # 0-10s (2.5MB)
│   ├── 🎬 segment_002.ts             # 10-20s (2.5MB)
│   └── ... (180 segments total)      # Total: ~450MB
├── 📁 720p/
│   ├── 📄 playlist.m3u8              # 720p playlist (2KB)
│   ├── 🎬 segment_001.ts             # 0-10s (6MB)
│   ├── 🎬 segment_002.ts             # 10-20s (6MB)
│   └── ... (180 segments total)      # Total: ~1.08GB
└── 📁 1080p/
    ├── 📄 playlist.m3u8              # 1080p playlist (2KB)
    ├── 🎬 segment_001.ts             # 0-10s (12MB)
    ├── 🎬 segment_002.ts             # 10-20s (12MB)
    └── ... (180 segments total)      # Total: ~2.16GB

💾 Total Storage: ~3.87GB (but users only download what they watch!)
```

### Database Storage

```typescript
// Video record in database
{
  id: "abc123",
  title: "Vacation Video",
  originalFile: "vacation_video.mp4",
  hlsUrl: "https://cdn.example.com/videos/abc123/master.m3u8",
  status: "ready", // processing, ready, failed
  duration: 1800,  // 30 minutes in seconds
  qualities: ["240p", "480p", "720p", "1080p"],
  createdAt: "2024-01-15T10:00:00Z"
}
```

---

## Implementation Examples

### Complete Video Player Component

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface VideoPlayerProps {
  video: {
    id: string
    title: string
    hlsUrl: string
  }
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [availableQualities, setAvailableQualities] = useState(['auto'])
  const [currentQuality, setCurrentQuality] = useState('auto')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize HLS
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
      
      // When manifest is parsed
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('📋 Manifest parsed, available levels:', hls.levels)
        
        // Extract and sort qualities
        const levelHeights = [...new Set(hls.levels.map(level => level.height))]
        const qualities = ['auto', ...levelHeights.sort((a, b) => b - a).map(h => `${h}p`)]
        setAvailableQualities(qualities)
        setIsLoading(false)
        
        console.log('🎯 Available qualities:', qualities)
      })
      
      // When quality level switches
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level]
        console.log(`🔄 Quality switched to: ${level.height}p (${level.bitrate} bps)`)
      })
      
      // Handle errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data.type, data.details)
        if (data.fatal) {
          console.error('💀 Fatal error, destroying HLS instance')
        }
      })
      
      // Monitor bandwidth
      hls.on(Hls.Events.FRAG_LOADED, () => {
        console.log('📊 Current bandwidth estimate:', hls.bandwidthEstimate, 'bps')
      })

    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      videoEl.src = video.hlsUrl
      setIsLoading(false)
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [video.hlsUrl])

  // Handle quality change
  const handleQualityChange = (selectedQuality: string) => {
    const hls = hlsRef.current
    if (!hls) return

    console.log(`🎛️ User selected quality: ${selectedQuality}`)
    setCurrentQuality(selectedQuality)

    if (selectedQuality === 'auto') {
      hls.currentLevel = -1
      console.log('🤖 Switched to auto quality selection')
    } else {
      const targetHeight = parseInt(selectedQuality.replace('p', ''))
      const levelIndex = hls.levels.findIndex(level => level.height === targetHeight)
      
      if (levelIndex !== -1) {
        hls.currentLevel = levelIndex
        console.log(`🎯 Manually switched to level ${levelIndex} (${targetHeight}p)`)
      }
    }
  }

  // Video event handlers
  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-black rounded-lg">
        <div className="text-white">Loading video...</div>
      </div>
    )
  }

  return (
    <div className="video-player bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controls
      />
      
      {/* Custom Controls */}
      <div className="p-4 bg-gray-900 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{video.title}</h3>
          
          {/* Quality Selector */}
          <select
            value={currentQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            {availableQualities.map(quality => (
              <option key={quality} value={quality}>
                {quality === 'auto' ? 'Auto' : quality}
              </option>
            ))}
          </select>
        </div>
        
        {/* Time Display */}
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  )
}
```

### Usage Example

```typescript
// In your page component
export default function VideoPage() {
  const video = {
    id: "abc123",
    title: "Sample HLS Video",
    hlsUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
  }

  return (
    <div className="container mx-auto p-4">
      <VideoPlayer video={video} />
    </div>
  )
}
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. "hls.levels is empty"
```typescript
// ❌ Problem: Accessing levels too early
hls.loadSource('video.m3u8')
console.log(hls.levels) // [] - Empty!

// ✅ Solution: Wait for MANIFEST_PARSED event
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  console.log(hls.levels) // Now populated!
})
```

#### 2. "Quality selection not working"
```typescript
// ❌ Problem: Wrong level matching
hls.currentLevel = "720p" // String won't work

// ✅ Solution: Use level index
const levelIndex = hls.levels.findIndex(level => level.height === 720)
hls.currentLevel = levelIndex
```

#### 3. "Video not playing on Safari"
```typescript
// ✅ Solution: Add Safari native HLS support
if (Hls.isSupported()) {
  // Use HLS.js
} else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
  // Safari native support
  videoEl.src = hlsUrl
}
```

#### 4. "CORS errors"
```typescript
// ✅ Solution: Configure server headers
// Server must include:
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Range
```

#### 5. "Memory leaks"
```typescript
// ✅ Solution: Always cleanup
useEffect(() => {
  const hls = new Hls()
  // ... setup
  
  return () => {
    hls.destroy() // Important!
  }
}, [])
```

### Debug Tips

```typescript
// Enable HLS.js debugging
const hls = new Hls({
  debug: true,  // Shows detailed logs
  enableWorker: false  // Disable for easier debugging
})

// Monitor all events
Object.values(Hls.Events).forEach(event => {
  hls.on(event, (eventType, data) => {
    console.log(`HLS Event: ${event}`, data)
  })
})

// Check current state
console.log('Current level:', hls.currentLevel)
console.log('Auto level:', hls.autoLevelEnabled)
console.log('Bandwidth estimate:', hls.bandwidthEstimate)
console.log('Available levels:', hls.levels)
```

---

## Performance Optimization

### Best Practices

1. **Use Web Workers**
```typescript
const hls = new Hls({
  enableWorker: true  // Offload processing to worker thread
})
```

2. **Optimize Segment Size**
```bash
# 6-10 second segments are optimal
ffmpeg -hls_time 8 -hls_playlist_type vod
```

3. **Preload Strategy**
```typescript
const hls = new Hls({
  maxBufferLength: 30,      // Buffer 30 seconds ahead
  maxMaxBufferLength: 600,  // Maximum buffer size
  lowLatencyMode: true      // Reduce delay
})
```

4. **CDN Configuration**
```
# Use CDN for global distribution
# Enable HTTP/2 for better performance
# Set proper cache headers for segments
Cache-Control: max-age=31536000  # 1 year for segments
Cache-Control: max-age=60        # 1 minute for playlists
```

---

## Conclusion

HLS is a powerful streaming technology that provides:

- ✅ **Adaptive Quality**: Automatically adjusts to user's connection
- ✅ **Fast Start**: Plays immediately without full download
- ✅ **Scalability**: Works from mobile to 4K displays
- ✅ **Reliability**: Handles network issues gracefully
- ✅ **Industry Standard**: Used by Netflix, YouTube, etc.

### Key Takeaways

1. **HLS = Playlist + Segments**: Master playlist points to quality playlists, which point to video segments
2. **Height = Quality**: Use `level.height` to identify and switch video quality
3. **Events = Timing**: Use HLS.js events to know when data is ready
4. **Adaptive = Automatic**: HLS automatically adapts to bandwidth, but users can override
5. **Segments = Smooth**: Small chunks enable smooth streaming and quick quality switches

This guide covers everything you need to implement professional HLS video streaming! 🎬✨

---

*Last updated: January 2024*
*For more questions, refer to [HLS.js documentation](https://github.com/video-dev/hls.js/)*