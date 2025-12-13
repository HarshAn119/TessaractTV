'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, User } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="hidden h-8 w-8 bg-primary transition-transform duration-300 group-hover:scale-110 sm:block" />
          <span className="text-xl font-bold text-primary">TessaractTV</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-surface/50 backdrop-blur-sm px-10 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent/20 focus:bg-surface hover:border-border-secondary"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center sm:space-x-2">
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="hover:bg-surface/50">
              Browse
            </Button>
          </Link>
          
          <Link href="/test-video">
            <Button variant="ghost" size="sm" className="hover:bg-surface/50">
              Test Video
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-surface/50">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="md:hidden hover:bg-surface/50">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/login">
            <Button variant="primary" size="sm">
              <User className="hidden mr-2 h-4 w-4 sm:block" />
              <span className="whitespace-nowrap">Sign In</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

