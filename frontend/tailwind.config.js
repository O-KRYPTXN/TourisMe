/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Dark Mode Color Palette
                dark: {
                    900: '#0d0628', // Deepest background
                    800: '#120a33', // Slightly lighter
                    700: '#1a1040', // Card backgrounds
                    600: '#23154d', // Elevated surfaces
                    500: '#2d1a5a', // Hover states
                },
                primary: {
                    50: '#fef3f0',
                    100: '#fde6e0',
                    200: '#fbc9bc',
                    300: '#f8a78e',
                    400: '#f5947a',
                    500: '#f2856d', // Main coral accent
                    600: '#e06b52',
                    700: '#c4503a',
                    800: '#a03d2d',
                    900: '#7d3025',
                },
                secondary: {
                    50: '#e6f0ff',
                    100: '#b3d1ff',
                    200: '#80b3ff',
                    300: '#4d94ff',
                    400: '#1a75ff',
                    500: '#034aa6', // Main blue
                    600: '#023d8a',
                    700: '#02306e',
                    800: '#012352',
                    900: '#011636',
                },
                accent: {
                    coral: '#f2856d',
                    blue: '#034aa6',
                    purple: '#0d0628',
                    neon: {
                        coral: '#ff9d85',
                        blue: '#4d94ff',
                        purple: '#a855f7',
                    }
                },
            },
            fontFamily: {
                sans: ['Montserrat', 'system-ui', 'sans-serif'],
                display: ['Montserrat', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #0d0628 0%, #120a33 50%, #034aa6 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(242, 133, 109, 0.1) 0%, rgba(3, 74, 166, 0.1) 100%)',
                'neon-glow': 'linear-gradient(135deg, rgba(242, 133, 109, 0.3) 0%, rgba(3, 74, 166, 0.3) 100%)',
            },
            boxShadow: {
                'neon-coral': '0 0 20px rgba(242, 133, 109, 0.4), 0 0 40px rgba(242, 133, 109, 0.2)',
                'neon-blue': '0 0 20px rgba(3, 74, 166, 0.4), 0 0 40px rgba(3, 74, 166, 0.2)',
                'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glass-hover': '0 12px 48px rgba(0, 0, 0, 0.4)',
                'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 8s ease infinite',
            },
            keyframes: {
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(242, 133, 109, 0.4)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(242, 133, 109, 0.6)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
