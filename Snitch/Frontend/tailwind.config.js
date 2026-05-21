/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8F8F8',
        'bg-dark': '#0A0A0A',
        'border-light': '#E8E8E8',
        'border-default': '#D4D4D4',
        'text-primary': '#1A1A1A',
        'text-secondary': '#5A5A5A',
        'text-muted': '#8A8A8A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        nav: ['15px', { lineHeight: '20px', fontWeight: '400' }],
      },
    },
  },
};
