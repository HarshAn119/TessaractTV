'use client'

import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MotionProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode
    className?: string
    delay?: number
}

export const FadeIn = ({ children, className, delay = 0, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
            duration: 0.5,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98]
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const ScaleIn = ({ children, className, delay = 0, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.4,
            delay,
            ease: [0.21, 0.47, 0.32, 0.98]
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const SlideIn = ({ children, className, delay = 0, direction = 'up', ...props }: MotionProps & { direction?: 'up' | 'down' | 'left' | 'right' }) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
            y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0
        }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export const StaggerContainer = ({ children, className, delay = 0, staggerChildren = 0.1, ...props }: MotionProps & { staggerChildren?: number }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    delayChildren: delay,
                    staggerChildren
                }
            }
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const HoverCard = ({ children, className, ...props }: MotionProps) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)
