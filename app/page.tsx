'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Zap, Brain, Users, Shield } from 'lucide-react'
import Header from '@/components/layout/Header'
import VideoCard from '@/components/video/VideoCard'
import { useQuery } from '@tanstack/react-query'
import { videoApi } from '@/lib/api/videos'
import { formatNumber } from '@/lib/utils'

// ── Stats ──────────────────────────────────────────────────────────────────────
const stats = [
  { value: '10M+', label: 'Videos watched' },
  { value: '500K+', label: 'Creators' },
  { value: '4K', label: 'Max quality' },
  { value: '99.9%', label: 'Uptime' },
]

// ── Features ───────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    title: 'Adaptive Streaming',
    description: 'HLS-powered delivery adjusts quality in real-time based on your connection. Never buffer again.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Brain,
    title: 'AI-Powered Search',
    description: 'Find exactly what you want with semantic search. Describe a scene in natural language and we\'ll find it.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Users,
    title: 'Creator Tools',
    description: 'Upload, transcode and distribute your content worldwide with one click. Full analytics included.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays yours. No tracking across the web, no selling to advertisers. Ever.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
]

// ── Stagger animation variants ────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['videos', 'featured'],
    queryFn: () => videoApi.getVideos(1, 4)
  })

  const featuredVideos = data?.videos || []

  return (
    <>
      <Header />
      <main className="bg-black-900 text-text-primary overflow-hidden">

        {/* ─────────────────────── HERO ─────────────────────── */}
        <section className="relative min-h-[90vh] flex items-center">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[100px]" />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          </div>

          <div className="container mx-auto px-4 py-28 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              animate="show"
              variants={container}
            >
              {/* Badge */}
              <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Now streaming in 4K · HLS adaptive bitrate
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={item}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.05]"
              >
                Video streaming
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light via-primary to-violet-500">
                  built differently.
                </span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                variants={item}
                className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                A premium platform for creators and viewers. Upload once, stream everywhere — with
                AI-powered discovery and adaptive quality built in from the ground up.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
                <Link href="/browse">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-glow"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start Watching
                  </motion.button>
                </Link>
                <Link href="/upload">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-text-primary font-semibold text-sm hover:border-border-hover hover:bg-surface transition-all"
                  >
                    Upload a Video
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={item}
                className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border"
              >
                {stats.map((s) => (
                  <div key={s.label} className="bg-black-800 px-6 py-5 text-center">
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────── TRENDING VIDEOS ─────────────────── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Trending Now</p>
                <h2 className="text-3xl font-bold text-white tracking-tight">Popular this week</h2>
              </div>
              <Link
                href="/browse"
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary transition-colors font-medium"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={container}
            >
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={i} className="h-[250px] rounded-xl bg-black-800 animate-pulse border border-border" />
                ))
              ) : featuredVideos.length > 0 ? (
                featuredVideos.map((video) => (
                  <motion.div key={video.id} variants={item}>
                    <VideoCard video={video as any} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-text-secondary">
                  No popular videos available yet.
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ─────────────────── FEATURES ─────────────────── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Why TessaractTV</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Built for speed, quality, and discovery
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={container}
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={item}
                  className="rounded-2xl border border-border bg-black-800 p-6 hover:border-border-hover transition-colors duration-300 group"
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─────────────────── CTA BANNER ─────────────────── */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <motion.div
              className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-black-800 to-violet-500/10 p-12 text-center overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Background blobs */}
              <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Ready to share your story?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                  Join thousands of creators already uploading to TessaractTV. Free to start,
                  powerful at scale.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-glow"
                    >
                      Create free account
                    </motion.button>
                  </Link>
                  <Link href="/browse">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 rounded-xl border border-white/10 text-white font-semibold text-sm hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                      Explore videos
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────── FOOTER ─────────────────── */}
        <footer className="border-t border-border py-10">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-primary" />
              <span className="font-semibold text-zinc-400">TessaractTV</span>
            </div>
            <p>© 2025 TessaractTV. Built with Next.js &amp; HLS.js.</p>
            <div className="flex gap-5">
              <Link href="/browse" className="hover:text-zinc-400 transition-colors">Browse</Link>
              <Link href="/upload" className="hover:text-zinc-400 transition-colors">Upload</Link>
              <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign in</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
