import React, { useEffect } from 'react';
import * as d3 from 'd3';
import useInView from '../../hooks/useInView';

const BarChart = ({ data }) => {
    const [svgRef, isInView] = useInView({ threshold: 0.1 });

    useEffect(() => {
        if (!isInView || !data || data.length === 0) return;

        d3.select(svgRef.current).selectAll("*").remove();

        const processedData = d3.rollup(
            data.filter(d => d.country),
            v => d3.sum(v, d => (d.likelihood || 0) * (d.relevance || 1)), // Weighted Likelihood
            d => d.country
        );

        let chartData = Array.from(processedData, ([country, likelihood]) => ({ country, likelihood }))
            .sort((a, b) => b.likelihood - a.likelihood)
            .slice(0, 10);

        if (chartData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svgEl = d3.select(svgRef.current);
        const svg = svgEl
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 dark:bg-gray-700 pointer-events-none")
            .style("opacity", 0);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(chartData.map(d => d.country))
            .padding(0.4);

        const maxVal = d3.max(chartData, d => d.likelihood) || 10;
        const y = d3.scaleLinear()
            .domain([0, maxVal * 1.1])
            .range([height, 0]);

        // X Axis
        svg.append("g")
            .attr("class", "chart-axis text-gray-500 dark:text-gray-400 font-medium")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y Axis
        svg.append("g")
            .attr("class", "chart-axis text-gray-500 dark:text-gray-400 font-medium")
            .call(d3.axisLeft(y).ticks(5));

        // Gradient
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3B82F6");
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#60A5FA");

        // Bars
        svg.selectAll("mybar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.country))
            .attr("width", x.bandwidth())
            .attr("fill", "url(#bar-gradient)")
            .attr("rx", 4)
            .attr("class", "cursor-pointer")
            // Initial State (height 0)
            .attr("y", height)
            .attr("height", 0)
            // Animation
            .transition()
            .duration(800)
            .ease(d3.easeCubicOut)
            .delay((d, i) => i * 100) // Staggered
            .attr("y", d => y(d.likelihood))
            .attr("height", d => height - y(d.likelihood));

        // Interactions (must re-select after transition)
        svg.selectAll("rect")
            .on("mouseenter", function (event, d) {
                d3.select(this)
                    .transition().duration(200)
                    .attr("opacity", 0.8)
                    .attr("filter", "brightness(1.1)");

                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`
                    <div class="font-bold border-b border-gray-600 mb-1 pb-1">${d.country}</div>
                    <div>Weighted Score: <span class="text-blue-300 font-mono">${d.likelihood.toLocaleString()}</span></div>
                    <div class="text-xs text-gray-400 mt-1">(Likelihood × Relevance)</div>
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function (event, d) {
                d3.select(this)
                    .transition().duration(200)
                    .attr("opacity", 1)
                    .attr("filter", "none");

                tooltip.transition().duration(200).style("opacity", 0);
            });

        return () => {
            tooltip.remove();
        }

    }, [data, isInView]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 h-full shadow-lg border border-light-border dark:border-dark-border">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Top Countries by Weighted Likelihood</h4>
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

export default BarChart;
