$(function() {
    var dataset; //the full dataset

    var margin = { top: 20, right: 20, bottom: 40, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // setup x 
    var xValue = function (d) { return d["Year"]; }, // data -> value
        xMap = function (d) { return xScale(xValue(d)); }; // data -> display

    // setup y
    var yValue = function (d) { return d["Lowess Smoothing"]; }, // data -> value
        yMap = function (d) { return yScale(yValue(d)); }; // data -> display

    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/647_Global_Temperature_Data_File.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                d["Year"] = +d["Year"];
                d["Lowess Smoothing"] = +d["Lowess Smoothing"];
        });
        dataset = data;

        drawVis(dataset);
    });

    function drawVis(dataset) {
        svg.selectAll("g")
        .remove();
        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(dataset, xValue) - 1, d3.max(dataset, xValue) + 1]);
        //yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);
        yScale.domain([d3.min(dataset, yValue) + 1, d3.max(dataset, yValue) - 1]);

        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0 ," + height + ")")
        .call(d3.axisBottom(xScale));

        svg.append("text")             
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text("Year");

        // Add the Y Axis
        svg.append("g")
        .call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Lowess Smoothing")
            .style("font-size", "10px");

        var dots = svg.selectAll(".dot")
                      .data(dataset)

            dots.exit().remove()

            dots.enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "black")
            dots
                .attr("cx", xMap)
                .attr("cy", yMap)

    }
});