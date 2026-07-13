'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Play, AlertCircle, CheckCircle, FileVideo, Tag, AlignLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { videoApi } from '@/lib/api/videos'

// ── Types ──────────────────────────────────────────────────────────────────────

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

interface VideoUploadProps {
  onUploadComplete?: (videoId: string) => void
  maxFileSize?: number // MB
  acceptedFormats?: string[]
}

const metadataSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  tags: z.string().optional(),
})

type MetadataFormData = z.infer<typeof metadataSchema>

// ── Component ──────────────────────────────────────────────────────────────────

export default function VideoUpload({
  onUploadComplete,
  maxFileSize = 500,
  acceptedFormats = ['mp4', 'mov', 'avi', 'mkv', 'webm'],
}: VideoUploadProps) {
  const router = useRouter()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [step, setStep] = useState<'select' | 'metadata' | 'uploading'>('select')
  const [pendingFile, setPendingFile] = useState<UploadFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MetadataFormData>({ resolver: zodResolver(metadataSchema) })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !acceptedFormats.includes(ext)) {
      return `Only ${acceptedFormats.join(', ')} files are supported`
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // ── File selection ─────────────────────────────────────────────────────────

  const handleFileChosen = useCallback(
    (fileList: FileList | File[]) => {
      const file = Array.from(fileList)[0]
      if (!file) return
      const error = validateFile(file)
      const uploadFile: UploadFile = { id: generateId(), file, progress: 0, status: error ? 'error' : 'pending', error: error ?? undefined }
      setPendingFile(uploadFile)
      setStep(error ? 'select' : 'metadata')
    },
    [maxFileSize, acceptedFormats]
  )

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) handleFileChosen(e.dataTransfer.files)
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFileChosen(e.target.files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Upload ─────────────────────────────────────────────────────────────────

  const startUpload = async (uploadFile: UploadFile, metadata: MetadataFormData) => {
    const updatedFile = { ...uploadFile, status: 'uploading' as const }
    setFiles([updatedFile])
    setStep('uploading')

    try {
      const formData = new FormData()
      formData.append('file', uploadFile.file)
      formData.append('title', metadata.title)
      if (metadata.description) formData.append('description', metadata.description)
      if (metadata.tags) formData.append('tags', metadata.tags)

      // Simulate progress while uploading (real XHR progress would use onUploadProgress)
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        )
      }, 300)

      const video = await videoApi.uploadVideo(formData)
      const videoId = video.id

      clearInterval(progressInterval)
      setFiles((prev) => prev.map((f) => f.id === uploadFile.id ? { ...f, progress: 100, status: 'completed' } : f))
      onUploadComplete?.(videoId)
    } catch {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
            : f
        )
      )
    }
  }

  const onMetadataSubmit = (data: MetadataFormData) => {
    if (pendingFile) startUpload(pendingFile, data)
  }

  const reset = () => {
    setFiles([]); setPendingFile(null); setStep('select')
  }

  // ── Status helpers ─────────────────────────────────────────────────────────

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-success" />
      case 'error': return <AlertCircle className="w-5 h-5 text-error" />
      case 'processing': return <Play className="w-5 h-5 text-warning animate-pulse" />
      default: return <Upload className="w-5 h-5 text-primary" />
    }
  }

  const currentFile = files[0]

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Step 1: File selector ── */}
      {step === 'select' && (
        <div
          className={cn(
            'border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer',
            isDragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-surface/30'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300',
              isDragOver ? 'bg-primary/20' : 'bg-surface'
            )}>
              <FileVideo className={cn('w-10 h-10 transition-colors duration-300', isDragOver ? 'text-primary' : 'text-text-muted')} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-1">
                {isDragOver ? 'Drop to upload' : 'Drop your video here'}
              </h3>
              <p className="text-text-secondary text-sm">or <span className="text-primary font-medium">click to browse</span></p>
            </div>
            <p className="text-xs text-text-muted">
              Supported: {acceptedFormats.join(', ').toUpperCase()} · Max {maxFileSize}MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.map((f) => `.${f}`).join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* ── Step 2: Metadata form ── */}
      {step === 'metadata' && pendingFile && (
        <div className="rounded-2xl border border-border bg-surface p-8 animate-fade-in">
          {/* Selected file preview */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-black-700 border border-border">
            <FileVideo className="w-8 h-8 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{pendingFile.file.name}</p>
              <p className="text-xs text-text-secondary">{formatFileSize(pendingFile.file.size)}</p>
            </div>
            <button onClick={reset} className="ml-auto text-text-muted hover:text-error transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onMetadataSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Title <span className="text-error">*</span>
              </label>
              <input
                {...register('title')}
                placeholder="Give your video a catchy title"
                className={cn(
                  'w-full rounded-lg border bg-black-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                  errors.title ? 'border-error' : 'border-border hover:border-border-hover'
                )}
              />
              {errors.title && <p className="mt-1.5 text-xs text-error">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                <AlignLeft className="w-3.5 h-3.5" /> Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe what your video is about..."
                className={cn(
                  'w-full rounded-lg border bg-black-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                  errors.description ? 'border-error' : 'border-border hover:border-border-hover'
                )}
              />
              {errors.description && <p className="mt-1.5 text-xs text-error">{errors.description.message}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                <Tag className="w-3.5 h-3.5" /> Tags
              </label>
              <input
                {...register('tags')}
                placeholder="nature, documentary, 4k (comma-separated)"
                className="w-full rounded-lg border border-border bg-black-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-border-hover"
              />
              <p className="mt-1 text-xs text-text-muted">Separate with commas. Tags help viewers find your content.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={reset} className="px-5 py-2.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:border-border-hover text-sm font-medium transition-all duration-200">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-all duration-200 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Upload Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Step 3: Progress ── */}
      {step === 'uploading' && currentFile && (
        <div className="rounded-2xl border border-border bg-surface p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            {getStatusIcon(currentFile.status)}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate">{currentFile.file.name}</p>
              <p className="text-xs text-text-secondary">
                {currentFile.status === 'uploading' && `Uploading… ${currentFile.progress}%`}
                {currentFile.status === 'processing' && 'Processing video — transcoding to multiple qualities…'}
                {currentFile.status === 'completed' && '✓ Upload complete!'}
                {currentFile.status === 'error' && (currentFile.error ?? 'Upload failed')}
              </p>
            </div>
          </div>

          {(currentFile.status === 'uploading' || currentFile.status === 'processing') && (
            <div className="w-full h-2 rounded-full bg-black-700 overflow-hidden mb-4">
              <div
                className={cn('h-full rounded-full transition-all duration-300', currentFile.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-primary')}
                style={{ width: currentFile.status === 'processing' ? '100%' : `${currentFile.progress}%` }}
              />
            </div>
          )}

          {currentFile.status === 'completed' && (
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => router.push('/browse')}>
                Browse Videos
              </Button>
              <Button variant="ghost" onClick={reset}>
                Upload Another
              </Button>
            </div>
          )}

          {currentFile.status === 'error' && (
            <Button variant="secondary" onClick={reset}>Try Again</Button>
          )}
        </div>
      )}
    </div>
  )
}