'use client'

import { useEffect } from 'react'
import { useStagger } from '@/lib/hooks/useStagger'
import { Video } from '@/types'
import VideoCard from './VideoCard'
import { cn } from '@/lib/utils'

interface VideoGridProps {
  videos: Video[]
  className?: string
  columns?: 2 | 3 | 4 | 5
  staggerDelay?: number
}

export default function VideoGrid({ 
  videos, 
  className, 
  columns = 4, 
  staggerDelay = 50 
}: VideoGridProps) {
  
  // Apply stagger animation to video cards
  useStagger('.video-card', {
    opacity: [0, 1],
    translateY: [60, 0],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutExpo'
  }, staggerDelay)

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No videos found</h3>
        <p className="text-text-secondary">Check back later for new content</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'video-grid grid gap-6',
      gridCols[columns],
      className
    )}>
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          index={index}
        />
      ))}
    </div>
  )
}