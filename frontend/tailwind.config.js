/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'lab-bg': '#f4e8d8',
        'lab-sidebar': '#ecdbc0',
        'lab-surface': '#fbf4e8',
        'lab-surface-raised': '#ffffff',
        'lab-border': '#d9c3a0',
        'lab-border-soft': '#e7d6b8',
        'lab-text': '#3d2b1c',
        'lab-muted': '#8a7052',
        'lab-mint': '#a9713a',
        'lab-mint-dark': '#f0dcb8',
        'lab-gold': '#c9973f',
        'lab-teal': '#287d78',
        'lab-teal-bright': '#54aaa0',
        'lab-lavender': '#8a5a3f',
        'lab-blue': '#79532f',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
