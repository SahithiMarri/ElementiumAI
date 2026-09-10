/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'lab-light': '#f8fafc',
        'lab-surface': '#ffffff',
        'lab-card': '#f1f5f9',
        'lab-border': '#e2e8f0',
        'lab-border-strong': '#cbd5e1',
        'lab-text-primary': '#0f172a',
        'lab-text-secondary': '#475569',
        'lab-text-muted': '#64748b',
        'lab-cyan': '#0284c7',       // polished sky/cyan blue
        'lab-teal': '#0d9488',
        'lab-blue': '#2563eb',
        'lab-purple': '#7c3aed',
        'lab-green': '#16a34a',
        'lab-red': '#dc2626',
        'lab-amber': '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'lab-gradient': 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 50%, #f1f5f9 100%)',
        'hero-gradient': 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 35%, #f1f5f9 70%, #ede9fe 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.9) 100%)',
      },
    },
  },
  plugins: [],
}
