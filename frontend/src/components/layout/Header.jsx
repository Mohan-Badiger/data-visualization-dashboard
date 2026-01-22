import React, { Fragment } from 'react';
import { Bars3Icon, BellIcon, SunIcon, MoonIcon, UserCircleIcon, Cog8ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();

    const notifications = [
        { id: 1, text: "New data insights available", time: "2 min ago" },
        { id: 2, text: "System maintenance scheduled", time: "1 hour ago" },
        { id: 3, text: "Report generated successfully", time: "3 hours ago" },
    ];

    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ');
    };

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
                    <Link to="/" className="flex-1 flex text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary ml-4 md:ml-0 hover:text-primary transition-colors">
                        Dashboard
                    </Link>
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

                        {/* Notifications Dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <Menu.Button className="bg-transparent p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    {/* Notification Dot */}
                                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-dark-card"></span>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-dark-card py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-light-border dark:border-dark-border">
                                    <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Notifications</p>
                                    </div>
                                    {notifications.map((item) => (
                                        <Menu.Item key={item.id}>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? 'bg-gray-100 dark:bg-dark-bg' : '',
                                                        'block px-4 py-3 text-sm text-light-text-secondary dark:text-dark-text-secondary border-b border-light-border dark:border-dark-border last:border-0'
                                                    )}
                                                >
                                                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">{item.text}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                    <div className="px-4 py-2 text-center">
                                        <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover">View all</a>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-light-card dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                                        A
                                    </div>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-dark-card py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-light-border dark:border-dark-border">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-dark-bg' : '',
                                                    'flex px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary items-center'
                                                )}
                                            >
                                                <UserCircleIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Your Profile
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-dark-bg' : '',
                                                    'flex px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary items-center'
                                                )}
                                            >
                                                <Cog8ToothIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Settings
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#"
                                                className={classNames(
                                                    active ? 'bg-gray-100 dark:bg-dark-bg' : '',
                                                    'flex px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary items-center border-t border-light-border dark:border-dark-border'
                                                )}
                                            >
                                                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Sign out
                                            </a>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
