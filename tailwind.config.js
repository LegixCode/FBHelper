/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
    content: ["./index.html", "./src/**/*.vue"],
    theme: {
        extend: {
            boxShadow: {
                nav: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)",
                adaccount: "0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)",
            },
            transitionTimingFunction: {
                adaccount: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            },
        },
        colors: {
            white: "#fff",
            slate: colors.slate,
            teal: {
                light: "#4db6ac",
                DEFAULT: "#26a69a",
                dark: "#009688",
            },
            red: {
                light: "#ef5350",
                DEFAULT: "#f44336",
                dark: "#e53935",
            },
            orange: "#ffa726",
            green: "#66bb6a",
        },
    },
    plugins: [],
};
