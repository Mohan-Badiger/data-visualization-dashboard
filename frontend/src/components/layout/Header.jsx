import React from 'react';
import { Bars3Icon, BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ setSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="relative bg-light-card dark:bg-dark-card shadow-sm z-10 transition-colors duration-200 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between h-16 px-6">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1 rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 flex justify-between items-center">
                    <div className="flex-1 flex text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary ml-4 md:ml-0">
                        Dashboard
                    </div>
                    <div className="ml-4 flex items-center md:ml-6 space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary focus:outline-none transition-transform active:scale-95"
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="h-6 w-6" />
                            ) : (
                                <MoonIcon className="h-6 w-6" />
                            )}
                        </button>

                        <button className="bg-transparent p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary focus:outline-none">
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown placeholder */}
                        <div className="ml-3 relative">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
