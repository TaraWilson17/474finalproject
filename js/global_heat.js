/**
 * This file reads in the data for and creates the line graph for the global heat index.
 * Shows the tmemperatue trends and also allows interactive tooltips.
 */

$(function() {
    var dataset; //the full dataset

    // sets up visual area
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +700 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // setup x 
    var xValue = function (d) { return d.Year; }, // data -> value
        xMap = function (d) { return xScale(xValue(d)); }; // data -> display

    // parses date data into year
    var parseTime = d3.timeParse("%Y")
        bisectYear = d3.bisector(function(d) { return d.Year; }).left;

    // setup y
    var yValue = function (d) { return d["Lowess Smoothing"]; }, // data -> value
        yMap = function (d) { return yScale(yValue(d)); }; // data -> display

    var svg = d3.select("#global_heat_index_vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.line()
                .x(function(d) { return xScale(d['Year']);})
                .y(function(d) { return yScale(d["Annual Mean"]);});

    // reads in heat data
    d3.csv("data/647_Global_Temperature_Data_File.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                //d.Year = parseTime(d.Year);
                d.Year = +d.Year;
                d["Lowess Smoothing"] = +d["Lowess Smoothing"]
                d["Annual Mean"] = +d["Annual Mean"];
        });
        dataset = data;

        drawVis(dataset);
    });

    // draws the line and scatterplot for heat index data
    function drawVis(dataset) {

        svg.selectAll("g")
            .remove();

        xScale.domain([1880, 2017]);
        yScale.domain([-0.49, 0.99]);
        
        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0 ," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("text")             
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Year");

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Lowess Smoothing");

        // Adds title to the visual
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 20)
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")  
            .style("font-size", "24px") 
            .text("Planet Heat Increases Over Time");

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

        svg.append("path")
            .data([dataset])
            .attr("class", "line")
            .style("stroke", "red")
            .style("stroke-width", "3px")
            .style("fill", "none")
            .attr("d", line);

        // creates interactive tooltips
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");
    
        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);
    
        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);
    
        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr("x", 15)
            .style("top", (event.pageY-10)+"px")
            .attr("font-weight", "bold")
            .style("font-size", "15px") 
            .attr("dy", ".31em");
    
        svg.append("rect")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .attr("class", "overlay")
            .attr("class", "tooltip")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);
    
        function mousemove() {
            var x0 = xScale.invert(d3.mouse(this)[0]), 
                i = bisectYear(dataset, x0, 1), 
                d0 = dataset[i - 1], 
                d1 = dataset[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + xScale(d.Year) + "," + yScale(d["Annual Mean"]) + ")");
          focus.select("text").text(function() { return d["Annual Mean"]; });
          focus.select(".x-hover-line").attr("y2", height - yScale(d["Annual Mean"]));
          focus.select(".y-hover-line").attr("x2", width + width);
        }

    }
});
