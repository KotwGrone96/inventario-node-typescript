/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./views/**/*.hbs', './node_modules/flowbite/**/*.js'],
	theme: {
		extend: {},
		fontFamily: {
			roboto: ['Roboto', 'sans-serif'],
		},
	},
	darkMode: 'class',
	plugins: [require('flowbite/plugin')],
};
