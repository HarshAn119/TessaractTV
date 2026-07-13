'use client'

import Header from '@/components/layout/Header'
import VideoUpload from '@/components/video/VideoUpload'

export default function UploadPage() {
  const handleUploadComplete = (videoId: string) => {
    console.log('Upload completed for video:', videoId)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="heading-hero mb-6 text-primary">
              Upload Your Videos
            </h1>
            <p className="text-body-xl text-text-secondary max-w-2xl mx-auto">
              Share your content with the world. Upload high-quality videos and reach your audience.
            </p>
          </div>

          <VideoUpload
            onUploadComplete={handleUploadComplete}
            maxFileSize={500}
            acceptedFormats={['mp4', 'mov', 'avi', 'mkv', 'webm']}
          />

          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Upload Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-primary mb-3">📹 Video Quality</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• Recommended: 1080p (1920x1080) or higher</li>
                  <li>• Frame rate: 24, 30, or 60 FPS</li>
                  <li>• Bitrate: 8-12 Mbps for 1080p</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-secondary mb-3">🎵 Audio Quality</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• Format: AAC or MP3</li>
                  <li>• Sample rate: 48 kHz</li>
                  <li>• Bitrate: 128-320 kbps</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-accent mb-3">⚡ Processing</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• Videos are automatically transcoded</li>
                  <li>• Multiple qualities generated (240p-1080p)</li>
                  <li>• Processing time: ~1-5 minutes per video</li>
                </ul>
              </div>
              
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-gold mb-3">📏 File Limits</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• Max file size: 500MB</li>
                  <li>• Max duration: 2 hours</li>
                  <li>• Supported: MP4, MOV, AVI, MKV, WebM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}