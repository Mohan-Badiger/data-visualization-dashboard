import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, field = "sector", title = "Sector Distribution" }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const processedData = d3.rollup(
            data.filter(d => d[field]),
            v => v.length,
            d => d[field]
        );

        let chartData = Array.from(processedData, ([key, count]) => ({ key, count }))
            .sort((a, b) => b.count - a.count);

        // Group smaller slices into "Others" if too many
        if (chartData.length > 5) {
            const top5 = chartData.slice(0, 5);
            const others = chartData.slice(5).reduce((acc, curr) => acc + curr.count, 0);
            chartData = [...top5, { key: "Others", count: others }];
        }

        if (chartData.length === 0) return;

        const width = 300;
        const height = 300;
        const margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove();

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 dark:bg-gray-700 pointer-events-none")
            .style("opacity", 0);

        const svg = svgEl
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Use a color scale that supports more distinct values
        const color = d3.scaleOrdinal()
            .domain(chartData.map(d => d.key))
            .range(d3.schemeSet3);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const data_ready = pie(chartData);

        const arc = d3.arc()
            .innerRadius(60) // Donut style
            .outerRadius(radius);

        const arcHover = d3.arc()
            .innerRadius(60)
            .outerRadius(radius + 10); // Expands on hover

        const slices = svg.selectAll('slices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('fill', d => color(d.data.key))
            .attr("stroke", "white")
            .attr("class", "dark:stroke-dark-card cursor-pointer")
            .style("stroke-width", "2px")
            .style("opacity", 0.9);

        // Entry Animation
        slices.transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t);
                    return arc(d);
                }
            });

        // Hover Effect
        slices.on("mouseenter", function (event, d) {
            d3.select(this)
                .transition().duration(300)
                .attr("d", arcHover) // Expand
                .style("opacity", 1)
                .attr("filter", "brightness(1.1)");

            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <div class="font-bold text-center">${d.data.key}</div>
                <div class="text-center text-xs">Count: <span class="font-mono text-blue-300 text-base ml-1">${d.data.count}</span></div>
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
                    .transition().duration(300)
                    .attr("d", arc) // Contract
                    .style("opacity", 0.9)
                    .attr("filter", "none");

                tooltip.transition().duration(200).style("opacity", 0);
            });

        return () => tooltip.remove();

    }, [data, field]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 flex flex-col items-center h-full shadow-lg border border-light-border dark:border-dark-border">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4 w-full text-left">{title}</h4>
            <div className="relative h-64 w-64">
                {(!data || data.length === 0) ? (
                    <div className="flex items-center justify-center h-full text-light-text-secondary dark:text-dark-text-secondary">No Data Available</div>
                ) : (
                    <svg ref={svgRef} className="w-full h-full"></svg>
                )}
            </div>
        </div>
    );
};

export default PieChart;
