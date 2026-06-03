/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#594731',
        background: '#F2EFEB',
        foreground: '#0D0D0D',
        secondary: '#736A62',
        muted: '#A69C94',
      },
      fontFamily: {
        sans: ['"Quicksand Variable"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
}
