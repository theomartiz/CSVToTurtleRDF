module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            gold:"#ff9f48",
            grey:"#7d7d7d",
            gray:{
                200:"#e5e5e5",
                700:"#383838"
            },
            white:"#FFF",
            red: "#d70909"
        },
        minHeight: {
            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
            'screen-8': '8vh',
        },
        minWidth: {
            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
            300:'300px'
        },
        maxHeight: {
            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
            'screen-3/4':'75vh'
        },
        extend: {
            spacing: {
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
