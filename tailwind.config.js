/** @type {import('tailwindcss').Config} */
import { breakpoints } from './src/utils/constants';

const { screenXXL, screenXL, screenLG, screenMD, screenSM, screenXS } =
  breakpoints;

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      body: ['Open Sans', 'sans-serif'],
      sans: ['Open Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        appBg: "#080707",
        primary: '#ED1B23',
        white: {
          DEFAULT: "#FFFFFF"
        }
      },
    },
    screens: {
      'sm': screenSM + "px",
      'md': screenMD + "px",
      'lg': screenLG + "px",
      'xl': screenXL + "px",
      '2xl': screenXXL + "px",
    }
  }
}