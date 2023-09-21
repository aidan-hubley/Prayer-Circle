/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: [
		"./screens/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {},
		colors: {
			...colors,
			offwhite: "#FFFBFC",
			offblack: "#121212",
			green: "#00A55E",
			purple: "#5946B2",
			red: "#CC2500",
			yellow: "#F9A826"
		}
	},
	plugins: []
};
