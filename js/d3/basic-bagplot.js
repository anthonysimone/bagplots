!function ($) {
  "use strict";

  // init variables
  var xAxis, yAxis, allBagplots;

  var bagplotElement = d3.select('#basic-bagplot');

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = parseInt(bagplotElement.style('width')) - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var allData = [];

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
  var svg = bagplotElement.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


// Get the data
  d3.csv("./bags/all-bagplots.csv", function (error, data) {
    if (error) throw error;

    // bagplot1
    var bag1 = data.filter(function(d) { if (d["s1_bag_x"] && d["s1_bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s1_bag_x"], "y": +d["s1_bag_y"] }; });
    var bag1array = bag1.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence1 = data.filter(function(d) { if (d["s1_fence_x"] && d["s1_fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s1_fence_x"], "y": +d["s1_fence_y"] }; });
    var fence1array = fence1.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center1 = data.filter(function(d) { if (d["s1_center_x"] && d["s1_center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s1_center_x"], "y": +d["s1_center_y"] }; });

    // bagplot2
    var bag2 = data.filter(function(d) { if (d["s2_bag_x"] && d["s2_bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s2_bag_x"], "y": +d["s2_bag_y"] }; });
    var bag2array = bag2.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence2 = data.filter(function(d) { if (d["s2_fence_x"] && d["s2_fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s2_fence_x"], "y": +d["s2_fence_y"] }; });
    var fence2array = fence2.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center2 = data.filter(function(d) { if (d["s2_center_x"] && d["s2_center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s2_center_x"], "y": +d["s2_center_y"] }; });

    // bagplot3
    // var bag3 = data.filter(function(d) { if (d["s3_bag_x"] && d["s3_bag_y"]) { return d; } })
    //   .map(function(d) { return { "x": +d["s3_bag_x"], "y": +d["s3_bag_y"] }; });
    // var bag3array = bag3.map(function(d) { return [ +d["x"], +d["y"] ]; });
    // var fence3 = data.filter(function(d) { if (d["s3_fence_x"] && d["s3_fence_y"]) { return d; } })
    //   .map(function(d) { return { "x": +d["s3_fence_x"], "y": +d["s3_fence_y"] }; });
    // var fence3array = fence3.map(function(d) { return [ +d["x"], +d["y"] ]; });
    // var center3 = data.filter(function(d) { if (d["s3_center_x"] && d["s3_center_y"]) { return d; } })
    //   .map(function(d) { return { "x": +d["s3_center_x"], "y": +d["s3_center_y"] }; });

    // bagplot4
    var bag4 = data.filter(function(d) { if (d["s4_bag_x"] && d["s4_bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s4_bag_x"], "y": +d["s4_bag_y"] }; });
    var bag4array = bag4.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence4 = data.filter(function(d) { if (d["s4_fence_x"] && d["s4_fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s4_fence_x"], "y": +d["s4_fence_y"] }; });
    var fence4array = fence4.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center4 = data.filter(function(d) { if (d["s4_center_x"] && d["s4_center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s4_center_x"], "y": +d["s4_center_y"] }; });

    // bagplot5
    var bag5 = data.filter(function(d) { if (d["s5_bag_x"] && d["s5_bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s5_bag_x"], "y": +d["s5_bag_y"] }; });
    var bag5array = bag5.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence5 = data.filter(function(d) { if (d["s5_fence_x"] && d["s5_fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s5_fence_x"], "y": +d["s5_fence_y"] }; });
    var fence5array = fence5.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center5 = data.filter(function(d) { if (d["s5_center_x"] && d["s5_center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s5_center_x"], "y": +d["s5_center_y"] }; });

    // bagplot6
    var bag6 = data.filter(function(d) { if (d["s6_bag_x"] && d["s6_bag_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s6_bag_x"], "y": +d["s6_bag_y"] }; });
    var bag6array = bag6.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var fence6 = data.filter(function(d) { if (d["s6_fence_x"] && d["s6_fence_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s6_fence_x"], "y": +d["s6_fence_y"] }; });
    var fence6array = fence6.map(function(d) { return [ +d["x"], +d["y"] ]; });
    var center6 = data.filter(function(d) { if (d["s6_center_x"] && d["s6_center_y"]) { return d; } })
      .map(function(d) { return { "x": +d["s6_center_x"], "y": +d["s6_center_y"] }; });

    var allBagplotDots = bag1.concat(fence1).concat(center1)
                              .concat(bag2).concat(fence2).concat(center2)
                              // .concat(bag3).concat(fence3).concat(center3)
                              .concat(bag4).concat(fence4).concat(center4)
                              .concat(bag5).concat(fence5).concat(center5)
                              .concat(bag6).concat(fence6).concat(center6);
    console.log(allBagplotDots);

    allBagplots = [
      {
        bag: bag1,
        fence: fence1,
        center: center1,
        bagArray: bag1array,
        fenceArray: fence1array
      },
      {
        bag: bag2,
        fence: fence2,
        center: center2,
        bagArray: bag2array,
        fenceArray: fence2array
      },
      // {
      //   bag: bag3,
      //   fence: fence3,
      //   center: center3,
      //   bagArray: bag3array,
      //   fenceArray: fence3array
      // },
      {
        bag: bag4,
        fence: fence4,
        center: center4,
        bagArray: bag4array,
        fenceArray: fence4array
      },
      {
        bag: bag5,
        fence: fence5,
        center: center5,
        bagArray: bag5array,
        fenceArray: fence5array
      },
      {
        bag: bag6,
        fence: fence6,
        center: center6,
        bagArray: bag6array,
        fenceArray: fence6array
      }
    ];

    // Scale the range of the data
    x.domain(d3.extent(allBagplotDots, function (d) {
      return d.x;
    }));
    y.domain([0, d3.max(allBagplotDots, function (d) {
      return d.y;
    })]);


    // Add the scatterplot
    // svg.selectAll("dot")
    //   .data(allBagplotDots)
    //   .enter().append("circle")
    //   .attr("r", 5)
    //   .attr("cx", function (d) {
    //     return x(d.x);
    //   })
    //   .attr("cy", function (d) {
    //     return y(d.y);
    //   });

    // Add hulls
    addHull(allBagplots[0], "green", 0.5, 0);
    addHull(allBagplots[1], "orange", 0.5, 1);
    addHull(allBagplots[2], "brown", 0.5, 2);
    addHull(allBagplots[3], "blue", 0.5, 3);
    addHull(allBagplots[4], "pink", 0.5, 4);

    // Create x Axis
    xAxis = d3.axisBottom(x);

    // Create y Axis
    yAxis = d3.axisLeft(y);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .classed('axis x', true)
      .call(xAxis);

    // Add the Y Axis
    svg.append("g")
      .classed('axis y', true)
      .call(yAxis);

    var toggles = svg.append("g")
      .attr("class", "toggles");

    // allBagplots.forEach(function(d, i) {
    //   var text = toggles.append("text");
    //     text.text("Toggle Bagplot " + i)
    //       .on("click", function() {
    //         d3.select(".bagplot-" + i)
    //           .classed("hide", !text.classed("hide"));
    //       });
    // });

  });

  function addHull(bagplot, color, opacity, i) {
    var bagColor = d3.color(color),
        fenceColor = d3.color(color);
    bagColor.opacity = opacity;
    fenceColor.opacity = opacity * 0.5;

    var bagplotGroup = svg.append("g")
      .attr("class", "bagplot-" + i);

    // bag
    bagplotGroup.append("path")
      .attr("class", "bag-hull")
      .attr("stroke", color)
      .attr("fill", bagColor)
      .datum(d3.polygonHull(bagplot.bagArray.map(function(d) { return [ x(d[0]), y(d[1]) ]; })))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    // fence
    bagplotGroup.append("path")
      .attr("class", "fence-hull")
      .attr("stroke", color)
      .attr("fill", fenceColor)
      .datum(d3.polygonHull(bagplot.fenceArray.map(function(d) { return [ x(d[0]), y(d[1]) ]; })))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    // center
    bagplotGroup.selectAll("dot")
      .data(bagplot.center)
      .enter().append("circle")
      .attr("class", "center")
      .attr("r", 5)
      .attr("fill", color)
      .attr("cx", function (d) {
        return x(d.x);
      })
      .attr("cy", function (d) {
        return y(d.y);
      });
  }

  function updateHull(bagplot, i) {
    var bagplotGroup = svg.selectAll("bagplot-" + i);

    // bag
    bagplotGroup.selectAll(".bag-hull")
      .datum(d3.polygonHull(bagplot.bagArray.map(function(d) { return [ x(d[0]), y(d[1]) ]; })))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    // fence
    bagplotGroup.selectAll(".fence-hull")
      .datum(d3.polygonHull(bagplot.fenceArray.map(function(d) { return [ x(d[0]), y(d[1]) ]; })))
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    // center
    bagplotGroup.selectAll(".center")
      .data(bagplot.center)
      // .enter().append("circle")
      .attr("cx", function (d) {
        return 10;
        // return x(d.x);
      })
      .attr("cy", function (d) {
        return y(d.y);
      });
  }

  d3.select(window).on('resize', resize);

  /*
   Resize
   */
  function resize() {

    // Find the new window dimensions
    width = parseInt(bagplotElement.style("width")) - margin.left - margin.right;

    // Update the range of the scale with new width/height
    x.range([0, width]);
    y.range([height, 0]);

    // // Update the axis with the new scale
    svg.selectAll('g.x.axis')
      .call(xAxis);
    // svg.selectAll('g.y.axis')
    //   .call(yAxis);

    updateHull(allBagplots[0], 0);
    updateHull(allBagplots[1], 1);
    updateHull(allBagplots[2], 2);
    updateHull(allBagplots[3], 3);
    updateHull(allBagplots[4], 4);


    // // Recalculate and update the dots
    // graphInner.selectAll("circle.dotWPY")
    //   .attr("cx", function (d) {
    //     return xScale(d.x);
    //   })
    //   .attr("cy", function (d) {
    //     return yScale(d.y);
    //   });
    //
    // graphInner.selectAll("path.areaWPY")
    //   .attr("d", function (d) {
    //     return area(d);
    //   });
    //
    // styleTicks();
  }



}(jQuery);