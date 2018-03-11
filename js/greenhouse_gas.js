/**
 * Reads in and creates the visual for greenhouse gas concentrations.
 * Draws the line chart and includes interactive buttons for the audience
 * to learn more
 */

$(function () {
    //create window for viz
    let margin = { top: 220, right: 20, bottom: 40, left: 60 },
        width = +700 - margin.left - margin.right,
        height = +900 - margin.top - margin.bottom

     let svg = d3.select("#greenhouse_gas_vis")
        .append("svg")
        .attr('height', '100%')
        .attr('width', '100%');
    
    // defines data range
    let x = d3.scaleLinear()                
        .range([0, width]);
    let y = d3.scaleLinear()
        .range([height, 0]);

    // draws line of CO2 readings
    let dataline = d3.line()
        .x(function(d) { return x(d.decimal_date)})
        .y(function(d) {return y(d.average)}) 
    
    // draws the red line indicating 400 ppm threshold
    let line400 = d3.line()
        .x(function(d) {; return x(d.decimal_date)})
        .y(function(d) {return y(400)})

    // reads in the CO2 values
    d3.csv('data/co2data_monthly_clean.csv', function (data) {
        
        //calls the method to draw the viz
        drawVis(data)

        // draws the lines for the data
        function drawVis(data) {
            
            //sets the domain
            x.domain([1958, 2016]);
            y.domain([300, 450]);

            svg.append('path')
                .data([data])
               .attr("class", "line")
               .attr("transform", "translate(60,0)")
               .style('fill', 'none')
               .style('stroke', 'blue')
               .style('stroke-width', '2px')
                .attr("d", dataline);

            svg.append('path')
                .data([data])
               .attr("class", "line")
               .attr("transform", "translate(60,0)")
               .style('stroke', 'red')
               .style('stroke-width', '3px')
                .attr("d", line400); 

            //draws axis
            svg.append("g")
                        .attr("transform", "translate(60," + height + ")")
                        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
            svg.append("g")
            .attr("transform", "translate(60,0)")
                .call(d3.axisLeft(y).tickFormat(d3.format("d")));

            // adds x axis label
            svg.append("text")             
                .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text("Year");

            // adds y axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text("CO2 PPM (parts per million)");
            
            // Adds title to the visual
            svg.append("text")
                .attr("x", width - 200)             
                .attr("y", 20)
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")  
                .style("font-size", "24px") 
                .text("Greenhouse Gas Increases Over Time");
        }

        // defines data to create interactive buttons
        let buttonData = [{label: "What is the significance of 400 ppm?", x:250, y:185, button:1, class:"ppm", 
                            text1:"400 ppm means out of every 1 million particles of",
                            text2: "air, 400 of them are carbon dioxide. This is a threshold",
                            text3: "that hasn't been reached since the stone age."},
                        {label: "Why are there such dense oscillations?", x:475, y:500, button:2, class:"cycles", 
                            text1:"These fluctuations represent the seasonal cycle",
                            text2: "the occurs with the increased uptake of carbon",
                            text3: "dioxide by plants during growing season."}]

        // creates buttons for different interactions
        let button = d3.button()
            .on("press", function(d, i) {showText(d.text1, d.text2, d.text3, d.x, d.y, d.button, d.class)})
            .on("release", function(d, i) {removeText(d.class)});
        
        let buttons = svg.selectAll(".button")
            .data(buttonData)
        .enter()
            .append("g")
            .attr("class", "button")
            .call(button);
        
        // apends text to answer question on button pressed
        function showText(text1, text2, text3, x, y, num, className) {
            if(num === 1) {
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 170)
                    .attr("y", y + 60)
                    .text(text1)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 170)
                    .attr("y", y + 80)
                    .text(text2)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 170)
                    .attr("y", y + 100)
                    .text(text3)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
            } else {
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 180)
                    .attr("y", y + 40)
                    .text(text1)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 180)
                    .attr("y", y + 60)
                    .text(text2)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 180)
                    .attr("y", y + 80)
                    .text(text3)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
            }
        }

        // removes text on unclick
        function removeText(className) {
            d3.selectAll("." + className).remove();
        }

    });
});