export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Semantic Semantic Colors mapped to CSS Variables
                app: {
                    bg: 'var(--color-bg)',
                    card: 'var(--color-card)',
                    text: {
                        primary: 'var(--color-text-primary)',
                        secondary: 'var(--color-text-secondary)'
                    },
                    border: 'var(--color-border)',
                },

                // Legacy support (optional, can map to vars too if needed, but keeping for direct specific use)
                light: {
                    bg: '#F3F4F6',
                    card: '#FFFFFF',
                    text: { primary: '#1F2937', secondary: '#6B7280' },
                    border: '#E5E7EB',
                },
                dark: {
                    bg: '#0F172A',
                    card: '#1E293B',
                    text: { primary: '#F8FAFC', secondary: '#94A3B8' },
                    border: '#334155',
                },
                primary: {
                    DEFAULT: '#3B82F6',
                    hover: '#2563EB',
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
