module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Lato", "sans-serif"],
			serif: ["Merriweather", "serif"],
			mono: ["Roboto mono", "mono"],
		},
		extend: {
			backgroundImage: {
				"gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
				"gradient-conic-t":
					"conic-gradient(at top, var(--tw-gradient-stops))",
				"gradient-conic-r":
					"conic-gradient(at right, var(--tw-gradient-stops))",
				"gradient-conic-b":
					"conic-gradient(at bottom, var(--tw-gradient-stops))",
				"gradient-conic-l":
					"conic-gradient(at left, var(--tw-gradient-stops))",
				"gradient-conic-tr":
					"conic-gradient(at top right, var(--tw-gradient-stops))",
				"gradient-conic-tl":
					"conic-gradient(at top left, var(--tw-gradient-stops))",
				"gradient-conic-br":
					"conic-gradient(at bottom right, var(--tw-gradient-stops))",
				"gradient-conic-bl":
					"conic-gradient(at bottom left, var(--tw-gradient-stops))",

				"repeating-pattern":
					"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%23b3ada9' fill-opacity='0.2'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
			},
			screens: { xs: "475px" },
			colors: {
				cobalt: {
					50: "#3279dd",
					100: "#286fd3",
					200: "#1e65c9",
					300: "#145bbf",
					400: "#0a51b5",
					500: "#0047ab",
					600: "#003da1",
					700: "#003397",
					800: "#00298d",
					900: "#001f83",
				},
				primary: "#3279dd", // cobalt-50

				// indicators
				ok: "#16A34A", // green-600
				info: "#0284C7", //cyan-600
				warning: "#D97706", // amber-600
				danger: "#DC2626", // red-600
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
