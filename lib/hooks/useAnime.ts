import { useEffect, useRef } from 'react'
import anime, { AnimeInstance } from 'animejs'

interface UseAnimeOptions {
  targets?: string | HTMLElement | HTMLElement[] | null
  animationConfig: anime.AnimeParams
  deps?: any[]
  enabled?: boolean
}

/**
 * Custom hook for Anime.js animations
 */
export function useAnime({
  targets,
  animationConfig,
  deps = [],
  enabled = true,
}: UseAnimeOptions) {
  const targetRef = useRef<HTMLElement>(null)
  const animationRef = useRef<AnimeInstance | null>(null)

  useEffect(() => {
    if (!enabled) return

    const target = targets || targetRef.current
    if (!target) return

    const anim = anime({
      targets: target,
      ...animationConfig,
    })

    animationRef.current = anim

    return () => {
      if (animationRef.current) {
        animationRef.current.pause()
      }
    }
  }, [targets, enabled, ...deps])

  return { ref: targetRef, animation: animationRef.current }
}

/**
 * Simple useAnime hook for element refs
 */
export function useAnimeRef(animationConfig: anime.AnimeParams, deps: any[] = []) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const anim = anime({
      targets: ref.current,
      ...animationConfig,
    })

    return () => {
      anim.pause()
    }
  }, [ref.current, ...deps])

  return ref
}

