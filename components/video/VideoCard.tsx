'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Trash2 } from 'lucide-react'
import { cn, formatDuration, formatNumber, formatRelativeTime } from '@/lib/utils'
import { Video } from '@/types'
import { useState } from 'react'

interface VideoCardProps {
  video: Video
  index?: number
  className?: string
  onDelete?: (videoId: string) => void
}

export default function VideoCard({ video, index = 0, className, onDelete }: VideoCardProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className={cn('group relative flex flex-col gap-3 h-full', className)}>
      {/* Clickable link — covers the whole card */}
      <Link href={`/video/${video.id}`} className="block h-full">
        <motion.div
          className="flex flex-col gap-3 h-full"
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 ring-1 ring-white/5 shadow-2xl">
            {/* Image Scale Wrapper */}
            <motion.div
              className="absolute inset-0"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 }
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Overlay - Cinematic Fade */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 }
              }}
            />

            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium font-mono">
              {formatDuration(video.duration)}
            </div>

            {/* Status Badge */}
            {video.status !== 'ready' && (
              <div className={cn(
                'absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg',
                video.status === 'processing' ? 'bg-amber-500/90 text-black' : 'bg-red-500/90 text-white'
              )}>
                {video.status === 'processing' ? 'Processing' : 'Failed'}
              </div>
            )}

            {/* Play Icon - Spotlight Reveal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                variants={{
                  rest: { scale: 0.5, opacity: 0, y: 10 },
                  hover: { scale: 1, opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20 shadow-glow">
                  <Play className="w-6 h-6 text-white ml-1 fill-white" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-3 px-1">
            {/* Avatar */}
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-white/10 shadow-lg">
                {video.creator.avatar ? (
                  <Image
                    src={video.creator.avatar}
                    alt={video.creator.username}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold bg-zinc-900">
                    {video.creator.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              {/* Title */}
              <h3 className="text-zinc-100 font-medium text-[15px] leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {video.title}
              </h3>

              {/* Subtext */}
              <div className="flex flex-col mt-1 text-xs text-zinc-500 font-medium">
                <span className="hover:text-zinc-300 transition-colors">{video.creator.username}</span>
                <div className="flex items-center gap-1 mt-0.5 opacity-80">
                  <span>{formatNumber(video.views)} views</span>
                  <span className="text-[8px]">•</span>
                  <span>{formatRelativeTime(video.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Delete button — outside Link to avoid navigation on click */}
      {onDelete && (
        <div className="absolute top-2 right-2 z-20">
          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.85, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-white/10 shadow-elevation-3"
              >
                <span className="text-[11px] text-zinc-300 font-medium whitespace-nowrap">Delete?</span>
                <button
                  onClick={() => { onDelete(video.id); setConfirming(false) }}
                  className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-semibold hover:bg-red-400 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 text-[11px] font-semibold hover:bg-white/20 transition-colors"
                >
                  No
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="trash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0 }}
                className="p-2 rounded-full bg-black/60 hover:bg-red-600 backdrop-blur-md border border-white/10 text-white transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                onClick={() => setConfirming(true)}
                title="Delete video"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}