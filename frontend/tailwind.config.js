/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        medical: {
          blue:  '#2563EB',
          teal:  '#14B8A6',
          green: '#22C55E',
          amber: '#F59E0B',
          red:   '#EF4444',
          bg:    '#F8FAFC',
          dark:  '#0F172A',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '375px',   // iPhone SE
        sm: '390px',   // iPhone 14
        md: '768px',   // iPad
        lg: '1024px',
        xl: '1280px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass:      '0 8px 32px 0 rgba(31,38,135,0.07)',
        medical:    '0 4px 24px rgba(37,99,235,0.15)',
        'medical-lg':'0 8px 40px rgba(37,99,235,0.20)',
        card:       '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        float:     'float 4s ease-in-out infinite',
        shimmer:   'shimmer 1.5s infinite',
        'fade-up': 'fadeUp 0.4s ease-out',
        'slide-up':'slideUp 0.3s ease-out',
        'pulse-ring':'pulseRing 1.5s ease-out infinite',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp:   { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        pulseRing:{ '0%': { transform: 'scale(0.8)', opacity: '1' }, '100%': { transform: 'scale(2)', opacity: '0' } },
      },
    },
  },
  plugins: [],
}
