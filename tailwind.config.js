module.exports = {
  content: [
    "./src/**/*.{html,njk,js}",
    "./src/_includes/**/*.{html,njk,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A255F',
          light: '#2F4F6E',
          medium: '#3B5870',
          dark: '#1C3D5A',
        },
        accent: {
          DEFAULT: '#B83227',
          light: '#D9453D',
          medium: '#A53829',
          dark: '#C12748',
        },
        background: {
          DEFAULT: '#F8F9F9',
          lightest: '#F8F9F9',
          lighter: '#EDF1F2',
          light: '#F5F7F9',
          medium: '#EAeded',
        },
      },
    },
  },
  plugins: [],
}
