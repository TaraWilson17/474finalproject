$(function() {
    var dataset;

    var width = 960,
        height = 500;
    
    var projection = d3.geoAlbersUsa();

    var path = d3.geoPath()
                .projection(projection);

    var svg = d3.select("#greenhouse_gas_vis").append("svg")
                .attr("width", width)
                .attr("height", height);

    d3.queue()
        .defer(d3_request.json, "data/states.json")
        .defer(d3_request.json, "data/us-state-centroids.json")
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
    }
    function drawVis(dataset) {
        svg.selectAll("g")
            .remove();

        var dots = svg.selectAll(".dot")
                      .data(dataset)

            dots.exit().remove()
    }
});
