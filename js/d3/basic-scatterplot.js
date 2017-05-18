!function ($) {
  "use strict";

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var allData = [];
// define the line
//   var valueline = d3.line()
//     .x(function (d) {
//       return x(d.x);
//     })
//     .y(function (d) {
//       return y(d.y);
//     });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
  var svg = d3.select("#basic-scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // d3.csv("./bags/bagplot1.csv", function (error, data) {
  //   var bag1 = data.filter(function(d) { if (d["bag_x"] && d["bag_y"]) { return d; } })
  //                   .map(function(d) { return [ +d["bag_x"], +d["bag_y"] ]; });
  //   var fence1 = data.filter(function(d) { if (d["fence_x"] && d["fence_y"]) { return d; } })
  //                     .map(function(d) { return [ +d["fence_x"], +d["fence_y"] ]; });
  //   var center1 = data.filter(function(d) { if (d["center_x"] && d["center_y"]) { return d; } })
  //                     .map(function(d) { return [ +d["center_x"], +d["center_y"] ]; });
  // });


// Get the data
  d3.csv("./bags/bagplot1.csv", function (error, data) {
    if (error) throw error;

    var bag1 = data.filter(function(d) { if (d["bag_x"] && d["bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["bag_x"], "y": +d["bag_y"] }; });
    var bag1array = bag1.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence1 = data.filter(function(d) { if (d["fence_x"] && d["fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["fence_x"], "y": +d["fence_y"] }; });
    var fence1array = fence1.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center1 = data.filter(function(d) { if (d["center_x"] && d["center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["center_x"], "y": +d["center_y"] }; });

    var allBagplotDots = bag1.concat(fence1).concat(center1);

    // Scale the range of the data
    x.domain(d3.extent(allBagplotDots, function (d) {
      return d.x;
    }));
    y.domain([0, d3.max(allBagplotDots, function (d) {
      return d.y;
    })]);

    // Add the valueline path.
    // svg.append("path")
    //   .data([data])
    //   .attr("class", "line")
    //   .attr("d", valueline);

    // Add the scatterplot
    svg.selectAll("dot")
      .data(allBagplotDots)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function (d) {
        return x(d.x);
      })
      .attr("cy", function (d) {
        return y(d.y);
      });

    // Add hulls
    addHull(bag1array, "bag-hull", "green", 0.5);
    addHull(fence1array, "fence-hull", "green", 0.3);


    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

  });

  function addHull(points, classes, color, opacity) {
    var colorWithOpacity = d3.color(color);
    colorWithOpacity.opacity = opacity;
    svg.append("path")
      .attr("class", classes)
      .attr("stroke", color)
      .attr("fill", colorWithOpacity)
      .datum(d3.polygonHull(points.map(function(d) { return [ x(d[0]), y(d[1]) ]; })))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });
  }


}(jQuery);