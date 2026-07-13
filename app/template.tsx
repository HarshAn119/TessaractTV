'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: [0.21, 0.47, 0.32, 0.98], duration: 0.5 }}
            className="flex-1 flex flex-col min-h-screen"
        >
            {children}
        </motion.main>
    )
}
