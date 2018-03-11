/**
 * Reads in data for and creates the map visual. Updates in biyearly incriments from
 * 1976-2017. Also allows for replay of annimation and creates color legend
 */

$(function() {
    // scales the data values
    let color = d3.scaleLinear()
        .domain([-1.5, -1, -0.5, 0, 0.5, 1, 1.5])
        .range(["#2166ac", "#67a9cf", "#d1e5f0", "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"]);

    // sets up color legend
    let leg = d3.select("#map_legend").append("svg");
    leg 
        .attr("height", 70)
        .attr("width", 350);
    leg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");
    let legendLinear = d3.legendColor()
        .shapeWidth(40)
        .cells(7)
        .orient("horizontal")
        .scale(color);
    leg.select(".legendLinear")
        .call(legendLinear);

    // sets width and height for visual
    let width = 1000;
    let height = 500;
    
    let dataset;

    let svg = d3.select("#global_heat_pattern_vis").append("svg");
    
    let projection = d3.geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2])

    // draws actual map land from geojson
    let path = d3.geoPath()
      .projection(projection);
    let url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json(url, function(err, geojson) {
      svg.append("path")
        .attr("d", path(geojson))
    })

    // reads in annual heat index data
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

        for(let i = 0; i < 21; i++) {
            setTimeout(drawVis, i * 1000, dataset, 1976 + (i * 2) + "", 1977 + (i * 2) + "");
        }

        // allows button for replay of annimation
        let animateMap = document.createElement("button");
        animateMap.classList.add("ml-5","btn", "btn-dark", "text-center", "text-light");
        let t = document.createTextNode("Reanimate Map");
        animateMap.appendChild(t);
        animateMap.onclick = function(){for(let i = 0; i < 21; i++) {
                                                setTimeout(drawVis, i * 1000, dataset, 1976 + (i * 2) + "", 1977 + (i * 2) + "");
                                            }};
        document.querySelector("#reanimate_graph_button").appendChild(animateMap);
        
    });

    // draws the map with current data selection by adding circles on lat and long coordinate
    // following divergent color scheme and labels current years desplayed in title
    function drawVis(data, startYear, endYear) {
        d3.selectAll(".mapTitle").remove();

        let color = d3.scaleLinear()
            .domain([-1.5, -1, -0.5, 0, 0.5, 1, 1.5])
            .range(["#2166ac", "#67a9cf", "#d1e5f0", "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"]);

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
        
        svg.append("text")
            .attr("x", 140)
            .attr("y", 520)
            .attr("z", 100)
            .attr("class", "mapTitle")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("font-size", "34px")
            .text(startYear + "-" + endYear);
    }
    
});

