'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      const response = await authApi.login({ email: data.email, password: data.password })
      login(response.token, response.user)
      router.push('/browse')
    } catch (err: any) {
      setServerError(err?.message || 'Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-8 w-8 bg-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-bold text-primary">TessaractTV</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold text-text-primary tracking-tight">Welcome back</h1>
          <p className="mt-2 text-text-secondary">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-xl p-8">
          {serverError && (
            <div className="mb-6 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={cn(
                  'w-full rounded-lg border bg-black-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                  errors.email ? 'border-error' : 'border-border hover:border-border-hover'
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-text-secondary">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full rounded-lg border bg-black-700 px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    errors.password ? 'border-error' : 'border-border hover:border-border-hover'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200',
                'bg-primary text-white hover:bg-primary-hover',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-light font-medium transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
