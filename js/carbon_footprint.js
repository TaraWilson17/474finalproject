/**
 * This file stores the data for and creates the interactive bar charts and user
 * inputs regarding a carbon footprint
 */

$(function() {
    let dataset; //the full dataset

    let margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +700 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom


    let sum_margin = { top: 20, right: 20, bottom: 40, left: 60 },
        sum_width = +350 - margin.left - margin.right,
        sum_height = +500 - margin.top - margin.bottom

    // sets scales
    let xScale = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    let yScale = d3.scaleLinear().range([height, 0]);

    let sum_xScale = d3.scaleBand()
        .range([0, sum_width])
        .padding(0.1);
    
    // baseline data for all conditions
    let carFootPrintYearly = 10484;
    let carMilesDriven = 11398;
    let emissionsFromHome = 5455;
    let emissionsFromGarbage = 692;
    let thisPersonsCar = 220;
    let yourElectricity = 100;
    let yourGarbage = 100;
    let avgDiet = 5767;
    let yourDiet = 5767;

    // sets bar chart color scheme
    function colors(x) {
        if(x % 2 == 1) {
            return 'green'
        } else {
            return 'gray'
        }
    }

    // sets up svgs for bar charts
    let svg_summary = d3.select("#individual_footprint_summary").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let svg = d3.select("#individual_footprint").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let slider = svg.append('g')
        .attr('class', 'slider')
    
    // creates sliders for value inputs
    $('#MilesDrivenValue').val(220)
    $('#milesDriven').slider({
        range:false, min:0, max:220, value:220, slide: function(event, ui) {
            thisPersonsCar = ui.value
           
            $('#MilesDrivenValue').val(ui.value)
            drawBarGraph()
        }
    })

    $('#electricityBillValue').val(100)
    $('#electricityBill').slider({
        range:false, min:0, max:100, value:100, slide: function(event, ui) {
            yourElectricity = ui.value
            
            $('#electricityBillValue').val(ui.value)
            drawBarGraph();
        }
    })
    
    $('#garbageVolumeValue').val(100)
    $('#garbageVolume').slider({
        range:false, min:0, max:100, value:100, slide: function(event, ui) {
            yourGarbage = ui.value
            
            $('#garbageVolumeValue').val(ui.value)
            drawBarGraph();
        }
    })

    $('select').change(function () {
        yourDiet = 365 * d3.select('select').property('value')
        drawBarGraph();
    })
    
    // draws the bar graph based on current data
    function drawBarGraph() {
        let data = [carFootPrintYearly, thisPersonsCar * 52 * (carFootPrintYearly/carMilesDriven), emissionsFromHome, emissionsFromHome * yourElectricity/100,  emissionsFromGarbage,  emissionsFromGarbage * yourGarbage/100, avgDiet, yourDiet]

        let sum_data = [carFootPrintYearly + emissionsFromHome + emissionsFromGarbage + avgDiet, thisPersonsCar * 52 * (carFootPrintYearly/carMilesDriven) + emissionsFromHome * yourElectricity/100 + emissionsFromGarbage * yourGarbage/100 + yourDiet]
       
    let Labels = [ 'Average Car', ' Your Car', 'Average Electricity', 'Your Electricity', 'Average Garbage', 'Your Garbage', 'Average Diet', 'Your Diet']

    let sum_labels = ['Average Person', 'You']

        xScale.domain(Labels)
        yScale.domain([0, 12000])

        sum_xScale.domain(sum_labels)

        svg.selectAll('.bar').remove()

    svg.selectAll(".bar")
      .data(data)
        .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {return 10 +  xScale(Labels[i]) })
      .attr("width", 50)
      .attr("y", function(d, i) { return yScale(data[i]); })
      .attr("height", function(d, i) { return height - yScale(data[i]) })
      .style('fill', function(d, i) {return colors(i)});

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
     
      .call(d3.axisBottom(xScale));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(yScale));

    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Pounds of CO2");

        // Adds title to the visual
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 480)
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Emission Source");


        svg_summary.selectAll('.bar').remove()

        xScale.domain(sum_labels)
        yScale.domain([0, 25000])

    svg_summary.selectAll(".bar")
      .data(sum_data)
        .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {return 30 + sum_xScale(sum_labels[i]) })
      .attr("width", 50)
      .attr("y", function(d, i) { return yScale(sum_data[i]); })
      .attr("height", function(d, i) { return height - yScale(sum_data[i]) })
      .style('fill', function(d, i) {return colors(i)});

    svg_summary.append("g")
                .attr("transform", "translate(0," + sum_height + ")")
                .call(d3.axisBottom(sum_xScale) );

  // add the y Axis
  svg_summary.append("g")
      .call(d3.axisLeft(yScale));

    svg_summary.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Pounds of CO2");

        // Adds title to the visual
        svg_summary.append("text")
            .attr("x", (sum_width / 2))             
            .attr("y", 476)
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text("Comparison");
    }

     let  models = ["Average Person", "You"]
     let modelColors = ["gray", "green"]

    function drawLegend(legend) {
        //creates the legend elements
       
        var legend = svg.selectAll(".legend")
            .data(models)
            .enter()
            .append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0" + "," + i * 25 +  ")"; });

        // draw legend text
        legend.append("text")
            .attr("x", width - 530)
            .attr("y", 9)
            .attr("font-weight", "bold")
            //.attr("dy", ".ƒ35em")
            //.style("text-anchor", "end")
            .text(function (d, i) {return models[i]; })
        
        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 560)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return modelColors[i]});
    }

    drawBarGraph();
    drawLegend();
})
