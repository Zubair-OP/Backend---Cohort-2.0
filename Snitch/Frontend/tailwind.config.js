/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FDFBF7',
        'bg-secondary': '#F5F0EA',
        'bg-dark': '#0A0A0A',
        'border-light': '#E8E0D4',
        'border-default': '#D4CCC0',
        'text-primary': '#1A1A1A',
        'text-secondary': '#5A5A5A',
        'text-muted': '#8A8A8A',
        'accent': '#C9A96E',
        'accent-dark': '#B5935A',
        'cream': '#FDFBF7',
        'warm-gray': '#F5F0EA',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        nav: ['15px', { lineHeight: '20px', fontWeight: '400' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
    },
  },
};
