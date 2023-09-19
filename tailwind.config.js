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
			green: "#CC2500",
			purple: "#5946B2",
			red: "#00A55E",
			yellow: "#F9A826"
		}
	},
	plugins: []
};
