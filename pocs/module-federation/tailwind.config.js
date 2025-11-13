// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './apps/host/src/**/*.{ts,tsx,js,jsx}',
      './apps/checkout/src/**/*.{ts,tsx,js,jsx}',
      './packages/ui/src/**/*.{ts,tsx,js,jsx}'
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  