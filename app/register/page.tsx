'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils'

const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters')
            .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null)
        try {
            const response = await authApi.register({
                username: data.username,
                email: data.email,
                password: data.password,
            })
            login(response.token, response.user)
            router.push('/browse')
        } catch (err: any) {
            setServerError(err?.message || 'Registration failed. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-black-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-primary transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-2xl font-bold text-primary">TessaractTV</span>
                    </Link>
                    <h1 className="mt-8 text-3xl font-bold text-text-primary tracking-tight">Create your account</h1>
                    <p className="mt-2 text-text-secondary">Start uploading and watching today</p>
                </div>

                {/* Card */}
                <div className="glass-panel rounded-xl p-8">
                    {serverError && (
                        <div className="mb-6 rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Username
                            </label>
                            <input
                                {...register('username')}
                                type="text"
                                autoComplete="username"
                                placeholder="coolcreator_42"
                                className={cn(
                                    'w-full rounded-lg border bg-black-700 px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                    errors.username ? 'border-error' : 'border-border hover:border-border-hover'
                                )}
                            />
                            {errors.username && (
                                <p className="mt-1.5 text-xs text-error">{errors.username.message}</p>
                            )}
                        </div>

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
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Min. 8 characters"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    className={cn(
                                        'w-full rounded-lg border bg-black-700 px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-200',
                                        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                                        errors.confirmPassword ? 'border-error' : 'border-border hover:border-border-hover'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-error">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 mt-2',
                                'bg-primary text-white hover:bg-primary-hover',
                                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create account
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
