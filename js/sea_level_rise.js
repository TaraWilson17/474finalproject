// $(function() {
//     loadSeaLevelData();

//     function loadSeaLevelData() {
//         d3.csv("data/sea_level_data.csv", function (error, data) {
//             if (error) return console.warn(error);
//             data.forEach(function (d) {
//                 d.Year = +d.Year;
//                 d.SeaLevel = +d.Adjusted_sea_level_inches;
//                 d.LowerBound = +d.Lower_error_bound;
//                 d.UpperBound = +d.Upper_error_bound;
//             });
//         let dataset = data
//         drawSeaLevel(dataset);
//         });
//     }

//     function drawSeaLevel(data) { 
//         let sl_svg = d3.select("#sea_level_rise_vis").append("svg")
//             .attr("width", "97%")
//             .attr("height", 500);
//         // {/* <svg id="fillgauge1" width="97%" height="250" onclick="gauge1.update(NewValue());"></svg>

//         let sl_configure = liquidFillGaugeSettings();
//         let sl_fill = loadLiquidFillGauge(sl_svg, 55, sl_configure); //55 is MAX VALUE RIGHT NOW
//     }

//     function liquidFillGaugeSettings() {
//         return {
//             circleColor:"#178BCA",
//             textColor:"#045681",
//             waveTextColor:"#A4DBf8",
//             waveColor:"#178BCA",
//             circleThickness:0.05,
//             textVertPosition:0.5,
//             waveAnimateTime:2000,
//             minValue:0,
//             maxValue:100,
//             circleFillGap:0.05,
//             waveHeight:0.3,
//             waveCount:1,
//             waveRiseTime:7000,
//             waveRise:true,
//             waveHeightScaling:true,
//             waveAnimate:true,
//             waveOffset:0,
//             textSize:1,
//             valueCountUp:true,
//             displayUnit:true
//         };
//     }

//     function loadLiquidFillGauge(gauge, value, config) {
//         var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
//         var locationX = parseInt(gauge.style("width"))/2 - radius;
//         var locationY = parseInt(gauge.style("height"))/2 - radius;
//         var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

//         let waveHeightScale = null;
//         if(config.waveHeightScaling){
//             waveHeightScale = d3.scaleLinear()
//                 .range([0,config.waveHeight,0])
//                 .domain([0,50,100]);
//         } else {
//             waveHeightScale = d3.scaleLinear()
//                 .range([config.waveHeight,config.waveHeight])
//                 .domain([0,100]);
//         }
    
//         const textPixels = (config.textSize*radius/2);
//         const textFinalValue = parseFloat(value).toFixed(2);
//         const textStartValue = config.valueCountUp?config.minValue:textFinalValue;
//         const unitText = config.displayUnit?"in":"";
//         const circleThickness = config.circleThickness * radius;
//         const circleFillGap = config.circleFillGap * radius;
//         const fillCircleMargin = circleThickness + circleFillGap;
//         const fillCircleRadius = radius - fillCircleMargin; ////////////////////////////////////////////////////////////////////
//         const waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
    
//         const waveLength = fillCircleRadius*2/config.waveCount;
//         const waveClipCount = 1+config.waveCount;
//         const waveClipWidth = waveLength*waveClipCount;
    
//         // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
//         let textRounder = function(value){ return Math.round(value); };
//         if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
//             textRounder = function(value){ return parseFloat(value).toFixed(1); };
//         }
//         if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
//             textRounder = function(value){ return parseFloat(value).toFixed(2); };
//         }
    
//         // Data for building the clip wave area.
//         const data = [];
//         for(let i = 0; i <= 40*waveClipCount; i++){
//             data.push({x: i/(40*waveClipCount), y: (i/(40))});
//         }
    
//         // Scales for drawing the outer circle.
//         const gaugeCircleX = d3.scaleLinear().range([0,2*Math.PI]).domain([0,1]);
//         const gaugeCircleY = d3.scaleLinear().range([0,radius]).domain([0,radius]);
    
//         // Scales for controlling the size of the clipping path.
//         const waveScaleX = d3.scaleLinear().range([0,waveClipWidth]).domain([0,1]);
//         const waveScaleY = d3.scaleLinear().range([0,waveHeight]).domain([0,1]);
    
