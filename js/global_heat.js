$(function() {
    //var patt = new RegExp("All");
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

    // // setup fill color
    // var cValue = function (d) { return d["Employment Type"]; },
    //     color = d3.scaleOrdinal(d3.schemeCategory10);

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
            // .style("fill", function (d) { return color(cValue(d)); })
            // .on("mouseover", function (d) {
            //     tooltip.transition()
            //         .duration(200)
            //         .style("opacity", .9);
            //     tooltip.html(d["Job Class Title"]  + "<br/> Quarter 1 "+ 
            //         d["Q1 Payments"] + "<br/> Quarter 2 " + d["Q2 Payments"] +
            //         "<br/> Quarter 3 " + d["Q3 Payments"] +
            //         "<br/> Quarter 4 " + d["Q4 Payments"] +  
            //         "<br/> Average Health Cost " + d["Average Health Cost"] + 
            //         "<br/> Average Dental Cost " + d["Average Dental Cost"] + 
            //         "<br/> Average Basic Life " + d["Average Basic Life"] +
            //         "<br/> (" + xValue(d) + ", " + (yValue(d) * 1000) + ")")
            //         .style("left", (d3.event.pageX + 5) + "px")
            //         .style("top", (d3.event.pageY - 28) + "px");
            // })
            // .on("mouseout", function (d) {
            //     tooltip.transition()
            //         .duration(500)
            //         .style("opacity", 0);
            // });
            dots
                .attr("cx", xMap)
                .attr("cy", yMap)

/*         // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0" + "," + i * 25 + ")"; }); */

/*         // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color); */

        // draw legend text
        legend.append("text")
            .attr("x", width - 16)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; })
        
        // add the tooltip area to the webpage
        // var tooltip = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);
        
        // document.querySelector('#selectForm').onchange = function() {
        //     filterType(this.value)
        // }
    }

    // function filterType(type) {
    //     //add code to filter to mytype and rerender vis here
    //     var res = patt.test(type);
    //     if(res){
    //         drawVis(dataset);
    //     } else{
    //         var ndata = dataset.filter(function(d) {
    //             return d['Department Title'] == type;
    //         });
    //         drawVis(ndata);
    //     }
    // }
});