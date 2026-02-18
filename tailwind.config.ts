import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Warm dark backgrounds — stone tones, not cold zinc */
        background: '#0C0A09',
        surface: {
          DEFAULT: '#1A1714',
          raised: '#231F1C',
          overlay: '#2A2521',
        },
        border: {
          DEFAULT: '#2E2924',
          subtle: '#211D19',
          hover: '#44403C',
        },
        /* Amber/Gold primary — achievement, optimism, warmth */
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FBBF24',
          muted: '#D4A017',
        },
        /* Warm accents */
        accent: {
          orange: '#FB923C',      /* gradient end — energy, momentum */
          rose: '#FB7185',        /* special highlights */
          emerald: '#34D399',     /* growth, opportunity */
        },
        success: '#10B981',       /* emerald — growth */
        warning: '#FBBF24',       /* amber-400 — shifted lighter than primary */
        danger: '#EF4444',
        /* Warm-toned text */
        text: {
          primary: '#FAFAF9',     /* stone-50 — warm white */
          secondary: '#A8A29E',   /* stone-400 */
          tertiary: '#78716C',    /* stone-500 */
        },
        card: {
          DEFAULT: '#1A1714',
          border: '#2E2924',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gaugeFill: {
          '0%': { strokeDashoffset: '283' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;