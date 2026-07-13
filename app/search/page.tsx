'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import VideoGrid from '@/components/video/VideoGrid'
import { useQuery } from '@tanstack/react-query'
import { videoApi } from '@/lib/api/videos'
import { Search } from 'lucide-react'

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') ?? ''

    const { data, isLoading } = useQuery({
        queryKey: ['videos', 'search', query],
        queryFn: () => videoApi.getVideos(1, 20, query),
        enabled: !!query,
    })

    const results = data?.videos || []

    return (
        <>
            {/* Results header */}
            <div className="mb-8">
                {query ? (
                    <>
                        <h1 className="text-2xl font-bold text-text-primary mb-1">
                            Results for{' '}
                            <span className="text-primary">&ldquo;{query}&rdquo;</span>
                        </h1>
                        <p className="text-text-secondary text-sm">
                            {results.length} video{results.length !== 1 ? 's' : ''} found
                        </p>
                    </>
                ) : (
                    <h1 className="text-2xl font-bold text-text-primary">Search</h1>
                )}
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-[250px] rounded-xl bg-surface animate-pulse" />
                    ))}
                </div>
            ) : results.length > 0 ? (
                <VideoGrid videos={results as any} columns={4} staggerDelay={60} />
            ) : query ? (
                /* No results state */
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6">
                        <Search className="w-7 h-7 text-text-muted" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        No results for &ldquo;{query}&rdquo;
                    </h2>
                    <p className="text-text-secondary max-w-sm">
                        Try different keywords, or check for typos. We&apos;ll search titles, descriptions, creators, and tags.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {['nature', 'cooking', 'tech', 'music', 'travel'].map((s) => (
                            <a
                                key={s}
                                href={`/search?q=${s}`}
                                className="px-4 py-1.5 rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover text-sm transition-all duration-200"
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty query state */
                <div className="flex flex-col items-center justify-center py-28 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6">
                        <Search className="w-7 h-7 text-text-muted" />
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">Search TessaractTV</h2>
                    <p className="text-text-secondary">Type something in the search bar above to find videos.</p>
                </div>
            )}
        </>
    )
}

export default function SearchPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-10">
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center py-28">
                                <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                            </div>
                        }
                    >
                        <SearchResults />
                    </Suspense>
                </div>
            </main>
        </>
    )
}
