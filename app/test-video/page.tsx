import VideoPlayer from '@/components/video/VideoPlayer'
import VideoGrid from '@/components/video/VideoGrid'
import { Video } from '@/types'

// Mock data for testing
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Amazing Nature Documentary - Wildlife in 4K',
    description: 'Explore the beauty of nature in stunning 4K resolution',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
    duration: 1800,
    views: 125000,
    likes: 5200,
    dislikes: 120,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    creator: {
      id: 'creator1',
      username: 'NatureFilms',
      email: 'nature@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'ready',
    hlsUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
  },
  {
    id: '2',
    title: 'Tech Review: Latest Smartphone Features',
    description: 'Comprehensive review of the newest smartphone technology',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=450&fit=crop',
    duration: 900,
    views: 89000,
    likes: 3400,
    dislikes: 89,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    creator: {
      id: 'creator2',
      username: 'TechReviewer',
      email: 'tech@example.com',
      createdAt: '2023-06-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'ready'
  },
  {
    id: '3',
    title: 'Cooking Masterclass: Italian Pasta',
    description: 'Learn to make authentic Italian pasta from scratch',
    thumbnail: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=450&fit=crop',
    duration: 2400,
    views: 67000,
    likes: 2800,
    dislikes: 45,
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
    creator: {
      id: 'creator3',
      username: 'ChefMario',
      email: 'chef@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'ready'
  },
  {
    id: '4',
    title: 'Music Production Tutorial',
    description: 'Create beats and melodies using modern software',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop',
    duration: 1200,
    views: 45000,
    likes: 1900,
    dislikes: 32,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    creator: {
      id: 'creator4',
      username: 'BeatMaker',
      email: 'music@example.com',
      createdAt: '2023-08-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'processing'
  }
]

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