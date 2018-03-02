$(function() {
    var width = 960,
    height = 500;

var projection = d3.geoAlbersUsa();

var path = d3.geoPath()
	.projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.queue()
    .defer(d3_request.json, "states.json")
    .defer(d3_request.json, "us-state-centroids.json")
    .await(ready);

var us,centroid;

function ready(error, u, c) {
    states = u
    centroid = c
 
   // draw the states
   svg.append("path")
       .attr("class", "states")
       .datum(topojson.feature(states, states.objects.usStates))
       .attr("d", path);

       d3.csv("data/global_heat_index_data.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude;
                d.year = +d["1976-1977"];
        });
        dataset = data;

        drawVis(dataset);
    });
    
    svg.selectAll(".pin")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("transform", function(d) {return "translate(" + projection([d.Longitude,d.Latitude]) + ")";});
    }

}
    
});
