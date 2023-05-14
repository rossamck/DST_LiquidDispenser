module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        width: {
          '10vw': '10vw',
          '15vw': '15vw',

          '20vw': '20vw',

          '25vw': '25vw',
          '50vw': '50vw',
          '75vw': '75vw',
          '100vw': '100vw',
        },
        height: {
          '5vh': '5vh',
          '15vh': '15vh',

          '20vh': '20vh',

          '10vh': '10vh',
          '25vh': '25vh',
          '50vh': '50vh',
          '75vh': '75vh',
          '80vh': '80vh',
          '100vh': '100vh',
        },
      },
    },    variants: {},
    plugins: [],
  }
  