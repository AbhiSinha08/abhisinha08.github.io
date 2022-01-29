module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
        colors: {
            base: '#0C0032',
            gr1: '#8E2DE2',
            gr2: '#4A00E0',
        },
        fontFamily : {
            baloo: ["'Baloo Bhaijaan 2'", 'sans-serif'],
            nunito: ["'Nunito'", 'sans-serif'],
            sans: ["'Open Sans'", 'sans-serif'],
            mono: ["'Roboto Mono'", 'monospace']
        },
        animation: {
            stars: 'shooting-star linear infinite',
            blink: 'blink 1.2s linear infinite'
        },
        keyframes: {
            'shooting-star': {
                '0%': {
                    transform: 'rotate(210deg) translateX(0)',
                    opacity: '0.8'
                },
                '100%': {
                    transform: 'rotate(210deg) translateX(-100vw)',
                    opacity: '0'
                }
            },
            'blink': {
                '0%, 29%, 81%, 100%': {
                    opacity: '1'
                },
                '30%, 80%': {
                    opacity: '0'
                }
            }
        }
    },
    screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
  },
  plugins: [],
}
