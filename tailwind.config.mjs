/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Trebuchet MS", "Trebuchet", "Arial", "sans-serif"],
        serif: ["Trebuchet MS", "Trebuchet", "Arial", "sans-serif"],
        mono: ["Trebuchet MS", "Trebuchet", "Arial", "sans-serif"],
      },
      keyframes: {
        scaleAnim: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        scale: 'scaleAnim 300ms ease-in-out',
      },
    },
  },
  plugins: [],
};
