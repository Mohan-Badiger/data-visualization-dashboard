import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-light-card dark:bg-dark-card overflow-hidden shadow-sm rounded-xl p-5 transition-shadow duration-300 hover:shadow-md border border-light-border dark:border-dark-border">
            <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary truncate">
                            {title}
                        </dt>
                        <dd>
                            <div className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                                {value}
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
            {/* Optional Trend Indicator */}
            {trend && (
                <div className={`mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary ml-1">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
