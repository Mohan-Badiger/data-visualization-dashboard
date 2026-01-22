export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Professional Color System
                light: {
                    bg: '#F3F4F6',        // Gray-100 (Soft Neutral)
                    card: '#FFFFFF',      // White (Elevated Surface)
                    text: {
                        primary: '#1F2937', // Gray-800 (Near Black)
                        secondary: '#6B7280' // Gray-500 (Muted)
                    },
                    border: '#E5E7EB',    // Gray-200 (Subtle)
                },
                dark: {
                    bg: '#0F172A',        // Slate-900 (Deep Neutral)
                    card: '#1E293B',      // Slate-800 (Lighter than bg)
                    text: {
                        primary: '#F8FAFC', // Slate-50 (Near White)
                        secondary: '#94A3B8' // Slate-400 (Muted)
                    },
                    border: '#334155',    // Slate-700 (Subtle)
                },
                primary: {
                    DEFAULT: '#3B82F6',  // Blue-500
                    hover: '#2563EB',    // Blue-600
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
