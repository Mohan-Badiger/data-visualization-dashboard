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

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
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
            .range([4, 20]);

        const myColor = d3.scaleOrdinal()
            .domain(chartData.map(d => d.topic))
            .range(d3.schemeSet2);

        // X Axis
        svg.append("g")
            .attr("class", "chart-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y Axis
        svg.append("g")
            .attr("class", "chart-axis")
            .call(d3.axisLeft(y));

        svg.append('g')
            .selectAll("dot")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.relevance))
            .attr("cy", d => y(d.likelihood))
            .attr("r", d => z(d.intensity))
            .style("fill", d => myColor(d.topic))
            .style("opacity", "0.7")
            .attr("stroke", "white")
            .attr("class", "dark:stroke-dark-card")
            .style("stroke-width", 1)
            .append("title")
            .text(d => `Topic: ${d.topic}\nRelevance: ${d.relevance}\nLikelihood: ${d.likelihood}\nIntensity: ${d.intensity}`);

    }, [data]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 h-full">
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
