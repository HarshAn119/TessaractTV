import { useEffect } from 'react'
import anime, { AnimeParams } from 'animejs'

/**
 * Hook for stagger animations on multiple elements
 */
export function useStagger(
  selector: string,
  animationConfig: AnimeParams,
  staggerDelay: number = 50,
  grid?: [number, number],
  from: 'first' | 'last' | 'center' | number = 'center'
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    const delay = grid 
      ? anime.stagger(staggerDelay, { grid, from })
      : anime.stagger(staggerDelay, { from })

    const animation = anime({
      targets: selector,
      delay,
      ...animationConfig
    })

    return () => {
      animation.pause()
    }
  }, [selector, staggerDelay, grid, from])
}