'use client'

import { ButtonHTMLAttributes, forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'
import anime from 'animejs'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, onClick, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const rippleRef = useRef<HTMLSpanElement | null>(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return

      // Create ripple effect
      const button = (ref as React.RefObject<HTMLButtonElement>)?.current || buttonRef.current
      if (button) {
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        const ripple = document.createElement('span')
        ripple.style.width = ripple.style.height = size + 'px'
        ripple.style.left = x + 'px'
        ripple.style.top = y + 'px'
        ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none'
        ripple.style.transform = 'scale(0)'
        
        button.appendChild(ripple)

        anime({
          targets: ripple,
          scale: [0, 4],
          opacity: [0.6, 0],
          duration: 600,
          easing: 'easeOutQuad',
          complete: () => ripple.remove(),
        })
      }

      onClick?.(e)
    }

    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden'
    
    const variants = {
      primary: 'btn-primary focus:ring-primary',
      secondary: 'bg-surface-elevated text-text-primary hover:bg-surface border border-border-secondary hover:border-border-accent focus:ring-border-accent hover:shadow-lg',
      ghost: 'text-text-primary hover:bg-surface focus:ring-surface',
      outline: 'border border-border text-text-primary hover:bg-surface hover:border-border-accent focus:ring-border-accent',
      danger: 'bg-error text-white hover:shadow-glow-accent focus:ring-error',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    }

    return (
      <button
        ref={ref || buttonRef}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

