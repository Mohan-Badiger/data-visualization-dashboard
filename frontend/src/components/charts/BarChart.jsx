import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const processedData = d3.rollup(
            data.filter(d => d.country),
            v => d3.mean(v, d => d.likelihood),
            d => d.country
        );

        let chartData = Array.from(processedData, ([country, likelihood]) => ({ country, likelihood }))
            .sort((a, b) => b.likelihood - a.likelihood)
            .slice(0, 10);

        if (chartData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(chartData.map(d => d.country))
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, 5])
            .range([height, 0]);

        // X Axis
        svg.append("g")
            .attr("class", "chart-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y Axis
        svg.append("g")
            .attr("class", "chart-axis")
            .call(d3.axisLeft(y));

        // Gradient
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3B82F6"); // Blue-500
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#60A5FA"); // Blue-400

        svg.selectAll("mybar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.country))
            .attr("y", d => y(d.likelihood))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.likelihood))
            .attr("rx", 4)
            .attr("fill", "url(#bar-gradient)")
            .on("mouseenter", function (event, d) {
                d3.select(this).attr("opacity", 0.8);
            })
            .on("mouseleave", function (event, d) {
                d3.select(this).attr("opacity", 1);
            })
            .append("title")
            .text(d => `Country: ${d.country}\nLikelihood: ${d.likelihood.toFixed(2)}`);

    }, [data]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 h-full">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Top Likelihood by Country</h4>
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
