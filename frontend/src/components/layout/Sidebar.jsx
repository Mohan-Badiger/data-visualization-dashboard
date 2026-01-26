import React, { Fragment } from 'react';
import { HomeIcon, ChartBarIcon, PresentationChartLineIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: HomeIcon },
        // { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
        // { name: 'Reports', href: '/reports', icon: PresentationChartLineIcon, current: false },
    ];

    const classNames = (...classes) => {
        return classes.filter(Boolean).join(' ');
    };

    const NavItems = () => (
        <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setSidebarOpen && setSidebarOpen(false)}
                            className={classNames(
                                isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-text-primary dark:hover:text-dark-text-primary',
                                'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out'
                            )}
                        >
                            <item.icon
                                className={classNames(
                                    isActive ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary',
                                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="flex-shrink-0 flex items-center justify-center h-16 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
                                    <Link to="/" className="text-xl font-bold text-light-text-primary dark:text-white tracking-wider hover:text-primary transition-colors cursor-pointer">
                                        BLACKCOFFER
                                    </Link>
                                </div>
                                <NavItems />
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border shadow-sm z-20 transition-colors duration-200">
                    <div className="flex items-center justify-center h-16 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
                        <Link to="/" className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary tracking-wider hover:text-primary transition-colors cursor-pointer">
                            BLACKCOFFER
                        </Link>
                    </div>
                    <NavItems />
                </div>
            </div>
        </>
    );
};

export default Sidebar;