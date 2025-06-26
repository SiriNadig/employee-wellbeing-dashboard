/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        babyblue: '#D6EAF8',
        mint: '#D5F5E3',
        lavender: '#E8DAEF',
        blush: '#FADBD8',
        cream: '#FBF3E4',
        offwhite: '#FDFEFE',
        lightgray: '#EBEDEF',
        // Dark mode
        'dm-babyblue': '#152c43',
        'dm-mint': '#72808e',
        'dm-lavender': '#4c2f6f',
        'dm-blush': '#c266a7',
        'dm-cream': '#ded0c2',
        'dm-offblack': '#232220',
        'dm-softgray': '#464b37',
      },
      fontFamily: {
        soft: ['Nunito', 'Quicksand', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px 0 rgba(180, 180, 200, 0.12)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 