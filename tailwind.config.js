/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        colors: {
            ...colors,
            offwhite: "#FFFBFC",
            offblack: "#121212",
            primary: "#30332E"
        }
    },
    plugins: []
};
