'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import VideoGrid from '@/components/video/VideoGrid'
import { useAuthStore } from '@/lib/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { videoApi } from '@/lib/api/videos'
import { formatRelativeTime } from '@/lib/utils'
import { Upload, Calendar } from 'lucide-react'

export default function ProfilePage() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuthStore()

    // Client-side auth guard (middleware handles server-side)
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?from=/profile')
        }
    }, [isAuthenticated, router])

    // Fetch videos for the user
    const { data } = useQuery({
        queryKey: ['videos', 'all'],
        queryFn: () => videoApi.getVideos(1, 100),
        enabled: !!user?.id
    })

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
        )
    }

    // Filter videos on the client 
    const myVideos = data?.videos.filter(v => v.creator.id === user.id) || []

    const initials = user.username.slice(0, 2).toUpperCase()

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-10 max-w-5xl">

                    {/* ── Profile card ── */}
                    <div className="glass-panel rounded-2xl p-8 mb-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white ring-4 ring-primary/20">
                                    {user.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-text-primary">@{user.username}</h1>
                                <p className="text-text-secondary mt-0.5">{user.email}</p>

                                {user.bio && (
                                    <p className="mt-3 text-text-secondary text-sm max-w-lg leading-relaxed">{user.bio}</p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-text-secondary">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Joined {formatRelativeTime(user.createdAt)}
                                    </span>
                                    <span>
                                        <span className="text-text-primary font-semibold">{myVideos.length}</span> videos
                                    </span>
                                </div>
                            </div>

                            {/* Edit button */}
                            <Link
                                href="/profile/edit"
                                className="px-5 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover text-sm font-medium transition-all duration-200 flex-shrink-0"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* ── My videos ── */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-text-primary">My Videos</h2>
                            <Link href="/upload">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Upload New
                                </button>
                            </Link>
                        </div>

                        {myVideos.length > 0 ? (
                            <VideoGrid videos={myVideos} columns={3} staggerDelay={80} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border">
                                <div className="text-5xl mb-4">🎬</div>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">No videos yet</h3>
                                <p className="text-text-secondary mb-5 text-sm">Upload your first video and start sharing with the world.</p>
                                <Link href="/upload">
                                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Upload a Video
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
