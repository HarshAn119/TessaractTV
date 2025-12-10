# Anime.js Integration Plan
## Enhancing CRED-Inspired Animations with Anime.js

---

## Overview

**Anime.js** is a lightweight, powerful JavaScript animation library that excels at:
- Complex timeline-based animations
- Advanced stagger effects
- SVG morphing and path animations
- Scroll-triggered animations
- Physics-based animations
- Precise control over animation sequences

**Strategy**: Use Anime.js for complex, orchestrated animations that benefit from JavaScript control, while keeping Framer Motion for React component animations and simple transitions.

---

## Library Roles

### Framer Motion (React-focused)
- Component mount/unmount animations
- Layout animations
- Gesture-based interactions (drag, swipe)
- Simple hover/click animations
- React state-driven animations
- Page transitions

### Anime.js (Complex orchestration)
- Complex timeline sequences
- Stagger animations (card grids, lists)
- SVG animations (logos, icons, illustrations)
- Scroll-triggered animations
- Confetti and particle effects
- Number counting animations
- Path/motion animations
- Complex multi-element coordination

---

## 1. Use Cases for Anime.js

### 1.1 Page Load Animations

**Scenario**: Hero section with multiple elements animating in sequence

```javascript
// Hero section entrance animation
anime.timeline({
  easing: 'easeOutExpo',
  duration: 1000
})
.add({
  targets: '.hero-title',
  opacity: [0, 1],
  translateY: [50, 0],
  duration: 800,
  delay: 200
})
.add({
  targets: '.hero-subtitle',
  opacity: [0, 1],
  translateY: [30, 0],
  duration: 600
}, '-=400')
.add({
  targets: '.hero-buttons',
  opacity: [0, 1],
  scale: [0.8, 1],
  duration: 500
}, '-=300')
.add({
  targets: '.hero-cards .card',
  opacity: [0, 1],
  translateY: [40, 0],
  scale: [0.9, 1],
  delay: anime.stagger(100),
  duration: 600
}, '-=200')
```

**Benefits**:
- Precise timing control
- Sequential animations with offsets
- Stagger effects for multiple cards
- Smooth easing functions

---

### 1.2 Video Card Grid Stagger

**Scenario**: Video cards appearing in a grid with stagger effect

```javascript
// Video grid stagger animation
anime({
  targets: '.video-grid .video-card',
  opacity: [0, 1],
  translateY: [60, 0],
  scale: [0.8, 1],
  delay: anime.stagger(50, {grid: [4, 4], from: 'center'}),
  duration: 600,
  easing: 'easeOutExpo'
})
```

**Benefits**:
- Grid-based stagger (from center, spiral, etc.)
- Smooth sequential appearance
- Perfect for CRED-style premium feel

---

### 1.3 Confetti/Success Animations

**Scenario**: Celebratory confetti on successful actions (like, subscribe, etc.)

```javascript
// Confetti particle animation
function createConfetti() {
  const colors = ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE', '#00F2FE'];
  const particles = [];
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '-10px';
    document.body.appendChild(particle);
    particles.push(particle);
  }
  
  anime({
    targets: particles,
    translateY: [0, window.innerHeight + 100],
    translateX: () => anime.random(-200, 200),
    rotate: () => anime.random(0, 720),
    opacity: [1, 0],
    duration: () => anime.random(2000, 3000),
    easing: 'easeOutQuad',
    complete: () => {
      particles.forEach(p => p.remove());
    }
  });
}
```

**Benefits**:
- Dynamic particle creation
- Random physics-based movement
- Perfect for gamification

---

### 1.4 Number Counting Animation

**Scenario**: Stats cards with animated numbers (views, subscribers, etc.)

```javascript
// Number counting animation
anime({
  targets: '.stat-number',
  innerHTML: [0, 1250000],
  round: 1,
  duration: 2000,
  easing: 'easeOutExpo',
  update: function(anim) {
    const value = Math.floor(anim.animatables[0].target.innerHTML);
    anim.animatables[0].target.innerHTML = value.toLocaleString();
  }
})
```

