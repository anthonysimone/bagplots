!function ($) {
  "use strict";

  // init variables
  var xAxis, yAxis, allBagplots, allBagplotDots;

  var bagplotElement = d3.select('#bagplot-data-reformat');

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 50, left: 60},
    width = parseInt(bagplotElement.style('width')) - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Create scales, ranges are set in the redraw function
  var x = d3.scaleLinear();
  var y = d3.scaleLinear();

  var allData = [];

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var container = bagplotElement.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var svg = container.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
  d3.csv("./bags/all-bagplots-reformat.csv").then(function (data) {

    // Format all of our bag data as D3 will need it
    data.forEach((bagSet, i) => {
      // Start by splitting all data from csv to array
      data.columns.forEach((column, i) => {
        bagSet[column] = bagSet[column].split(",");
      });

      // Create our bag, fence, and center
      if (bagSet.bag_x.length === bagSet.bag_y.length) {
        bagSet.bagArray = [];
        bagSet.bag_x.forEach((x, i) => {
          bagSet.bagArray.push([+x, +bagSet.bag_y[i]]);
        });
      } else {
        throw new Error('Your bag x and y coordinates are unmatched. Please check your data.');
      }
      if (bagSet.fence_x.length === bagSet.fence_y.length) {
        bagSet.fenceArray = [];
        bagSet.fence_x.forEach((x, i) => {
          bagSet.fenceArray.push([+x, +bagSet.fence_y[i]]);
        });
      } else {
        throw new Error('Your fence x and y coordinates are unmatched. Please check your data.');
      }
      if (bagSet.center_x.length === 1 && bagSet.center_y.length === 1) {
        // wrap in an extra array so the format is consistent across all data
        bagSet.center = [[+bagSet.center_x[0], +bagSet.center_y[0]]];
      } else {
        throw new Error('The data for your center coordinate is not as expected. It should be a single x and y coordinate. Please check your data.');
      }
    });
    allBagplots = data;

    // Get all coordinates into one array for use in the scale and axis definition
    allBagplotDots = [];
    data.forEach(bagSet => {
      allBagplotDots = allBagplotDots.concat(bagSet.bagArray).concat(bagSet.fenceArray).concat(bagSet.center);
    });

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

    // Add labels
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+(-margin.left+20)+","+(height/2)+")rotate(-90)")
      .text("Y-axis Label");
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+(width/2)+","+(height+(margin.bottom))+")")
      .text("X-axis Label");

    var toggles = svg.append("g")
      .attr("class", "toggles");

    redraw();
  });

  function addHull(bagplot, color, opacity, i) {
    var bagColor = d3.color(color),
        fenceColor = d3.color(color);

    bagColor.opacity = opacity;
    fenceColor.opacity = opacity * 0.5;

    // plot group creation
    svg.selectAll("g.bagplot-" + i)
      .data([bagplot])
        .enter().append("g")
        .attr("class", "bagplot-" + i);

    // bag: enter, update, exit
    svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
      .data([d3.polygonHull(bagplot.bagArray.map(d => [x(d[0]), y(d[1])] ))])
      .enter().append("path")
        .attr("class", "bag-hull")
        .attr("stroke", color)
        .attr("fill", bagColor)

    svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
      .attr("d", function(d) {
        return "M" + d.join("L") + "Z";
      });

    svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
      .exit()
        .remove();

    // fence: enter, update, exit
    svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
      .data([d3.polygonHull(bagplot.fenceArray)])
      .enter().append("path")
        .attr("class", "fence-hull")
        .attr("stroke", color)
        .attr("fill", fenceColor);

    svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
      .attr("d", function(d) { return "M" + d.map(function(point) { return [ x(point[0]), y(point[1]) ]; }).join("L") + "Z"; });

    svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
      .exit()
        .remove();

    // center: enter, update, exit
    svg.select("g.bagplot-" + i).selectAll(".center")
      .data(bagplot.center)
      .enter().append("circle")
        .attr("class", "center")
        .attr("r", 5)
        .attr("fill", color);
    svg.select("g.bagplot-" + i).selectAll(".center")
      .attr("cx", function (d) {
        return x(d[0]);
      })
      .attr("cy", function (d) {
        return y(d[1]);
      });
    svg.select("g.bagplot-" + i).selectAll("dot")
      .exit()
        .remove();
  }

  d3.select(window).on('resize', resize);

  /*
    The Draw/Redraw function
  */
  function redraw() {
    // Find the new window dimensions
    width = parseInt(bagplotElement.style("width")) - margin.left - margin.right;

    container.attr("width", width + margin.left + margin.right);

    // Update the range of the scale with new width/height
    x.range([0, width]);
    y.range([height, 0]);

    // Scale the range of the data
    x.domain(d3.extent(allBagplotDots, function (d) {
      return d[0];
    }));
    y.domain([0, d3.max(allBagplotDots, function (d) {
      return d[1];
    })]);

    // Update the axis with the new scale
    svg.selectAll('g.x.axis')
      .call(xAxis);
    svg.selectAll('g.y.axis')
      .call(yAxis);

    // Add hulls
    addHull(allBagplots[0], "green", 0.5, 0);
    addHull(allBagplots[1], "orange", 0.5, 1);
    addHull(allBagplots[2], "brown", 0.5, 2);
    addHull(allBagplots[3], "blue", 0.5, 3);
    addHull(allBagplots[4], "pink", 0.5, 4);
  }

  /*
   Resize
   */
  function resize() {
    redraw();
  }



}(jQuery);