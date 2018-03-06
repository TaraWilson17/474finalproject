$(function() {
    var dataset; //the full dataset

    var margin = { top: 20, right: 20, bottom: 40, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear().range([0, width]);
    //var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    var carFootPrintYearly = 10484;
    var carMilesDriven = 11398;
    var emissionsFromHome = 5455;
    var emissionsFromGarbage = 692;
    var yearlyEmissions = [carFootPrintYearly, emissionsFromHome, emissionsFromGarbage]
    var labels = ['Car', 'Home Electricity Usage', 'Emissions from Garbage']

    var svg = d3.select("#individual_footprint").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $('#milseInput').on('change', function() {
        console.log(this.value)
        $('.slider_label').html(this.value);
    })
  

    function drawBarGraph( ) {
        svg.append('g').call(slider)
            
    }
})