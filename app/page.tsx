import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="heading-hero mb-6 animate-fade-in">
              Discover Amazing Videos
            </h1>
            <p className="text-body-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Welcome to your premium video streaming platform. Experience content like never before.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" className="rounded-none">
                Get Started
              </Button>
              <Button variant="secondary" size="lg" className="rounded-none">
                Browse Videos
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card variant="premium" className="text-center">
              <div className="h-12 w-12 mx-auto mb-4 rounded-none   bg-primary flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-h4 font-semibold mb-2 text-primary">Premium Content</h3>
              <p className="text-body text-text-secondary">
                Access to high-quality videos with crystal clear streaming
              </p>
            </Card>

            <Card variant="premium" className="text-center">
              <div className="h-12 w-12 mx-auto mb-4 rounded-none bg-secondary flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-h4 font-semibold mb-2 text-secondary">Lightning Fast</h3>
              <p className="text-body text-text-secondary">
                Optimized streaming with adaptive bitrate technology
              </p>
            </Card>

            <Card variant="premium" className="text-center">
              <div className="h-12 w-12 mx-auto mb-4 rounded-none bg-accent flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-h4 font-semibold mb-2 text-accent">AI Powered</h3>
              <p className="text-body text-text-secondary">
                Smart recommendations and semantic search
              </p>
            </Card>
          </div>

          {/* Glass Card Example */}
          <Card variant="glass" className="max-w-2xl mx-auto">
            <h2 className="heading-section mb-4">Experience the Future</h2>
            <p className="text-body-lg text-text-secondary">
              Our platform combines cutting-edge technology with a beautiful, intuitive interface.
              Every interaction is designed to feel premium and delightful.
            </p>
          </Card>
        </div>
      </main>
    </>
  )
}