**Benefits**:
- Smooth number transitions
- Formatting during animation
- Great for dashboard stats

---

### 1.5 SVG Logo/Icon Animations

**Scenario**: Logo animation on page load, icon morphing

```javascript
// SVG path drawing animation
anime({
  targets: '.logo path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 2000,
  delay: (el, i) => i * 100,
  direction: 'alternate',
  loop: true
})

// Icon morphing
anime({
  targets: '.icon',
  d: [
    {value: 'M12 2L2 7l10 5 10-5-10-5z'},
    {value: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'}
  ],
  duration: 1000,
  easing: 'easeInOutQuad'
})
```

**Benefits**:
- SVG path drawing effects
- Shape morphing
- Perfect for premium branding

---

### 1.6 Scroll-Triggered Animations

**Scenario**: Elements animate as they enter viewport

```javascript
// Scroll observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      anime({
        targets: entry.target,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

**Benefits**:
- Performance optimized
- Smooth reveal animations
- Great for long pages

---

### 1.7 Button Ripple Effect

**Scenario**: Premium button with animated ripple on click

```javascript
// Ripple effect on button click
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  anime({
    targets: ripple,
    scale: [0, 4],
    opacity: [0.6, 0],
    duration: 600,
    easing: 'easeOutQuad',
    complete: () => ripple.remove()
  });
}
```

**Benefits**:
- Dynamic ripple creation
- Click position-based animation
- Premium interaction feel

---

### 1.8 Progress Bar Animation

**Scenario**: Smooth progress bar fill with glow effect

```javascript
// Progress bar animation
anime({
  targets: '.progress-fill',
  width: ['0%', '75%'],
  duration: 2000,
  easing: 'easeOutExpo',
  update: (anim) => {
    // Add glow intensity based on progress
    const progress = anim.progress / 100;
    const glow = progress * 0.8;
    anim.animatables[0].target.style.boxShadow = 
      `0 0 ${20 + glow * 20}px rgba(102, 126, 234, ${0.4 + glow * 0.4})`;
  }
})
```

**Benefits**:
- Smooth progress updates
- Dynamic property changes
- Visual feedback

---

### 1.9 Modal/Dialog Entrance

**Scenario**: Premium modal with scale + fade + backdrop

```javascript
// Modal entrance animation
const modalTimeline = anime.timeline({
  easing: 'easeOutExpo',
  duration: 400
});

modalTimeline
.add({
  targets: '.modal-backdrop',
  opacity: [0, 1],
  duration: 300
})
.add({
  targets: '.modal-content',
  opacity: [0, 1],
  scale: [0.8, 1],
  translateY: [30, 0],
  duration: 400
}, '-=200')
```

**Benefits**:
- Coordinated multi-element animation
- Perfect timing control
- Premium feel

---

### 1.10 Search Bar Focus Animation

**Scenario**: Search bar expands and glows on focus

```javascript
// Search bar focus animation
anime({
  targets: '.search-bar',
  scale: [1, 1.02],
  boxShadow: [
    '0 0 0px rgba(102, 126, 234, 0)',
    '0 0 20px rgba(102, 126, 234, 0.5)'
  ],
  duration: 300,
  easing: 'easeOutQuad'
})
```

**Benefits**:
- Smooth property transitions
- Multiple properties animated together

---

## 2. Integration Strategy

### 2.1 React Hooks for Anime.js

Create custom hooks to integrate Anime.js with React:

```typescript
// hooks/useAnime.ts
import { useEffect, useRef } from 'react'
import anime from 'animejs'

export function useAnime(animationConfig: any, deps: any[] = []) {
  const targetRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    if (targetRef.current) {
      const anim = anime({
        targets: targetRef.current,
        ...animationConfig
      })
      return () => anim.pause()
    }
  }, deps)
  
  return targetRef
}

