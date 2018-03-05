$(function() {
    var dataset; //the full dataset

    var margin = { top: 20, right: 20, bottom: 40, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear().range([0, width]);
    //var xScale = d3.scaleTime().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    var carFootPrintYearly = 10484;


}