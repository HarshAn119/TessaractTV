'use client'

import { Video } from '@/types'
import VideoCard from './VideoCard'
import { cn } from '@/lib/utils'
import { StaggerContainer, ScaleIn } from '@/components/ui/MotionPrimitives'

interface VideoGridProps {
  videos: Video[]
  className?: string
  columns?: 2 | 3 | 4 | 5
  staggerDelay?: number // ms between each card animating in
  onDelete?: (videoId: string) => void
}

export default function VideoGrid({
  videos,
  className,
  columns = 4,
  staggerDelay = 50,
  onDelete,
}: VideoGridProps) {

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-bounce">🎬</div>
        <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
        <p className="text-zinc-500">Check back later for new content</p>
      </div>
    )
  }

  return (
    <StaggerContainer
      className={cn(
        'grid gap-6',
        gridCols[columns],
        className
      )}
      staggerChildren={staggerDelay / 1000}
    >
      {videos.map((video, index) => (
        <ScaleIn key={video.id} className="h-full">
          <VideoCard
            video={video}
            index={index}
            className="h-full"
            onDelete={onDelete}
          />
        </ScaleIn>
      ))}
    </StaggerContainer>
  )
}