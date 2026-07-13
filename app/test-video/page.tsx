import VideoPlayer from '@/components/video/VideoPlayer'
import VideoGrid from '@/components/video/VideoGrid'
import { Video } from '@/types'
import { mockVideos } from '@/lib/mockData'

export default function TestVideoPage() {
  const featuredVideo = mockVideos[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="heading-section text-primary mb-2">Video Components Test</h1>
          <p className="text-text-secondary">Testing HLS.js video player and grid components</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Featured Video Player</h2>
          <div className="max-w-4xl">
            <VideoPlayer 
              video={featuredVideo}
              autoPlay={false}
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Video Grid</h2>
          <VideoGrid 
            videos={mockVideos}
            columns={3}
            staggerDelay={100}
          />
        </div>
      </div>
    </div>
  )
}