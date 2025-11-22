/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
      fontFamily:{
        sans: ['Inter', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function({ addVariant }) {
      addVariant("dark", "&:is(.dark *)");
    }),
  ],
}
