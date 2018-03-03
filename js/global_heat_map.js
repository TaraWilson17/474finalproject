$(function() {
    var width = 1000;
    var height = 500;
    
    var dataset;

    var svg = d3.select("#global_heat_pattern_vis").append("svg")
    
    var projection = d3.geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2])

    var path = d3.geoPath()
      .projection(projection);
    
    var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json(url, function(err, geojson) {
      svg.append("path")
        .attr("d", path(geojson))
    })

    d3.csv("data/global_heat_index_data.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                //d.Year = parseTime(d.Year);
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude;
                d["1976-1977"] = +d["1976-1977"];
        });
        dataset = data;

        drawVis(dataset);
    });

    function drawVis(data) {
        svg.selectAll("circle")
            .data([data]).enter()
            .append("circle")
            .attr("cx", function (d) { console.log(0); return projection(d)[0].Latitude; })
            .attr("cy", function (d) { return projection(d).Longitude; })
            .attr("r", "10px")
            .attr("fill", "red")
    }
});
