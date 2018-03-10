$(function () {
    //create window for viz
    let margin = { top: 220, right: 20, bottom: 40, left: 60 },
        //width = d3.select('#greenhouse_gas_vis').attr('width')
        width = +700 - margin.left - margin.right,
        height = +900 - margin.top - margin.bottom
        //height = d3.select('#greenhouse_gas_vis').attr('height')

     let svg = d3.select("#greenhouse_gas_vis")
        .append("svg")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('height', '100%')
        .attr('width', '100%');
    
    let x = d3.scaleLinear()                
        .range([0, width]);
    
    let y = d3.scaleLinear()
        .range([height, 0]);

    let dataline = d3.line()
        .x(function(d) { return x(d.decimal_date)})
        .y(function(d) {return y(d.average)}) 
    
    let line400 = d3.line()
        .x(function(d) {; return x(d.decimal_date)})
        .y(function(d) {return y(400)})

    let tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    d3.csv('data/co2data_monthly_clean.csv', function (data) {
        
        //calls the method to draw the viz
        drawVis(data)

        function drawVis(data) {

            let div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            //x.domain([d3.min(data, function (d, i) { return data[i].decimal_date }), d3.max(data, function (d, i) { return data[i].decimal_date })])
            x.domain([1958, 2016]);
            //y.domain([d3.min(data, function (d, i) { return data[i].average }), d3.max(data, function (d, i) { return data[i].average })])
            y.domain([300, 450]);

            svg.append('path')
                .data([data])
               .attr("class", "line")
               .attr("transform", "translate(60,0)")
               .style('fill', 'none')
               .style('stroke', 'blue')
               .style('stroke-width', '2px')
                .attr("d", dataline)
                .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                .on("mousemove", function(data, i){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
                                            .html("(" + Math.round(data[i].decimal_date) + ": " + data[i].average + ")");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

            svg.append('path')
                .data([data])
               .attr("class", "line")
               .attr("transform", "translate(60,0)")
               .style('stroke', 'red')
               .style('stroke-width', '3px')
                .attr("d", line400)
                .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                .on("mousemove", function(d, i){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
                                            .html("(" + data[i].decimal_date + ", " + 400 + ")");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");}); 

            //draws axis
            svg.append("g")
                        .attr("transform", "translate(60," + height + ")")
                        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
            svg.append("g")
            .attr("transform", "translate(60,0)")
                .call(d3.axisLeft(y).tickFormat(d3.format("d")));

            svg.append("text")             
                .attr("transform", "translate(" + (width / 2) + " ," + (height + 40) + ")")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text("Year");

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
                .attr("x", (width / 2))             
                .attr("y", 17)
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")  
                .style("font-size", "24px") 
                .text("Greenhouse Gas Increases Over Time");
        }

        let buttonData = [{label: "What is the significance of 400 ppm?", x:250, y:185, button:1, class:"ppm", 
                            text:"400 ppm means out of every 1 million particles of air, 400 of them are carbon dioxide. This is a threshold that hasn't been reached since the stone age."},
                        {label: "Why are there such dense oscillations?", x:475, y:500, button:2, class:"cycles", text:"These fluctuations represent the seasonal cycle"}]

        let button = d3.button()
            .on("press", function(d, i) {showText(d.text, d.x, d.y, d.button, d.class)})
            .on("release", function(d, i) {removeText(d.class)});
        
        let buttons = svg.selectAll(".button")
            .data(buttonData)
        .enter()
            .append("g")
            .attr("class", "button")
            .call(button);
        
        function showText(text, x, y, num, className) {
            if(num === 1) {
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 170)
                    .attr("y", y +60)
                    .text(text)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
            } else {
                svg.append("text")
                    .attr("class", className)
                    .attr("x", x - 180)
                    .attr("y", y + 40)
                    .text(text)
                    .style("font-size", "20px") 
                    .style("opacity", 1);
            }
        }

        function removeText(className) {
            d3.select("." + className).remove();
        }

    });
});