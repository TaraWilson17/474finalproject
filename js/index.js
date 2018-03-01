// Settings object
let settings = {
    showX: true, 
    showY:false,
  }
  // SVG to work with
  let svg = d3.select('#vis')
    .append('svg')
    .attr('height', 400)
    .attr('width', 500)
  
  // Circle positioning function
  
  // ********* Change the "cy" attribute to reflect the showY setting ********
  let circleFunc = function(circle) {
      circle.attr('r', 15)
            .attr('fill', 'blue')
            .attr('cx', function(d) { return settings.showX == true ? xScale(d.x) : 100})
            .attr('cy', function(d) { return settings.showY == true ? yScale(d.y) : 100})
  }
  
  // Reusable drawing function
  let draw = function(data) {
      // Bind self.settings.data
      let circles = svg.selectAll('circle').data(data)
      
      // Enter new elements
      circles.enter().append('circle').call(circleFunc)
      
      // Exit elements that may have left
      circles.exit().remove()
      
      // Transition all circles to new dself.settings.data
      svg.selectAll('circle').transition().duration(1500).call(circleFunc)  
  }
  
  // Define data, xScale, yScale
  
//   let xScale = d3.scale.linear().range([100,200]).domain([0,5])
//   let yScale = d3.scale.linear().range([100,200]).domain([0,5])
  
  // ******* Change the showX and showY function for some cases ********
  let update = function(value) {
    switch(value) {
      case 1:
        let data = [{x:1, y:2}, {x:4, y:4}, {x:3, y:1}]
        break;
      case 2: 
        let data = [{x:3, y:2}, {x:4, y:4}]
        settings.showX = true
        settings.showY = true
        break;
      case 3: 
        let data = [{x:3, y:2}, {x:4, y:4}]
         settings.showX = false
         break;
      case 4: 
        d3.csv("data/sea_level_data.csv", function (error, data) {
            if (error) return console.warn(error);
                data.forEach(function (d) {
                    d.Year = +d.Year;
                    d.SeaLevel = +d.Adjusted_sea_level_inches;
                    d.LowerError = +d.Lower_error_bound;
                    d.UpperError = +d.Upper_error_bound;
            });
            let sl_dataset = data;
        });
        drawSeaLevel(sl_dataset);
         settings.showY = false
         break;
      default:
        settings.showX = true
        settings.showY = true
        let data = [{x:1, y:1},{x:2, y:2},{x:3, y:3}]
        break;
    }
    draw(data)
  }
//   // setup scroll functionality
//   let scroll = scroller()
//       .container(d3.select('#graphic'));
  
//   // pass in .step selection as the steps
//   scroll(d3.selectAll('.step'));
  
//   // Pass in desired update function
  
  
//   // Pass the update function to the scroll object
//   scroll.update(update)