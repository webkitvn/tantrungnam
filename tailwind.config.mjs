/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./template-parts/**/*.php",  // Be specific with template paths
      "./templates/**/*.php",
      "./*.php",                    // Catch root PHP files
      "./src/**/*.{js,jsx}",
      "./assets/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#0a0a0a',
          'secondary': '#ffffff'
        }
      },
    },
    plugins: [
      //require('@tailwindcss/typography'),
    ],
  } 