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
        // Modern Deep Blacks & Greys
        black: {
          DEFAULT: '#000000',
          900: '#050505', // Deepest background
          800: '#0A0A0A', // Card background
          700: '#121212', // Slightly elevated
          600: '#1A1A1A', // Borders/Separators
        },
        // Refined Greyscale
        zinc: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B', // Subtext
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
        // Electric Indigo Accent
        primary: {
          DEFAULT: '#6366F1', // Indigo 500
          hover: '#4F46E5',   // Indigo 600
          light: '#818CF8',   // Indigo 400
          subtle: 'rgba(99, 102, 241, 0.1)',
        },
        // Semantic Colors
        success: '#10B981', // Emerald 500
        warning: '#F59E0B', // Amber 500
        error: '#EF4444',   // Red 500
        info: '#3B82F6',    // Blue 500

        // Semantic Aliases
        background: {
          DEFAULT: '#050505',
          secondary: '#0A0A0A',
          tertiary: '#121212',
        },
        surface: {
          DEFAULT: '#121212',
          hover: '#1A1A1A',
          active: '#262626',
          elevated: '#1A1A1A',
        },
        border: {
          DEFAULT: '#1A1A1A', // Very subtle
          hover: '#262626',
          active: '#404040',
          accent: '#6366F1',   // primary border highlight
          secondary: '#262626',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA', // Zinc 400
          tertiary: '#52525B',  // Zinc 600
          muted: '#3F3F46',     // Zinc 700
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        xxs: '0.625rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevation-1': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'elevation-3': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-hover': '0 0 30px rgba(99, 102, 241, 0.3)',
      },
      letterSpacing: {
        tightest: '-0.02em',
        tighter: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.05em',
      },
      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0))',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
      },
    },
  },
  plugins: [],
}