// Usage
function VideoCard() {
  const cardRef = useAnime({
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 600,
    easing: 'easeOutExpo'
  })
  
  return <div ref={cardRef}>...</div>
}
```

---

### 2.2 Stagger Hook for Grids

```typescript
// hooks/useStagger.ts
import { useEffect, useRef } from 'react'
import anime from 'animejs'

export function useStagger(
  selector: string,
  animationConfig: any,
  staggerDelay: number = 50
) {
  useEffect(() => {
    anime({
      targets: selector,
      delay: anime.stagger(staggerDelay),
      ...animationConfig
    })
  }, [selector, staggerDelay])
}

// Usage
function VideoGrid({ videos }) {
  useStagger('.video-card', {
    opacity: [0, 1],
    translateY: [60, 0],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutExpo'
  }, 50)
  
  return <div className="video-grid">...</div>
}
```

---

### 2.3 Scroll Animation Hook

```typescript
// hooks/useScrollAnimation.ts
import { useEffect, useRef } from 'react'
import anime from 'animejs'

export function useScrollAnimation(
  animationConfig: any,
  threshold: number = 0.1
) {
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              ...animationConfig
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return ref
}
```

---

## 3. Component Integration Examples

### 3.1 Video Card with Anime.js

```typescript
// components/video/VideoCard.tsx
'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { Video } from '@/types'

interface VideoCardProps {
  video: Video
  index: number
}

export default function VideoCard({ video, index }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLDivElement>(null)
  
  // Entrance animation with stagger
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.9, 1],
        delay: index * 50,
        duration: 600,
        easing: 'easeOutExpo'
      })
    }
  }, [index])
  
  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current && playButtonRef.current) {
      anime({
        targets: cardRef.current,
        translateY: -8,
        scale: 1.02,
        duration: 300,
        easing: 'easeOutQuad'
      })
      
      anime({
        targets: playButtonRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 200
      })
    }
  }
  
  const handleMouseLeave = () => {
    if (cardRef.current && playButtonRef.current) {
      anime({
        targets: cardRef.current,
        translateY: 0,
        scale: 1,
        duration: 300
      })
      
      anime({
        targets: playButtonRef.current,
        opacity: 0,
        scale: 0.8,
        duration: 200
      })
    }
  }
  
  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="video-card"
    >
      {/* Card content */}
      <div ref={playButtonRef} className="play-overlay">
        ▶
      </div>
    </div>
  )
}
```

---

### 3.2 Stats Card with Counting Animation

```typescript
// components/creator/StatCard.tsx
'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'

