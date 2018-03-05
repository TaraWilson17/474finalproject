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
        setTimeout(drawVis, 0, dataset, "1976", "1977");
        setTimeout(drawVis, 1000, dataset, "1978", "1979");
        setTimeout(drawVis, 2000, dataset, "1980", "1981");
        setTimeout(drawVis, 3000, dataset, "1982", "1983");
        setTimeout(drawVis, 4000, dataset, "1984", "1985");
        setTimeout(drawVis, 5000, dataset, "1986", "1987");
        setTimeout(drawVis, 6000, dataset, "1988", "1989");
        setTimeout(drawVis, 7000, dataset, "1990", "1991");
        setTimeout(drawVis, 8000, dataset, "1992", "1993");
        setTimeout(drawVis, 9000, dataset, "1994", "1995");
        setTimeout(drawVis, 10000, dataset, "1996", "1997");
        setTimeout(drawVis, 11000, dataset, "1998", "1999");
        setTimeout(drawVis, 12000, dataset, "2000", "2001");
        setTimeout(drawVis, 13000, dataset, "2002", "2003");
        setTimeout(drawVis, 14000, dataset, "2004", "2005");
        setTimeout(drawVis, 15000, dataset, "2006", "2007");
        setTimeout(drawVis, 16000, dataset, "2008", "2009");
        setTimeout(drawVis, 17000, dataset, "2010", "2011");
        setTimeout(drawVis, 18000, dataset, "2012", "2013");
        setTimeout(drawVis, 19000, dataset, "2014", "2015");
        setTimeout(drawVis, 20000, dataset, "2016", "2017");
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

