import * as d3 from "d3";
import senate_topline from "../_data/senate_topline";

var margin = {top: 35, right:20, bottom:100, left:40};

var container = d3.select('#senate')
var containerWidth = container.node().offsetWidth;
var containerHeight = 400;

var chartWidth = containerWidth - margin.right - margin.left;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg')
            //.attr("viewBox",'0 0 600 400')
            .attr("width",containerWidth)
            .attr("height",containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

var xDomain = senate_topline.map(d => d.candidate);
var yDomain = [0,d3.max(senate_topline.map(d => d.total_spending))];

var xScale = d3.scaleBand()
              .domain(xDomain)
              .range([0, chartWidth])
              .padding(0.1);

var yScale = d3.scaleLinear()
              .domain(yDomain)
              .range([chartHeight, 0]);

var formatAxis = d3.format("$.1s");

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale)
              .tickFormat(formatAxis)
              .tickSize(-chartWidth)
              .ticks(4);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
          .style("text-anchor", "end")
          .style("font-size","14px")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-60)");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("font-size","14px");

var tooltip = svg.append('text')
    .attr('class', 'chart-tooltip');

svg.selectAll('.bar')
        .data(senate_topline)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.candidate))
        .attr('y', d => yScale(d.total_spending))
        .attr('width', xScale.bandwidth())
        .attr('height', d => chartHeight - yScale(d.total_spending))
        .attr("fill",function(d, i){
          if(d.party == "D"){
            return "#5e77d1"
          }else if (d.party == "R") {
            return "#c4515c"
          }else {
            return "#fff59c";
          }
        })
        .on('mouseenter', function(d) {
          // centers the text above each bar
          var x = xScale(d.candidate) + xScale.bandwidth() / 2;
          // the - 5 bumps up the text a bit so it's not directly over the bar
          var y = yScale(d.total_spending) - 5;
          d3.select(this).classed('highlight', true);
          tooltip.text(d3.format("$,.0f")(d.total_spending))
              .attr('transform',`translate(${x + 16}, ${y - 4}) rotate (-5)`)
            })
        .on('mouseleave', function(d) {
          d3.select(this).classed('highlight', false);
          tooltip.text('');
        });

// At the end of the _charts.js file
console.log('hello, this is my charts file!');
