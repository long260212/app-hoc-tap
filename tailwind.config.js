/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#07090e',
          surface: '#0d111a',
          elevated: '#131825',
          card: '#0f1420',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          teal: '#06b6d4',
          mint: '#10b981',
          coral: '#f87171',
          accent: '#0284c7'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 25px -5px rgba(99, 102, 241, 0.15)',
        'glow-indigo': '0 0 25px rgba(99, 102, 241, 0.25)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-mint': '0 0 25px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'shimmer': 'shimmer 5s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      }
    },
  },
  plugins: [],
}
