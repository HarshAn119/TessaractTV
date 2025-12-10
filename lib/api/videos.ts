import apiClient from './client'
import { Video, SearchResult } from '@/types'

export const videoApi = {
  /**
   * Get all videos with pagination
   */
  getVideos: async (page: number = 1, limit: number = 20): Promise<SearchResult> => {
    const response = await apiClient.get('/videos', {
      params: { page, limit },
    })
    return response.data
  },

  /**
   * Get a single video by ID
   */
  getVideo: async (id: string): Promise<Video> => {
    const response = await apiClient.get(`/videos/${id}`)
    return response.data
  },

  /**
   * Get related videos
   */
  getRelatedVideos: async (id: string, limit: number = 10): Promise<Video[]> => {
    const response = await apiClient.get(`/videos/${id}/related`, {
      params: { limit },
    })
    return response.data
  },

  /**
   * Upload a new video
   */
  uploadVideo: async (formData: FormData): Promise<Video> => {
    const response = await apiClient.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * Update video metadata
   */
  updateVideo: async (id: string, data: Partial<Video>): Promise<Video> => {
    const response = await apiClient.put(`/videos/${id}`, data)
    return response.data
  },

  /**
   * Delete a video
   */
  deleteVideo: async (id: string): Promise<void> => {
    await apiClient.delete(`/videos/${id}`)
  },
}

