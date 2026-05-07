import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          hover: 'rgb(var(--bg-hover) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
          accent: 'rgb(var(--accent) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dim: 'rgb(var(--accent) / 0.12)',
          glow: 'rgb(var(--accent) / 0.35)',
        },
        positive: 'rgb(var(--positive) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        negative: 'rgb(var(--negative) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        label: ['Montserrat', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        round: ['"Varela Round"', 'sans-serif'],
      },
      fontSize: {
        'kpi-xl': ['3rem', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.02em' }],
        'kpi-lg': ['2.25rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        label: ['0.7rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        card: '14px',
        chip: '999px',
      },
      boxShadow: {
        card: '0 4px 16px -4px rgb(0 0 0 / 0.4)',
        glow: '0 0 24px -4px rgb(var(--accent) / 0.4)',
        'glow-sm': '0 0 12px -2px rgb(var(--accent) / 0.35)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgb(var(--accent) / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent) / 0.04) 1px, transparent 1px)',
        'hero-gradient':
          'radial-gradient(ellipse at 30% 20%, rgb(var(--accent) / 0.10), transparent 60%), radial-gradient(ellipse at 80% 80%, rgb(var(--info) / 0.08), transparent 55%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
