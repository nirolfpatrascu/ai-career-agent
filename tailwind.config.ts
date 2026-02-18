import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFBF5',
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFF8F0',
          overlay: '#FFF5EB',
        },
        border: {
          DEFAULT: '#E8DDD2',
          subtle: '#F0E6DA',
          hover: '#D4C4B0',
        },
        primary: {
          DEFAULT: '#E8890A',
          hover: '#D97706',
          light: '#F59E0B',
          muted: '#C27808',
        },
        accent: {
          orange: '#EA7E2E',
          rose: '#E1557A',
          emerald: '#10B981',
        },
        success: '#10B981',
        warning: '#D97706',
        danger: '#DC2626',
        text: {
          primary: '#1C1410',
          secondary: '#6B5D52',
          tertiary: '#9C8E82',
        },
        card: {
          DEFAULT: '#FFFFFF',
          border: '#E8DDD2',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'gauge-fill': 'gaugeFill 1.5s ease-out forwards',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        gaugeFill: { '0%': { strokeDashoffset: '283' } },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow: { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};

export default config;
