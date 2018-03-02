/*var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.linear().range([0, width]);
var yScale = d3.scale.linear().range([height, 0])

var xAxis = d3.svg.axis.scale(xScale)
    .orient('bottom').ticks(8);

var yAxis = d3.svg.axis.scale(yScale)
    .orient('left').ticks(8);

var line = d3.svg.line()
    .xScale(function(d) { return xScale(d.decimal_date);})
    .yScale(function(d) { return yScale(d.average);});


var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

d3.csv('co2data_monthly_clean.csv', function(data) {

    xScale.domain(d3.extent(data, function(d) {return d.decimal_date}))
    yScale.domain([0, d3.max(data, function(d) {return d.average})])

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


});*/