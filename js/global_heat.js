$(function() {
    var dataset; //the full dataset

    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +700 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // setup x 
    var xValue = function (d) { return d.Year; }, // data -> value
        xMap = function (d) { return xScale(xValue(d)); }; // data -> display

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
    
    var tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

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
            .attr("y", 17)
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
            .style('stroke', 'red')
            .style('stroke-width', '2px')
            .style('fill', 'none')
            .attr("d", line)
            .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(d, i){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
                                        .html("(" + dataset[i].Year + ", " + dataset[i]["Lowess Smoothing"] + ")" +
                                            "<br/> Annual Mean " + dataset[i]["Annual Mean"]);})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    }
});
