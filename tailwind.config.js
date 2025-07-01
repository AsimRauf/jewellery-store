const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(number-input|button|ripple|spinner|form).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        monomakh: ['"Monomakh Unicode"', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [
    heroui(),
    require('tailwind-scrollbar'), // Add this plugin
  ],
};