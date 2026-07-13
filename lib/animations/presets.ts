import anime, { AnimeParams } from 'animejs'

/**
 * Common animation presets for consistent animations across the app
 */
export const animationPresets = {
  // Fade in from bottom
  fadeInUp: {
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 600,
    easing: 'easeOutExpo',
  } as AnimeParams,

  // Scale fade
  scaleFade: {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 500,
    easing: 'easeOutExpo',
  } as AnimeParams,

  // Slide in from right
  slideInRight: {
    opacity: [0, 1],
    translateX: [50, 0],
    duration: 500,
    easing: 'easeOutExpo',
  } as AnimeParams,

  // Bounce in
  bounceIn: {
    opacity: [0, 1],
    scale: [0.3, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .6)',
  } as AnimeParams,

  // Fade in
  fadeIn: {
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutExpo',
  } as AnimeParams,

  // Scale in
  scaleIn: {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 400,
    easing: 'easeOutExpo',
  } as AnimeParams,
}

/**
 * Stagger animation helper
 */
export function createStaggerConfig(
  delay: number = 50,
  grid?: [number, number],
  from: 'first' | 'last' | 'center' | number = 'center'
) {
  return grid
    ? anime.stagger(delay, { grid, from })
    : anime.stagger(delay, { from })
}

