$(function () {
    //create window for viz
    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        //width = d3.select('#greenhouse_gas_vis').attr('width')
        width = +700 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom
        //height = d3.select('#greenhouse_gas_vis').attr('height')

        console.log(d3.select('#greenhouse_gas_vis').attr('width'))
     var svg = d3.select("#greenhouse_gas_vis")
        .append("svg")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('height', '100%')
        .attr('width', '100%')
        ;
    
    var x = d3.scaleLinear()                
        .range([0, width]);
    
    var y = d3.scaleLinear()
        .range([height, 0]);

    let dataline = d3.line()
        .x(function(d) { return x(d.decimal_date)})
        .y(function(d) {return y(d.average)}) 
    
    let line400 = d3.line()
        .x(function(d) {; return x(d.decimal_date)})
        .y(function(d) {return y(400)})


    d3.csv('../data/co2data_monthly_clean.csv', function (data) {
        
        //calls the method to draw the viz
        drawVis(data)

        function drawVis(data) {

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            x.domain([d3.min(data, function (d, i) { return data[i].decimal_date }), d3.max(data, function (d, i) { return data[i].decimal_date })])

            y.domain([d3.min(data, function (d, i) { return data[i].average }), d3.max(data, function (d, i) { return data[i].average })])

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


            svg.append("text")             
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                    (height + margin.top + 15) + ")")
                .style("text-anchor", "middle")
                .text("Year");

            svg.append("text")
             
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("CO2 PPM (parts per million)");
        }
    });
});