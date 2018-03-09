$(function() {
    var dataset; //the full dataset

    var margin = { top: 20, right: 20, bottom: 40, left: 60 },
        width = +700 - margin.left - margin.right,
        height = +500 - margin.top - margin.bottom

    var xScale = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var yScale = d3.scaleLinear().range([height, 0]);
    
    var carFootPrintYearly = 10484;
    var carMilesDriven = 11398;
    var emissionsFromHome = 5455;
    var emissionsFromGarbage = 692;
    var thisPersonsCar = 220;
    var yourElectricity = 100;
    var yourGarbage = 100;
    var avgDiet = 5767;
    var yourDiet = 5767;

    function colors(x) {
        if(x % 2 == 1) {
            return 'green'
        } else {
            return 'gray'
        }
    }

    var svg_summary = d3.select("#individual_footprint_summary").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var svg = d3.select("#individual_footprint").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var slider = svg.append('g')
        .attr('class', 'slider')
    

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
            console.log(yourElectricity)
            $('#garbageVolumeValue').val(ui.value)
            drawBarGraph();
        }
    })

    $('select').change(function () {
        yourDiet = 365 * d3.select('select').property('value')
        drawBarGraph();
    })
    

    function drawBarGraph() {
        var data = [carFootPrintYearly, thisPersonsCar * 52 * (carFootPrintYearly/carMilesDriven), emissionsFromHome, emissionsFromHome * yourElectricity/100,  emissionsFromGarbage,  emissionsFromGarbage * yourGarbage/100, avgDiet, yourDiet]
       
    var testLabels = [ 'Average Car', ' Your Car', 'Average electricity', 'Your electricity', 'Average garbage', 'Your Garbage', 'Average Diet', 'Your Diet']
        xScale.domain(testLabels)
        yScale.domain([0, 12000])

        svg.selectAll('.bar').remove()

    svg.selectAll(".bar")
      .data(data)
        .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {return xScale(testLabels[i]) })
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


    //svg_summary



    }

    drawBarGraph()
})