//         // Scales for controlling the position of the clipping path.
//         const waveRiseScale = d3.scaleLinear()
//             // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
//             // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
//             // circle at 100%.
//             .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
//             .domain([0,1]);
//         const waveAnimateScale = d3.scaleLinear()
//             .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
//             .domain([0,1]);
    
//         // Scale for controlling the position of the text within the gauge.
//         const textRiseScaleY = d3.scaleLinear()
//             .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
//             .domain([0,1]);
    
//         // Center the gauge within the parent SVG.
//         const gaugeGroup = gauge.append("g")
//             .attr('transform','translate('+locationX+','+locationY+')');
    
//         // Draw the outer circle.
//         const gaugeCircleArc = d3.arc()
//             .startAngle(gaugeCircleX(0))
//             .endAngle(gaugeCircleX(1))
//             .outerRadius(gaugeCircleY(radius))
//             .innerRadius(gaugeCircleY(radius-circleThickness));
//         gaugeGroup.append("path")
//             .attr("d", gaugeCircleArc)
//             .style("fill", config.circleColor)
//             .attr('transform','translate('+radius+','+radius+')');
    
//         // Text where the wave does not overlap.
//         const text1 = gaugeGroup.append("text")
//             .text(textRounder(textStartValue) + unitText)
//             .attr("class", "liquidFillGaugeText")
//             .attr("text-anchor", "middle")
//             .attr("font-size", textPixels + "px")
//             .style("fill", config.textColor)
//             .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');
//         let text1InterpolatorValue = textStartValue;
    
    
//         // The clipping wave area.
//         const clipArea = d3.area()
//             .x(function(d) { return waveScaleX(d.x); } )
//             .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
//             .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
//         const waveGroup = gaugeGroup.append("defs")
//             .append("clipPath")
//             .attr("id", "clipWave" + gauge);
//         const wave = waveGroup.append("path")
//             .datum(data)
//             .attr("d", clipArea)
//             .attr("T", 0);
    
//         // The inner circle with the clipping wave attached.
//         const fillCircleGroup = gaugeGroup.append("g")
//             .attr("clip-path", "url(#clipWave" + gauge + ")");
//         fillCircleGroup.append("circle")
//             .attr("cx", radius)
//             .attr("cy", radius)
//             .attr("r", fillCircleRadius)
//             .style("fill", config.waveColor);
    
//         // Text where the wave does overlap.
//         const text2 = fillCircleGroup.append("text")
//             .text(textRounder(textStartValue))
//             .attr("class", "liquidFillGaugeText")
//             .attr("text-anchor", "middle")
//             .attr("font-size", textPixels + "px")
//             .style("fill", config.waveTextColor)
//             .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');
//         let text2InterpolatorValue = textStartValue;
    
//         // Make the value count up.
//         if(config.valueCountUp){
//             text1.transition()
//                 .duration(config.waveRiseTime)
//                 .tween("text", function() {
//                   const i = d3.interpolateNumber(text1InterpolatorValue, textFinalValue);
//                   return (t) => {
//                     text1InterpolatorValue = textRounder(i(t));
//                     // Set the gauge's text with the new value and append the % sign
//                     // to the end
//                     text1.text(text1InterpolatorValue + unitText);
//                   }
//                 });
//             text2.transition()
//                 .duration(config.waveRiseTime)
//                 .tween("text", function() { 
//                   const i = d3.interpolateNumber(text2InterpolatorValue, textFinalValue);
//                   return (t) => {
//                     text2InterpolatorValue = textRounder(i(t));
//                     // Set the gauge's text with the new value and append the % sign
//                     // to the end                
//                     text2.text(text2InterpolatorValue + unitText);
//                   }
//                 });
//         }
    
//         // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
//         const waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
//         if(config.waveRise){
//             waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
//                 .transition()
//                 .duration(config.waveRiseTime)
//                 .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
//                 .on("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
//         } else {
//             waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
//         }
    
//         if(config.waveAnimate) animateWave();
    
//         function animateWave() {
//             wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
//             wave.transition()
//                 .duration(config.waveAnimateTime * (1-wave.attr('T')))
//                 .ease(d3.easeLinear)
//                 .attr('transform','translate('+waveAnimateScale(1)+',0)')
//                 .attr('T', 1)
//                 .on('end', function(){
//                     wave.attr('T', 0);
//                     animateWave(config.waveAnimateTime);
//                 });
//         }
//     }


//         //return new GaugeUpdater();
// })