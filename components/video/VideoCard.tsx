'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import anime from 'animejs'
import { Play, Clock, Eye } from 'lucide-react'
import { cn, formatDuration, formatNumber, formatRelativeTime } from '@/lib/utils'
import { Video } from '@/types'

interface VideoCardProps {
  video: Video
  index?: number
  className?: string
}

export default function VideoCard({ video, index = 0, className }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLDivElement>(null)

  // Entrance animation with stagger
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.9, 1],
        delay: index * 50,
        duration: 600,
        easing: 'easeOutExpo'
      })
    }
  }, [index])

  // Hover animations
  const handleMouseEnter = () => {
    if (cardRef.current && playButtonRef.current) {
      anime({
        targets: cardRef.current,
        translateY: -8,
        scale: 1.02,
        duration: 300,
        easing: 'easeOutQuad'
      })
      
      anime({
        targets: playButtonRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 200
      })
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current && playButtonRef.current) {
      anime({
        targets: cardRef.current,
        translateY: 0,
        scale: 1,
        duration: 300
      })
      
      anime({
        targets: playButtonRef.current,
        opacity: 0,
        scale: 0.8,
        duration: 200
      })
    }
  }

  return (
    <Link href={`/video/${video.id}`}>
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'video-card bg-surface rounded-xl overflow-hidden cursor-pointer',
          'border border-border hover:border-border-accent transition-colors duration-300',
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-surface-elevated">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Play Overlay */}
          <div
            ref={playButtonRef}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0"
          >
            <div className="bg-primary rounded-full p-3">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>

          {/* Status Badge */}
          {video.status !== 'ready' && (
            <div className={cn(
              'absolute top-2 left-2 text-xs px-2 py-1 rounded',
              video.status === 'processing' ? 'bg-warning text-black' : 'bg-error text-white'
            )}>
              {video.status === 'processing' ? 'Processing' : 'Failed'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-surface-elevated overflow-hidden">
              {video.creator.avatar ? (
                <Image
                  src={video.creator.avatar}
                  alt={video.creator.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                  {video.creator.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-text-secondary text-sm font-medium">
              {video.creator.username}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-text-primary font-semibold text-base mb-2 line-clamp-2 leading-tight">
            {video.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-text-muted text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatNumber(video.views)} views
            </div>
            <span>•</span>
            <span>{formatRelativeTime(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}