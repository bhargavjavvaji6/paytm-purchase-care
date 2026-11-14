/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                paytmBlue: '#00BAF2',
                paytmDarkBlue: '#002E6E'
            }
        },
    },
    plugins: [],
}