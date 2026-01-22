import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const processedData = d3.rollup(
            data.filter(d => d.sector),
            v => v.length,
            d => d.sector
        );

        let chartData = Array.from(processedData, ([sector, count]) => ({ sector, count }))
            .sort((a, b) => b.count - a.count);

        if (chartData.length > 5) {
            const top5 = chartData.slice(0, 5);
            const others = chartData.slice(5).reduce((acc, curr) => acc + curr.count, 0);
            chartData = [...top5, { sector: "Others", count: others }];
        }

        if (chartData.length === 0) return;

        const width = 300;
        const height = 300;
        const margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(chartData.map(d => d.sector))
            .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']);

        const pie = d3.pie()
            .value(d => d.count);

        const data_ready = pie(chartData);

        const arc = d3.arc()
            .innerRadius(60)
            .outerRadius(radius);

        svg.selectAll('slices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.sector))
            .attr("stroke", "white")
            .attr("class", "dark:stroke-dark-card")
            .style("stroke-width", "2px")
            .style("opacity", 0.9)
            .transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t);
                    return arc(d);
                }
            });

        // Tooltips handled natively by browser or can add sophisticated D3 tooltips if needed
        svg.selectAll('slices')
            .data(data_ready)
            .enter()
            .append('title')
            .text(d => `${d.data.sector}: ${d.data.count}`);


    }, [data]);

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-xl p-4 flex flex-col items-center h-full">
            <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-4 w-full text-left">Sector Distribution</h4>
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
