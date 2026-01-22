import React, { useState, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { getFilters } from '../../services/api';

const FilterPanel = ({ filters, onFilterChange }) => {
    const [filterOptions, setFilterOptions] = useState({
        end_years: [],
        topics: [],
        sectors: [],
        regions: [],
        pestles: [],
        sources: [],
        swots: [],
        countries: [],
        cities: []
    });

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const data = await getFilters();
                setFilterOptions(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Failed to load filter options", error);
            }
        };
        fetchFilters();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // If value is "", we send it, but parent/API handler should ignore it or remove it.
        // User req: "When filter value === "": Do NOT send it to backend". 
        // Best handled in api.js or parent, but we can clean here too.
        // Actually, updating state with "" is fine, the API call logic filters it out.
        onFilterChange({ ...filters, [name]: value });
    };

    const handleReset = () => {
        onFilterChange({});
    };

    const Select = ({ name, options, label, value }) => (
        <div className="flex flex-col">
            <label className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wide mb-1">{label}</label>
            <div className="relative">
                <select
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-light-border dark:border-dark-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 bg-white dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary transition-colors"
                >
                    <option value="" className="dark:bg-dark-bg">All</option>
                    {options && options.map((opt, idx) => (
                        <option key={idx} value={opt} className="dark:bg-dark-bg">{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <div className="bg-light-card dark:bg-dark-card shadow-sm rounded-xl p-5 mb-6 border border-light-border dark:border-dark-border">
            <div className="flex items-center mb-4 border-b border-light-border dark:border-dark-border pb-2">
                <FunnelIcon className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary mr-2" />
                <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">Filters</h3>
                <button
                    onClick={handleReset}
                    className="ml-auto text-sm text-primary hover:text-primary-hover font-medium"
                >
                    Reset All
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Select name="end_year" label="End Year" options={filterOptions.end_years} value={filters.end_year} />
                <Select name="topic" label="Topic" options={filterOptions.topics} value={filters.topic} />
                <Select name="sector" label="Sector" options={filterOptions.sectors} value={filters.sector} />
                <Select name="region" label="Region" options={filterOptions.regions} value={filters.region} />
                <Select name="pestle" label="PESTLE" options={filterOptions.pestles} value={filters.pestle} />
                <Select name="source" label="Source" options={filterOptions.sources} value={filters.source} />
                <Select name="swot" label="SWOT" options={filterOptions.swots} value={filters.swot} />
                <Select name="country" label="Country" options={filterOptions.countries} value={filters.country} />
                <Select name="city" label="City" options={filterOptions.cities} value={filters.city} />
            </div>
        </div>
    );
};

export default FilterPanel;
