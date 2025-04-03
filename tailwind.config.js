/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6", // Blue color, you can adjust
                secondary: "#10B981", // Green for success
                danger: "#EF4444", // Red for errors/failed transactions
            },
        },
    },
    plugins: [],
}