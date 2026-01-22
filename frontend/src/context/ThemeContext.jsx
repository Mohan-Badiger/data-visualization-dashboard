import React, { createContext, useContext, useEffect, useState, useLayoutEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // useLayoutEffect ensures class is applied before paint, preventing potential flash
    useLayoutEffect(() => {
        const root = window.document.documentElement;

        // Disable transitions effectively before the switch
        root.classList.add('disable-transitions');

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);

        // Re-enable transitions immediately after the DOM update cycle
        // Using requestAnimationFrame to ensure it happens in the next frame
        const timeout = setTimeout(() => {
            root.classList.remove('disable-transitions');
        }, 0); // Immediate release, or usually slightly more if needed, but 0 often works for avoiding the initial transition.

        return () => clearTimeout(timeout);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
