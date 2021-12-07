const colors = require('tailwindcss/colors')

module.exports = {
  screens: {
    xxs: '0',
    xs: '249px',
    sm: '599px',
    md: '959px',
    lg: '1279px',
    xl: '1919px'
  },
  colors: {
    gray: colors.coolGray,
    blue: colors.blue,
    'light-blue': colors.sky,
    teal: colors.teal,

    red: colors.red,
    pink: colors.fuchsia,
    'blue-gray': colors.blueGray,
    'cool-gray': colors.coolGray,
    'true-gray': colors.trueGray,
    'warm-gray': colors.warmGray,
    indigo: colors.indigo,
    white: colors.white,
    black: colors.black,
    green: colors.green,
    amber: colors.amber,
    yellow: colors.yellow
  },
  fontFamily: {
    sans: ['Noto sans display', 'sans-serif']
  },
  extend: {
    spacing: {
      128: '32rem',
      144: '36rem'
    },
    borderRadius: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px'
    }
  }
}
