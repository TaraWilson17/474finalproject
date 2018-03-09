$(function() {
    // parse the date / time
    let parseTime = d3.timeParse("%Y");

    d3.csv("data/model_proj_20C3M.csv", function (error, data) {
        if (error) return console.warn(error);
        data.forEach(function(d) {
            d.d20C3M_Year = d.year;
            d.d20C3M = +d.d20C3M;
        });
        let d20C3Mdata = data;

        let d20C3Mline = d3.line()
            .x(function(d) {return x(d.year); })
            .y(function(d) {return y(d.d20C3M); });

        drawLine(d20C3Mdata, d20C3Mline, "black");
    })

    d3.csv("data/model_proj_A1B.csv", function (error, data) {
        if (error) return console.warn(error);
        data.forEach(function(d) {
            d.A1B_Year = parseTime(d.Year);
            d.A1B = +d.A1B;
        });
        let A1Bdata = data;
        
        let A1Bline = d3.line()
            .x(function(d) {return x(d.year); })
            .y(function(d) {return y(d.A1B); });

        drawLine(A1Bdata, A1Bline, "green");
    })

    d3.csv("data/model_proj_A2.csv", function (error, data) {
        if (error) return console.warn(error);
        data.forEach(function(d) {
            d.A2_Year = parseTime(d.Year);
            d.A2 = +d.A2;
        });
        let A2data = data;
        
        let A2line = d3.line()
            .x(function(d) {return x(d.year); })
            .y(function(d) {return y(d.A2); });

        drawLine(A2data, A2line, "blue");
    })

    d3.csv("data/model_proj_B1.csv", function (error, data) {
        if (error) return console.warn(error);
        data.forEach(function(d) {
            d.B1_Year = parseTime(d.Year);
            d.B1 = +d.B1;
        });
        let B1data = data;

        let B1line = d3.line()
            .x(function(d) {return x(d.year); })
            .y(function(d) {return y(d.B1); });

        drawLine(B1data, B1line, "red");
    })

    d3.csv("data/model_proj_commit.csv", function (error, data) {
        if (error) return console.warn(error);
        data.forEach(function(d) {
            d.commit_Year = parseTime(d.Year);
            d.commit = +d.commit;
        });
        let commitdata = data;

        let commitline = d3.line()
            .x(function(d) {return x(d.year); })
            .y(function(d) {return y(d.commit); });

        drawLine(commitdata, commitline, "purple");
    })

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 40, left: 60 },
    width = +700 - margin.left - margin.right,
    height = +500 - margin.top - margin.bottom


// set the ranges
let x = d3.scaleLinear().range([0, width])
    .domain([1900, 2100]);

let y = d3.scaleLinear().range([height, 0])
    .domain([-1, 4]);

//   // Scale the range of the data ///////////////////////////////FIX THIS!!!!!!!!
//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.close; })]);


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select("#projection_vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // Add label to the x-axis
    svg.append("text")             
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Year");
    
    // adds y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text("Climate Prediction"); 
    
    // Adds title to the visual
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 17)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .text("Climate Model Projections");

    let colors = ["green", "blue", "red", "purple"];
    let models = ["A1B", "A2", "B1", "commit"];

    var tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden");

    drawLegend();

    function drawLegend() {
        //creates the legend elements
        let legend = svg.selectAll(".legend")
            .data(models)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0" + "," + i * 25 +  ")"; });

        // draw legend text
        legend.append("text")
            .attr("x", width - 530)
            .attr("y", 9)
            .attr("font-weight", "bold")
            .attr("dy", ".ƒ35em")
            //.style("text-anchor", "end")
            .text(function (d, i) {return models[i]; })
        
        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 560)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colors[i]});
    }


    function drawLine(data, line, color) {
        // Add the valueline path.
        svg.append("path")
            .data([data])
            .style("fill", "none")
            .style("stroke-width", "4px")
            .style("stroke", color)
            .attr("d", line);
    }

});