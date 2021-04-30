const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      height: {
        "60rem": "60rem",
        "58rem": "58rem",
        "50rem": "50rem",
        "49rem": "48rem",
        "47rem": "46rem",
        "40rem": "40rem",
        "35rem": "35rem",
        "30rem": "30rem",
        "25rem": "25rem",
        "20rem": "20rem",
      }
    },
    
  },
  plugins: [require("@tailwindcss/forms")],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};
