import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const chartData = data.filter(d => d.relevance && d.likelihood && d.intensity && d.topic).slice(0, 50);

        if (chartData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove();

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 dark:bg-gray-700 pointer-events-none")
            .style("opacity", 0);

        const svg = svgEl
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.relevance) || 10])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.likelihood) || 10])
            .range([height, 0]);

        const z = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.intensity) || 10])
            .range([4, 25]); // Slightly larger bubbles

        const myColor = d3.scaleOrdinal()
            .domain(chartData.map(d => d.topic))
            .range(d3.schemeSet2);

        // X Axis
        svg.append("g")
            .attr("class", "chart-axis text-gray-500 dark:text-gray-400 font-medium")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y Axis
        svg.append("g")
            .attr("class", "chart-axis text-gray-500 dark:text-gray-400 font-medium")
            .call(d3.axisLeft(y));

        const bubbles = svg.append('g')
            .selectAll("dot")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.relevance))
            .attr("cy", d => y(d.likelihood))
            .attr("r", 0) // Start at 0 for animation
            .style("fill", d => myColor(d.topic))
            .style("opacity", "0.7")
            .attr("stroke", "white")
            .attr("class", "dark:stroke-dark-card cursor-pointer hover:opacity-100")
            .style("stroke-width", 1);

        // Animation
        bubbles.transition()
            .duration(1000)
            .ease(d3.easeElasticOut) // Bouncy effect
            .delay((d, i) => i * 10)
            .attr("r", d => z(d.intensity));

        // Interaction
        bubbles.on("mouseenter", function (event, d) {
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 1)
                .attr("stroke", "#333") // Highlight border
                .attr("stroke-width", 2);

            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <div class="font-bold border-b border-gray-600 mb-1 pb-1">${d.topic}</div>
                <div class="space-y-0.5">
                    <div class="flex justify-between gap-4"><span>Relevance:</span> <span class="text-blue-300 font-mono">${d.relevance}</span></div>
                    <div class="flex justify-between gap-4"><span>Likelihood:</span> <span class="text-green-300 font-mono">${d.likelihood}</span></div>
                    <div class="flex justify-between gap-4"><span>Intensity:</span> <span class="text-red-300 font-mono">${d.intensity}</span></div>
                </div>
             `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function () {
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7)
                    .attr("stroke", "white")
                    .attr("stroke-width", 1);

                tooltip.transition().duration(200).style("opacity", 0);
            });

        return () => tooltip.remove();

    }, [data]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 h-full shadow-lg border border-light-border dark:border-dark-border">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Relevance vs Likelihood</h4>
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

export default BubbleChart;
