/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '380px', // hide coin countdown on truly tiny phones
      },
      colors: {
        'syphrone-bg': '#070a13',
        'syphrone-card': '#0b0f19',
        'syphrone-border': '#1e243b',
        'syphrone-primary': '#4a6aff',
        'syphrone-secondary': '#a855f7',
        'syphrone-text': '#f1f5f9',
        'syphrone-muted': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        blob: 'blob 12s infinite ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        scanner: 'scanner 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-15px, 20px) scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px #4a6aff' },
          '50%': { boxShadow: '0 0 20px #4a6aff' },
        },
        scanner: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
