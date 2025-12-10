import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'premium' | 'glass'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface border border-border rounded-xl p-4 shadow-md',
      elevated: 'bg-surface-elevated border border-border rounded-xl p-4 shadow-lg',
      interactive: 'bg-surface border border-border rounded-xl p-4 hover:bg-surface-elevated hover:shadow-xl hover:-translate-y-1 transition-all duration-250 cursor-pointer',
      premium: 'card-premium',
      glass: 'glass rounded-xl p-4',
    }

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card

