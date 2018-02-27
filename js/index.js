// Settings object
var settings = {
    showX: true, 
    showY:false,
  }
  // SVG to work with
  var svg = d3.select('#vis')
    .append('svg')
    .attr('height', 400)
    .attr('width', 500)
  
  // Circle positioning function
  
  // ********* Change the "cy" attribute to reflect the showY setting ********
  var circleFunc = function(circle) {
      circle.attr('r', 15)
            .attr('fill', 'blue')
            .attr('cx', function(d) { return settings.showX == true ? xScale(d.x) : 100})
            .attr('cy', function(d) { return settings.showY == true ? yScale(d.y) : 100})
  }
  
  // Reusable drawing function
  var draw = function(data) {
      // Bind self.settings.data
      var circles = svg.selectAll('circle').data(data)
      
      // Enter new elements
      circles.enter().append('circle').call(circleFunc)
      
      // Exit elements that may have left
      circles.exit().remove()
      
      // Transition all circles to new dself.settings.data
      svg.selectAll('circle').transition().duration(1500).call(circleFunc)  
  }
  
  // Define data, xScale, yScale
  
//   var xScale = d3.scale.linear().range([100,200]).domain([0,5])
//   var yScale = d3.scale.linear().range([100,200]).domain([0,5])
  
  // ******* Change the showX and showY function for some cases ********
  var update = function(value) {
    switch(value) {
      case 1:
        var data = [{x:1, y:2}, {x:4, y:4}, {x:3, y:1}]
        break;
      case 2: 
        var data = [{x:3, y:2}, {x:4, y:4}]
        settings.showX = true
        settings.showY = true
        break;
      case 3: 
        var data = [{x:3, y:2}, {x:4, y:4}]
         settings.showX = false
         break;
      case 4: 
        var data = [{x:3, y:2}, {x:4, y:4}]
         settings.showY = false
         break;
      default:
        settings.showX = true
        settings.showY = true
        var data = [{x:1, y:1},{x:2, y:2},{x:3, y:3}]
        break;
    }
    draw(data)
  }
//   // setup scroll functionality
//   var scroll = scroller()
//       .container(d3.select('#graphic'));
  
//   // pass in .step selection as the steps
//   scroll(d3.selectAll('.step'));
  
//   // Pass in desired update function
  
  
//   // Pass the update function to the scroll object
//   scroll.update(update)