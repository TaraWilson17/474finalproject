(function(d3) {
    let idGenerator = (function() {
        let count = 0;
        return function(prefix) {
            return prefix + "-" + count++;
        };
    })();

    loadSeaLevelData();

    function loadSeaLevelData() {
        d3.csv("data/sea_level_data.csv", function (error, data) {
            if (error) return console.warn(error);
            data.forEach(function (d) {
                d.Year = +d.Year;
                d.SeaLevel = +d.Adjusted_sea_level_inches;
                d.LowerBound = +d.Lower_error_bound;
                d.UpperBound = +d.Upper_error_bound;
            });
        let dataset = data

        drawSeaLevel();
        });
    }

    //function drawSeaLevel(data, fillVal) { 
    function drawSeaLevel() { 
        let animateSeaLevel = document.createElement("button");
        animateSeaLevel.classList.add("mt-5", "ml-0", "btn", "btn-outline-dark", "text-center");
        let t = document.createTextNode("Click to watch how global sea level has risen since 1880");
        animateSeaLevel.appendChild(t);
        animateSeaLevel.onclick = function(){loadLiquidFillGauge(sl_svg, 8.98, sl_configure)};
        document.querySelector("#sea_level_rise_button").appendChild(animateSeaLevel);

        let sl_svg = d3.select("#sea_level_rise_vis").append("svg")
            .attr("width", "97%")
            .attr("height", 500);

        let sl_configure = defaultConfig;
    }

    let defaultConfig = {
        // Values
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.

        // Styles
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        backgroundColor: null, // The color of the background
        waveColor: "#178BCA", // The color of the fill wave.
        width: 0, // You might want to set the width and height if it is not detected properly by the plugin
        height: 0,

        // Gradient
        fillWithGradient: false, // Controls if the wave should be filled with gradient
        gradientPoints: [0, 0, 1., 1.], //  [x1, y1, x2, y2], coordinates for gradient start point(x1,y1) and final point(x2,y2)
        gradientFromColor: "#FFF",
        gradientToColor: "#000",

        // Waves
        waveHeight: 0.005, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 4, // The number of full waves per width of the wave circle.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.

        // Animations
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveRiseTime: 10000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveRiseAtStart: true, // If set to false and waveRise at true, will disable only the initial animation
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading and updating. If false, the final value is displayed.
        valueCountUpAtStart: true, // If set to false and valueCountUp at true, will disable only the initial animation

        // Text
        textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        displayUnit: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8", // The color of the value text when the wave overlaps it.
    };

    function loadLiquidFillGauge(g, value, settings) {
        d3.selectAll(".liquidFillGaugeText").remove(); 
        // Handle configuration
        let config = d3.map(defaultConfig);
        d3.map(settings).each(function(val, key) {
            config.set(key, val);
        });

        g.each(function(d) {
            let gauge = d3.select(this);

            let width = config.get("width") !== 0 ? config.get("width") : parseInt(gauge.style("width"));
            let height = config.get("height") !== 0 ? config.get("height") : parseInt(gauge.style("height"));
            let radius = Math.min(width, height) / 2;
            let locationX = width / 2 - radius;
            let locationY = height / 2 - radius;
            //let fillPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), ((value / 15)/100))) / config.get("maxValue"); //FIX THIS!!!
            let fillPercent = Math.max((10 * value), 0) / (config.get("maxValue") / 10);

            let waveHeightScale;
            if (config.get("waveHeightScaling")) {
                waveHeightScale = d3.scaleLinear()
                    .range([0, config.get("waveHeight"), 0])
                    .domain([0, 50, 100]);
            } else {
                waveHeightScale = d3.scaleLinear()
                    .range([config.get("waveHeight"), config.get("waveHeight")])
                    .domain([0, 100]);
            }

            let textPixels = (config.get("textSize") * radius / 2);
            let textFinalValue = parseFloat(value).toFixed(2);
            let textStartValue = config.get("valueCountUp") ? config.get("minValue") : textFinalValue;
            let percentText = config.get("displayUnit") ? "in" : "";
            let circleThickness = config.get("circleThickness") * radius;
            let circleFillGap = config.get("circleFillGap") * radius;
            let fillCircleMargin = circleThickness + circleFillGap;
            let fillCircleRadius = radius - fillCircleMargin;
            let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

            let waveLength = fillCircleRadius * 2 / config.get("waveCount");
            let waveClipCount = 1 + config.get("waveCount");
            let waveClipWidth = waveLength * waveClipCount;

            // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
            let textRounder = function(value) {
                return Math.round(value) /10;
            };
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(1);
                };
            }
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(2);
                };
            }

            // Data for building the clip wave area.
            let data = [];
            for (let i = 0; i <= 40 * waveClipCount; i++) {
                data.push({
                    x: i / (40 * waveClipCount),
                    y: (i / (40))
                });
            }

            // Scales for drawing the outer circle.
            let gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
            let gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

            // Scales for controlling the size of the clipping path.
            let waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
            let waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

            // Scales for controlling the position of the clipping path.
            let waveRiseScale = d3.scaleLinear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
                .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
                .domain([0, 1]);
            let waveAnimateScale = d3.scaleLinear()
                .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
                .domain([0, 1]);

            // Scale for controlling the position of the text within the gauge.
            let textRiseScaleY = d3.scaleLinear()
                .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
                .domain([0, 1]);

            // Center the gauge within the parent
            let gaugeGroup = gauge.append("g")
                .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

            // Draw the background circle
            if (config.get("backgroundColor")) {
                gaugeGroup.append("circle")
                    .attr("r", radius)
                    .style("fill", config.get("backgroundColor"))
                    .attr('transform', 'translate(' + radius + ',' + radius + ')');
            }

            // Draw the outer circle.
            let gaugeCircleArc = d3.arc()
                .startAngle(gaugeCircleX(0))
                .endAngle(gaugeCircleX(1))
                .outerRadius(gaugeCircleY(radius))
                .innerRadius(gaugeCircleY(radius - circleThickness));
            gaugeGroup.append("path")
                .attr("d", gaugeCircleArc)
                .style("fill", config.get("circleColor"))
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            // Text where the wave does not overlap.
            let text1 = gaugeGroup.append("text")
                .attr("class", "liquidFillGaugeText")
                .attr("text-anchor", "middle")
                .attr("font-size", textPixels + "px")
                .style("fill", config.get("textColor"))
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

            // The clipping wave area.
            let clipArea = d3.area()
                .x(function(d) {
                    return waveScaleX(d.x);
                })
                .y0(function(d) {
                    return waveScaleY(Math.sin(Math.PI * 2 * config.get("waveOffset") * -1 + Math.PI * 2 * (1 - config.get("waveCount")) + d.y * 2 * Math.PI));
                })
                .y1(function(d) {
                    return (fillCircleRadius * 2 + waveHeight);
                });

            let gaugeGroupDefs = gaugeGroup.append("defs");

            let clipId = idGenerator("clipWave");
            let waveGroup = gaugeGroupDefs
                .append("clipPath")
                .attr("id", clipId);
            let wave = waveGroup.append("path")
                .datum(data)
                .attr("d", clipArea);

            // The inner circle with the clipping wave attached.
            let fillCircleGroup = gaugeGroup.append("g")
                .attr("clip-path", "url(#" + clipId + ")");
            fillCircleGroup.append("circle")
                .attr("cx", radius)
                .attr("cy", radius)
                .attr("r", fillCircleRadius);

            if (config.get("fillWithGradient")) {
                let points = config.get("gradientPoints");
                let gradientId = idGenerator("linearGradient");
                let grad = gaugeGroupDefs.append("linearGradient")
                    .attr("id", gradientId)
                    .attr("x1", points[0])
                    .attr("y1", points[1])
                    .attr("x2", points[2])
                    .attr("y2", points[3]);
                grad.append("stop")
                    .attr("offset", "0")
                    .attr("stop-color", config.get("gradientFromColor"));
                grad.append("stop")
                    .attr("offset", "1")
                    .attr("stop-color", config.get("gradientToColor"));

                fillCircleGroup.style("fill", "url(#" + gradientId + ")");
            } else {
                fillCircleGroup.style("fill", config.get("waveColor"));
            }

            // Text where the wave does overlap.
            let text2 = fillCircleGroup.append("text")
                .attr("class", "liquidFillGaugeText")
                .attr("text-anchor", "middle")
                .attr("font-size", textPixels + "px")
                .style("fill", config.get("waveTextColor"))
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

            // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
            let waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;

            if (config.get("waveAnimate")) {
                let animateWave = function() {
                    wave.transition()
                        .duration(config.get("waveAnimateTime"))
                        .ease(d3.easeLinear)
                        .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                        .on("end", function() {
                            wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                            animateWave();
                        });
                };
                animateWave();
            }

            let transition = function(from, to, riseWave, animateText) {
                // Update texts and animate
                if (animateText) {
                    let textTween = function() {
                        let that = d3.select(this);
                        let i = d3.interpolate(from, to);
                        return function(t) {
                            that.text(textRounder(i(t)) + percentText);
                        };
                    };
                    text1.transition()
                        .duration(config.get("waveRiseTime"))
                        .tween("text", textTween);
                    text2.transition()
                        .duration(config.get("waveRiseTime"))
                        .tween("text", textTween);
                } else {
                    text1.text(textRounder(to) + percentText);
                    text2.text(textRounder(to) + percentText);
                }

                // Update the wave
                toPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), to)) / config.get("maxValue");
                fromPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), from)) / config.get("maxValue");

                if (riseWave) {
                    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fromPercent) + ')')
                        .transition()
                        .duration(config.get("waveRiseTime"))
                        .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent * 10) + ')');
                } else {
                    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent) + ')');
                }
            };

            transition(
                textStartValue,
                textFinalValue,
                config.get("waveRise") && config.get("waveRiseAtStart"),
                config.get("valueCountUp") && config.get("valueCountUpAtStart")
            );

            // Event to update the value
            gauge.on("valueChanged", function(newValue) {
                transition(value, newValue, config.get("waveRise"), config.get("valueCountUp"));
                value = newValue;
            });

            gauge.on("destroy", function() {
                // Stop all the transitions
                text1.interrupt().transition();
                text2.interrupt().transition();
                waveGroup.interrupt().transition();
                wave.interrupt().transition();

                // Unattach events
                gauge.on("valueChanged", null);
                gauge.on("destroy", null);
            });
        });
    };
})(d3)
