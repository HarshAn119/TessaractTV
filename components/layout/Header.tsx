'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, Menu, Upload, LogOut, User as UserIcon, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils'

export default function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    router.push('/')
  }

  // User avatar initials
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
          <div className="hidden h-8 w-8 bg-primary transition-transform duration-300 group-hover:scale-110 sm:block" />
          <span className="text-xl font-bold text-primary">TessaractTV</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-surface/50 backdrop-blur-sm px-10 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all duration-250 focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent/20 focus:bg-surface hover:border-border-secondary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center sm:space-x-2">
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="hover:bg-surface/50">
              Browse
            </Button>
          </Link>

          {/* Mobile search */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-surface/50">
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile menu */}
          <Button variant="ghost" size="sm" className="md:hidden hover:bg-surface/50">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/upload">
            <Button variant="secondary" size="sm">
              <Upload className="hidden mr-2 h-4 w-4 sm:block" />
              <span className="whitespace-nowrap">Upload</span>
            </Button>
          </Link>

          {isAuthenticated && user ? (
            /* Authenticated: avatar + dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200',
                  'bg-primary text-white hover:ring-2 hover:ring-primary/40 hover:scale-105',
                  showDropdown && 'ring-2 ring-primary/40 scale-105'
                )}
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.username} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  initials
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface shadow-elevation-3 py-1 animate-fade-in">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary truncate">@{user.username}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Your Profile
                  </Link>

                  <Link
                    href="/upload"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </Link>

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated: Sign In button */
            <Link href="/login">
              <Button variant="primary" size="sm">
                <UserIcon className="hidden mr-2 h-4 w-4 sm:block" />
                <span className="whitespace-nowrap">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
