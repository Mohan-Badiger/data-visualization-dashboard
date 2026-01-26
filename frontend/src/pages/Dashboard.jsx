import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/filters/FilterPanel';
import { getInsights } from '../services/api';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import BubbleChart from '../components/charts/BubbleChart';
import PieChart from '../components/charts/PieChart';
import RegionChart from '../components/charts/RegionChart';
import StatCard from '../components/common/StatCard';
import { LightBulbIcon, FireIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
    const [filters, setFilters] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        avgIntensity: 0,
        topTopic: 'N/A',
        topRegion: 'N/A'
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getInsights(filters);
                const fetchedData = result.data || [];
                setData(fetchedData);
                calculateStats(fetchedData);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const calculateStats = (data) => {
        if (!data.length) return;

        const total = data.length;
        const avgIntensity = (data.reduce((acc, curr) => acc + (curr.intensity || 0), 0) / total).toFixed(1);

        // Find top topic
        const topics = {};
        data.forEach(d => { if (d.topic) topics[d.topic] = (topics[d.topic] || 0) + 1; });
        const topTopic = Object.keys(topics).reduce((a, b) => topics[a] > topics[b] ? a : b, 'N/A');

        // Find top region
        const regions = {};
        data.forEach(d => { if (d.region) regions[d.region] = (regions[d.region] || 0) + 1; });
        const topRegion = Object.keys(regions).reduce((a, b) => regions[a] > regions[b] ? a : b, 'N/A');

        setStats({ total, avgIntensity, topTopic, topRegion });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Insights"
                    value={stats.total}
                    icon={LightBulbIcon}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Avg Intensity"
                    value={stats.avgIntensity}
                    icon={FireIcon}
                    color="bg-red-500"
                    trend={2.4}
                />
                <StatCard
                    title="Top Topic"
                    value={stats.topTopic}
                    icon={ChartBarIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Top Region"
                    value={stats.topRegion}
                    icon={GlobeAltIcon}
                    color="bg-green-500"
                />
            </div>

            {/* Filters */}
            <div className="transition-all duration-300 ease-in-out">
                <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>

            {loading && <div className="text-center py-10 text-primary font-medium">Loading data...</div>}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2 bg-light-card dark:bg-dark-card rounded-xl shadow-sm p-1 border border-light-border dark:border-dark-border transition-transform hover:scale-[1.005] duration-300">
                    <LineChart data={data} />
                </div>

                <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm p-1 border border-light-border dark:border-dark-border transition-transform hover:scale-[1.01] duration-300">
                    <BarChart data={data} />
                </div>
                <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm p-1 border border-light-border dark:border-dark-border transition-transform hover:scale-[1.01] duration-300">
                    <BubbleChart data={data} />
                </div>

                <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm p-1 border border-light-border dark:border-dark-border transition-transform hover:scale-[1.01] duration-300">
                    <PieChart data={data} />
                </div>
                <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-sm p-1 border border-light-border dark:border-dark-border transition-transform hover:scale-[1.01] duration-300">
                    <RegionChart data={data} />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-light-card dark:bg-dark-card shadow-sm rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
                <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-lg leading-6 font-bold text-light-text-primary dark:text-dark-text-primary">Recent Insights</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                        <thead className="bg-light-bg dark:bg-dark-bg">
                            <tr>
                                {['Title', 'Sector', 'Topic', 'Year', 'Region'].map((head) => (
                                    <th key={head} scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-light-card dark:bg-dark-card divide-y divide-light-border dark:divide-dark-border">
                            {data.slice(0, 10).map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-light-bg dark:hover:bg-dark-bg transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate max-w-xs" title={item.title || item.insight}>
                                        {item.title || item.insight || <span className="text-gray-400 dark:text-gray-600">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {item.sector || <span className="text-gray-400 dark:text-gray-600">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {item.topic ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {item.topic}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-600">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {item.end_year || <span className="text-gray-400 dark:text-gray-600">—</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {item.region || <span className="text-gray-400 dark:text-gray-600">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
