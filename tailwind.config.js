/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3563E9',
          50:  '#EEF2FD',
          100: '#D9E4FB',
          400: '#5A84EE',
          500: '#3563E9',
          600: '#2851C9',
          700: '#1E3FA0',
        },
        surface: '#F6F7F9',
        dark: {
          DEFAULT: '#0D1117',
          100: '#1A202C',
          200: '#252D3D',
        },
        muted: '#90A3BF',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp   0.7s ease forwards',
        'fade-up-1': 'fadeUp   0.7s ease 0.10s forwards',
        'fade-up-2': 'fadeUp   0.7s ease 0.20s forwards',
        'fade-up-3': 'fadeUp   0.7s ease 0.30s forwards',
        'fade-up-4': 'fadeUp   0.7s ease 0.45s forwards',
        'fade-up-5': 'fadeUp   0.7s ease 0.60s forwards',
        'fade-in':   'fadeIn   0.5s ease forwards',
        'slide-left':'slideLeft 0.7s ease forwards',
        'scale-in':  'scaleIn  0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-down':'slideDown 0.25s ease forwards',
        'float':     'float    4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'shimmer':   'shimmer  1.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(36px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-36px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(0.75)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        card:       '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 20px 60px rgba(53,99,233,0.13)',
        btn:        '0 4px 20px rgba(53,99,233,0.35)',
        'btn-hover':'0 8px 32px rgba(53,99,233,0.52)',
        glass:      '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        auth:       '0 32px 96px rgba(53,99,233,0.10)',
      },
      borderRadius: {
        card: '20px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
