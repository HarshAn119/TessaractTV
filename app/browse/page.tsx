'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import VideoGrid from '@/components/video/VideoGrid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { videoApi } from '@/lib/api/videos'
import { cn } from '@/lib/utils'

export default function BrowsePage() {
    const [activeCategory, setActiveCategory] = useState('All')
    const queryClient = useQueryClient()

    // Fetch all videos to construct unique categories/tags dynamically
    const { data: allVideosData } = useQuery({
        queryKey: ['videos', 'All'],
        queryFn: () => videoApi.getVideos(1, 100, undefined, 'All')
    })

    const { data, isLoading } = useQuery({
        queryKey: ['videos', activeCategory],
        queryFn: () => videoApi.getVideos(1, 20, undefined, activeCategory)
    })

    const filteredVideos = data?.videos || []

    const categories = ['All', ...Array.from(new Set(allVideosData?.videos?.flatMap(v => v.tags || []) || []))]

    const deleteMutation = useMutation({
        mutationFn: (id: string) => videoApi.deleteVideo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] })
        },
        onError: (err) => {
            console.error('Delete failed:', err)
            alert('Failed to delete video.')
        }
    })

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-10">
                    {/* Page header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">Browse Videos</h1>
                        <p className="text-text-secondary">
                            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                            {activeCategory !== 'All' ? ` in "${activeCategory}"` : ' available'}
                        </p>
                    </div>

                    {/* Category filter pills */}
                    <div className="flex gap-2 flex-wrap mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                                    activeCategory === cat
                                        ? 'bg-primary text-white shadow-glow'
                                        : 'bg-surface border border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Video grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-[250px] rounded-xl bg-surface animate-pulse" />
                            ))}
                        </div>
                    ) : filteredVideos.length > 0 ? (
                        <VideoGrid 
                            videos={filteredVideos as any} 
                            columns={4} 
                            staggerDelay={80} 
                            onDelete={(id) => deleteMutation.mutate(id)} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="text-5xl mb-4">🎬</div>
                            <h3 className="text-xl font-semibold text-text-primary mb-2">No videos found</h3>
                            <p className="text-text-secondary">
                                Try a different category or{' '}
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
                                >
                                    browse everything
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
