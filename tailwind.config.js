/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Blacks
        black: {
          900: '#000000',
          800: '#0A0A0A',
          700: '#141414',
          600: '#1A1A1A',
        },
        // Soft Whites & Grays
        white: {
          100: '#FFFFFF',
          200: '#FAFAFA',
        },
        gray: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
        },
        // Primary Colors (Gradients)
        primary: {
          DEFAULT: '#667EEA',
          dark: '#764BA2',
          light: '#818CF8',
        },
        accent: {
          DEFAULT: '#FA709A',
          dark: '#F5576C',
          light: '#FEE140',
        },
        secondary: {
          DEFAULT: '#4FACFE',
          light: '#00F2FE',
        },
        // Background Colors
        background: {
          DEFAULT: '#000000',
          secondary: '#0A0A0A',
          tertiary: '#141414',
          elevated: '#1A1A1A',
        },
        surface: {
          DEFAULT: '#141414',
          secondary: '#1A1A1A',
          elevated: '#262626',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          secondary: 'rgba(255, 255, 255, 0.05)',
          accent: 'rgba(102, 126, 234, 0.3)',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#D4D4D4',
          muted: '#A3A3A3',
          disabled: '#525252',
        },
        // Status Colors
        success: {
          DEFAULT: '#84FAB0',
          dark: '#8FD3F4',
        },
        warning: {
          DEFAULT: '#FAD961',
          dark: '#F76B1C',
        },
        error: {
          DEFAULT: '#FF6B6B',
          dark: '#EE5A6F',
        },
        info: '#3b82f6',
        // Premium Gold
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE55C',
          dark: '#FFB800',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        lg: '0 8px 16px 0 rgba(0, 0, 0, 0.4), 0 4px 8px 0 rgba(0, 0, 0, 0.3)',
        xl: '0 16px 32px 0 rgba(0, 0, 0, 0.5), 0 8px 16px 0 rgba(0, 0, 0, 0.4)',
        '2xl': '0 24px 48px 0 rgba(0, 0, 0, 0.6), 0 12px 24px 0 rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 20px rgba(102, 126, 234, 0.4), 0 0 40px rgba(102, 126, 234, 0.2)',
        'glow-accent': '0 0 20px rgba(250, 112, 154, 0.4), 0 0 40px rgba(250, 112, 154, 0.2)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'fade-out': 'fadeOut 200ms ease-in-out',
        'slide-up': 'slideUp 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'slide-up-fade': 'slideUpFade 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-fade': 'scaleFade 200ms ease-out',
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 800ms ease-out',
        'heartbeat': 'heartbeat 600ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUpFade: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleFade: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1.1)' },
          '75%': { transform: 'scale(1.15)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        'gradient-primary-alt': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
        'gradient-success': 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
        'gradient-warning': 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)',
        'gradient-error': 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)',
      },
    },
  },
  plugins: [],
}

