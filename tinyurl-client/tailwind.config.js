/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ff6600', // vibrant orange main tone
                    foreground: '#fff',
                },
            },
        },
    },
    plugins: [],
}
