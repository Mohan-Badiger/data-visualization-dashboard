import React, { useEffect } from 'react';
import * as d3 from 'd3';
import useInView from '../../hooks/useInView';

const RegionChart = ({ data }) => {
    const [svgRef, isInView] = useInView({ threshold: 0.1 });

    useEffect(() => {
        if (!isInView || !data || data.length === 0) return;

        // Clean up
        d3.select(svgRef.current).selectAll("*").remove();

        // Process Data: Count by Region
        const regionCounts = d3.rollup(
            data,
            v => v.length,
            d => d.region || "Unknown"
        );

        let chartData = Array.from(regionCounts, ([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 regions

        if (chartData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        // Scales
        const x = d3.scaleBand()
            .range([0, width])
            .domain(chartData.map(d => d.region))
            .padding(0.4);

        const maxVal = d3.max(chartData, d => d.count) || 10;
        const y = d3.scaleLinear()
            .domain([0, maxVal * 1.1])
            .range([height, 0]);

        // Axes
        svg.append("g")
            .attr("class", "chart-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("class", "chart-axis")
            .call(d3.axisLeft(y).ticks(5));

        // Bars
        svg.selectAll("mybar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.region))
            .attr("width", x.bandwidth())
            .attr("fill", "#10B981") // Emerald-500
            .attr("rx", 4)
            .attr("y", height)
            .attr("height", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 50)
            .attr("y", d => y(d.count))
            .attr("height", d => height - y(d.count));

        // Interactions
        svg.selectAll("rect")
            .on("mouseenter", function (event, d) {
                d3.select(this).attr("opacity", 0.8);
                tooltip.style("opacity", 1)
                    .html(`<strong>${d.region}</strong><br/>Count: ${d.count}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseleave", function () {
                d3.select(this).attr("opacity", 1);
                tooltip.style("opacity", 0);
            });

        return () => tooltip.remove();

    }, [data, isInView]);

    return (
        <div className="h-full w-full">
            <h4 className="text-lg font-bold text-app-text-primary mb-4 p-2">Insights by Region</h4>
            <div className="relative h-64 w-full">
                {(!data || data.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-app-text-secondary">No Data Available</div>
                ) : (
                    <svg ref={svgRef} className="w-full h-full overflow-visible"></svg>
                )}
            </div>
        </div>
    );
};

export default RegionChart;
