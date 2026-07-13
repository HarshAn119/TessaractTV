'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ThumbsUp, ThumbsDown, Share2, Eye, Calendar } from 'lucide-react'
import Header from '@/components/layout/Header'
import VideoPlayer from '@/components/video/VideoPlayer'
import VideoCard from '@/components/video/VideoCard'
import { useQuery } from '@tanstack/react-query'
import { videoApi } from '@/lib/api/videos'
import { formatNumber, formatRelativeTime, formatDuration } from '@/lib/utils'

interface VideoPageProps {
    params: { id: string }
}

export default function VideoPage({ params }: VideoPageProps) {
    const { data: video, isLoading, isError } = useQuery({
        queryKey: ['video', params.id],
        queryFn: () => videoApi.getVideo(params.id),
        retry: 1
    })

    const { data: relatedVideos = [] } = useQuery({
        queryKey: ['relatedVideos', params.id],
        queryFn: () => videoApi.getRelatedVideos(params.id),
        enabled: !!video
    })

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-background flex justify-center items-center">
                    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
            </>
        )
    }

    if (isError || !video) {
        notFound()
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* ─── Left column: player + metadata ─── */}
                        <div className="flex-1 min-w-0">
                            {/* Player */}
                            <div className="w-full rounded-xl overflow-hidden bg-black shadow-elevation-3">
                                <VideoPlayer video={video as any} autoPlay={false} />
                            </div>

                            {/* Title */}
                            <h1 className="mt-5 text-xl font-bold text-text-primary leading-snug">{video.title}</h1>

                            {/* Meta row */}
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        {formatNumber(video.views)} views
                                    </span>
                                    <span className="text-border">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {formatRelativeTime(video.createdAt)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-all duration-200 text-sm font-medium">
                                        <ThumbsUp className="w-4 h-4" />
                                        {formatNumber(video.likes)}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-all duration-200 text-sm font-medium">
                                        <ThumbsDown className="w-4 h-4" />
                                        {formatNumber(video.dislikes)}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary transition-all duration-200 text-sm font-medium">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>

                            <div className="my-4 border-t border-border" />

                            {/* Creator card */}
                            <div className="flex items-center justify-between">
                                <Link href={`/profile/${video.creator.id}`} className="flex items-center gap-3 group">
                                    <div className="w-11 h-11 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-white/10 flex-shrink-0">
                                        {video.creator.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={video.creator.avatar}
                                                alt={video.creator.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-bold bg-zinc-900">
                                                {video.creator.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                                            @{video.creator.username}
                                        </p>
                                        {video.creator.bio && (
                                            <p className="text-xs text-text-secondary line-clamp-1">{video.creator.bio}</p>
                                        )}
                                    </div>
                                </Link>

                                <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                                    Subscribe
                                </button>
                            </div>

                            <div className="my-4 border-t border-border" />

                            {/* Description */}
                            {video.description && (
                                <div className="rounded-xl bg-surface p-4">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        <span className="font-mono">{formatDuration(video.duration)}</span>
                                        <span>•</span>
                                        <span>Description</span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed">{video.description}</p>

                                    {/* Tags */}
                                    {video.tags && video.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {video.tags.map((tag) => (
                                                <Link
                                                    key={tag}
                                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                                    className="text-xs text-primary hover:text-primary-light transition-colors"
                                                >
                                                    #{tag}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ─── Right column: related videos ─── */}
                        <aside className="xl:w-96 flex-shrink-0">
                            <h2 className="text-base font-semibold text-text-primary mb-4">Up next</h2>
                            <div className="flex flex-col gap-3">
                                {relatedVideos.map((related) => (
                                    <Link key={related.id} href={`/video/${related.id}`} className="flex gap-3 group">
                                        {/* Thumbnail */}
                                        <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-900">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={related.thumbnail}
                                                alt={related.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                                                {formatDuration(related.duration)}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col min-w-0 pt-0.5">
                                            <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                                                {related.title}
                                            </p>
                                            <p className="text-xs text-text-secondary mt-1">{related.creator.username}</p>
                                            <p className="text-xs text-text-secondary mt-0.5 opacity-70">
                                                {formatNumber(related.views)} views • {formatRelativeTime(related.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    )
}
