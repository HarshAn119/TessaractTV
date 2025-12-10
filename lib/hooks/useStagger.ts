import { useEffect } from 'react'
import anime from 'animejs'

interface UseStaggerOptions {
  selector: string
  animationConfig: anime.AnimeParams
  staggerDelay?: number
  staggerGrid?: [number, number]
  staggerFrom?: 'first' | 'last' | 'center' | number
  enabled?: boolean
}

/**
 * Custom hook for stagger animations (perfect for grids and lists)
 */
export function useStagger({
  selector,
  animationConfig,
  staggerDelay = 50,
  staggerGrid,
  staggerFrom = 'center',
  enabled = true,
}: UseStaggerOptions) {
  useEffect(() => {
    if (!enabled) return

    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    const staggerConfig = staggerGrid
      ? anime.stagger(staggerDelay, { grid: staggerGrid, from: staggerFrom })
      : anime.stagger(staggerDelay, { from: staggerFrom })

    const anim = anime({
      targets: selector,
      delay: staggerConfig,
      ...animationConfig,
    })

    return () => {
      anim.pause()
    }
  }, [selector, staggerDelay, enabled])
}

