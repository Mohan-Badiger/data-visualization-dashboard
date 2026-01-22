import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const processedData = d3.rollup(
            data.filter(d => d.end_year && d.intensity),
            v => d3.mean(v, d => d.intensity),
            d => d.end_year
        );

        const chartData = Array.from(processedData, ([year, intensity]) => ({ year: parseInt(year), intensity }))
            .sort((a, b) => a.year - b.year);

        if (chartData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(chartData, d => d.year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.intensity) || 10])
            .range([height, 0]);

        // Add X Gridlines
        svg.append("g")
            .attr("class", "chart-grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(-height).tickFormat("").ticks(5))
            .select(".domain").remove();

        // Add Y Gridlines
        svg.append("g")
            .attr("class", "chart-grid")
            .call(d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(5))
            .select(".domain").remove();

        // Axes
        svg.append("g")
            .attr("class", "chart-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(5));

        svg.append("g")
            .attr("class", "chart-axis")
            .call(d3.axisLeft(y).ticks(5));

        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.intensity))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(chartData)
            .attr("fill", "none")
            .attr("stroke", "#3B82F6") // Blue-500
            .attr("stroke-width", 3)
            .attr("d", line)
            .attr("filter", "drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.3))");

        svg.selectAll(".dot")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.intensity))
            .attr("r", 5)
            .attr("fill", "#3B82F6")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("class", "dark:stroke-dark-card")
            .append("title")
            .text(d => `Year: ${d.year}\nIntensity: ${d.intensity.toFixed(1)}`);

    }, [data]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 h-full">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Intensity Trend</h4>
            <div className="relative h-64 w-full">
                {(!data || data.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary">No Data Available</div>
                ) : (
                    <svg ref={svgRef} className="w-full h-full overflow-visible"></svg>
                )}
            </div>
        </div>
    );
};

export default LineChart;
