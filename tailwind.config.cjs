/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem'
    },
    extend: {
      colors: {
        ink: '#0C0F17',
        mist: '#F5F7FB',
        accent: '#5C7CFF',
        accentMuted: '#8EA4FF'
      },
      fontFamily: {
        sans: ['"Inter var"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        depth: '0 20px 60px rgba(12, 15, 23, 0.35)'
      }
    }
  },
  plugins: []
};
