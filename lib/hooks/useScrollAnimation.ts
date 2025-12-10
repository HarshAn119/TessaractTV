import { useEffect, useRef } from 'react'
import anime from 'animejs'

interface UseScrollAnimationOptions {
  animationConfig: anime.AnimeParams
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  enabled?: boolean
}

/**
 * Custom hook for scroll-triggered animations
 */
export function useScrollAnimation({
  animationConfig,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  enabled = true,
}: UseScrollAnimationOptions) {
  const ref = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!enabled || !ref.current) return
    if (triggerOnce && hasAnimated.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              ...animationConfig,
            })

            if (triggerOnce) {
              hasAnimated.current = true
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [enabled, threshold, rootMargin, triggerOnce])

  return ref
}