interface StatCardProps {
  value: number
  label: string
  icon: React.ReactNode
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (numberRef.current && cardRef.current) {
      // Card entrance
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutExpo'
      })
      
      // Number counting
      anime({
        targets: numberRef.current,
        innerHTML: [0, value],
        round: 1,
        duration: 2000,
        delay: 300,
        easing: 'easeOutExpo',
        update: function(anim) {
          const val = Math.floor(anim.animatables[0].target.innerHTML)
          anim.animatables[0].target.innerHTML = val.toLocaleString()
        }
      })
    }
  }, [value])
  
  return (
    <div ref={cardRef} className="stat-card">
      {icon}
      <span ref={numberRef} className="stat-number">0</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
```

---

### 3.3 Confetti Success Animation

```typescript
// components/shared/Confetti.tsx
'use client'

import { useEffect } from 'react'
import anime from 'animejs'

interface ConfettiProps {
  trigger: boolean
  colors?: string[]
}

export default function Confetti({ trigger, colors = ['#667EEA', '#764BA2', '#F093FB', '#F5576C'] }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return
    
    const particles: HTMLElement[] = []
    const container = document.createElement('div')
    container.className = 'confetti-container'
    document.body.appendChild(container)
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'confetti-particle'
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = '-10px'
      particle.style.width = '8px'
      particle.style.height = '8px'
      particle.style.borderRadius = '50%'
      particle.style.position = 'absolute'
      container.appendChild(particle)
      particles.push(particle)
    }
    
    // Animate particles
    anime({
      targets: particles,
      translateY: [0, window.innerHeight + 100],
      translateX: () => anime.random(-200, 200),
      rotate: () => anime.random(0, 720),
      opacity: [1, 0],
      duration: () => anime.random(2000, 3000),
      easing: 'easeOutQuad',
      complete: () => {
        container.remove()
      }
    })
  }, [trigger, colors])
  
  return null
}
```

---

## 4. Performance Considerations

### 4.1 Optimization Tips

1. **Use `will-change` sparingly**
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

2. **Batch DOM reads/writes**
   - Anime.js handles this internally, but be mindful

3. **Use `requestAnimationFrame`**
   - Anime.js uses this by default

4. **Debounce scroll animations**
   ```typescript
   const debouncedScroll = debounce(() => {
     // Animation logic
   }, 100)
   ```

5. **Clean up animations**
   ```typescript
   useEffect(() => {
     const anim = anime({...})
     return () => anim.pause()
   }, [])
   ```

---

## 5. Animation Presets

### 5.1 Common Animation Presets

```typescript
// lib/animations/presets.ts
import anime from 'animejs'

export const animationPresets = {
  // Fade in from bottom
  fadeInUp: {
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 600,
    easing: 'easeOutExpo'
  },
  
  // Scale fade
  scaleFade: {
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 500,
    easing: 'easeOutExpo'
  },
  
  // Slide in from right
  slideInRight: {
    opacity: [0, 1],
    translateX: [50, 0],
    duration: 500,
    easing: 'easeOutExpo'
  },
  
  // Bounce in
  bounceIn: {
    opacity: [0, 1],
    scale: [0.3, 1],
    duration: 800,
    easing: 'easeOutElastic(1, .6)'
  },
  
  // Stagger grid
  staggerGrid: (delay: number = 50) => ({
    delay: anime.stagger(delay, {grid: [4, 4], from: 'center'}),
    opacity: [0, 1],
    translateY: [60, 0],
    scale: [0.8, 1],
    duration: 600,
    easing: 'easeOutExpo'
  })
}
```

---

## 6. When to Use Each Library

### Use Framer Motion for:
- ✅ React component lifecycle animations
- ✅ Layout animations (AnimatePresence)
- ✅ Gesture-based interactions
- ✅ Simple hover/click states
- ✅ Page transitions
- ✅ Drag and drop

### Use Anime.js for:
- ✅ Complex timeline sequences
- ✅ Stagger animations (grids, lists)
- ✅ SVG path animations
- ✅ Confetti/particle effects
- ✅ Number counting
- ✅ Scroll-triggered animations
- ✅ Multi-element coordination
- ✅ Physics-based animations

---

## 7. Package Installation

```json
{
  "dependencies": {
    "animejs": "^3.2.1",
    "@types/animejs": "^3.1.7"
  }
}
```

---

## 8. Best Practices

1. **Combine Libraries Wisely**
   - Use Framer Motion for React-specific animations
   - Use Anime.js for complex orchestration

2. **Avoid Conflicts**
   - Don't animate the same element with both libraries
   - Use one library per element/component

3. **Performance First**
   - Prefer CSS animations for simple transitions
   - Use Anime.js for complex animations that need JS control

4. **Accessibility**
   - Respect `prefers-reduced-motion`
   ```typescript
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   if (prefersReducedMotion) {
     // Skip or simplify animations
   }
   ```

5. **Clean Up**
   - Always clean up animations on unmount
   - Pause/cancel ongoing animations

---

This integration plan shows how Anime.js can enhance the CRED-inspired design with sophisticated animations while working alongside Framer Motion for a complete animation solution.

