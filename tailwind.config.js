// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',     // App Router files
        './pages/**/*.{js,ts,jsx,tsx}',   // If you use /pages too
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
