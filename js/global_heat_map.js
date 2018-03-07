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
    
    var url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json(url, function(err, geojson) {
      svg.append("path")
        .attr("d", path(geojson))
    })

    d3.csv("data/global_heat_index_data.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                d.Latitude = +d.Latitude;
                d.Longitude = +d.Longitude;
                d["1976-1977"] = +d["1976-1977"];
                d["1978-1979"] = +d["1978-1979"];
                d["1980-1981"] = +d["1980-1981"];
                d["1982-1983"] = +d["1982-1983"];
                d["1984-1985"] = +d["1984-1985"];
                d["1986-1987"] = +d["1986-1987"];
                d["1988-1989"] = +d["1988-1989"];
                d["1990-1991"] = +d["1990-1991"];
                d["1992-1993"] = +d["1992-1993"];
                d["1994-1995"] = +d["1994-1995"];
                d["1996-1997"] = +d["1996-1997"];
                d["1998-1999"] = +d["1998-1999"];
                d["2000-2001"] = +d["2000-2001"];
                d["2002-2003"] = +d["2002-2003"];
                d["2004-2005"] = +d["2004-2005"];
                d["2006-2007"] = +d["2006-2007"];
                d["2008-2009"] = +d["2008-2009"];
                d["2010-2011"] = +d["2010-2011"];
                d["2012-2013"] = +d["2012-2013"];
                d["2014-2015"] = +d["2014-2015"];
                d["2016-2017"] = +d["2016-2017"];

        });
        dataset = data;

        //drawVis(dataset, "1976", "1977");
        for(var i = 0; i < 21; i++) {
            setTimeout(drawVis, i * 1000, dataset, 1976 + (i * 2) + "", 1977 + (i * 2) + "");
        }
    });

    var color = d3.scaleLinear()
        .domain([-1, -0.5, 0, 0.5, 1, 1.5, 2])
        .range(["#2166ac", "#67a9cf", "#d1e5f0", "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"]);

    function drawVis(data, startYear, endYear) {
        let circles = svg.selectAll("circle")
            .data(data)
        circles.exit().remove()
        circles.enter()
            .append("circle")
            .attr("cx", function(d) { return projection([d.Longitude, d.Latitude])[0];})
            .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1];; })
            .attr("r", "3px")
            .style("fill", function(d) { 
                let years = startYear + '-' + endYear;
                return color(d[years]); 
            });
        circles
            .style("fill", function(d) { 
                let years = startYear + '-' + endYear;
                return color(d[years]); 
            });
    }
    
});

