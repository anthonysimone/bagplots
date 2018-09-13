import * as d3 from "d3";

// Add D3 extensions that will be used
d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};

// init variables
var xAxis, yAxis, allBagplots, allBagplotDots, toggles, togglesSelect, firstRender = true;

var bagplotElement = d3.select('#bagplot-data-reformat'),
    legendElement = d3.select('#bagplot-data-reformat-legend');

// Create a local data object
var previousData = d3.local();

// set the dimensions and margins of the graph
var margin = {top: 10, right: 20, bottom: 40, left: 55},
  width = parseInt(bagplotElement.style('width')) - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var container = bagplotElement.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var svg = container.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create scales, ranges are set in the redraw function
var x = d3.scaleLinear();
var y = d3.scaleLinear();

 // Create x Axis
xAxis = d3.axisBottom(x);
// Create y Axis
yAxis = d3.axisLeft(y);

// Add the X Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .classed('axis x', true);

// Add the Y Axis
svg.append("g")
  .classed('axis y', true);

// Add labels
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate("+(-margin.left+20)+","+(height/2)+")rotate(-90)")
  .attr("font-size", 14)
  .text("Y-axis Label");
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "translate("+(width/2)+","+(height+(margin.bottom))+")")
  .text("X-axis Label")
  .attr("font-size", 14);


// Create toggles
toggles = legendElement.append("div")
  .classed("toggles", true);

// Set toggles behavior
togglesSelect = toggles.append("select")
    .classed("toggle-select", true)
    .on("change", function() {
      // Get the active element
      if (this.value === 'all') {
        d3.selectAll('g.plot-container').transition().style("opacity", 1);
      } else {
        let currentBag = d3.select(".bagplot-"+this.value).moveToFront().node();
        d3.selectAll('g.plot-container').transition().style('opacity',function () {
          // Compare each element in selection to the current element
          return (this === currentBag) ? 1.0 : 0.2;
        });
      }
    });;

// Set data set behavior
d3.select('#data-set')
  .on("change", function() {
    switch (this.value) {
      case 'random':
        renderWithRandomData();
        break;
      case '1':
        renderWithCsv("./bags/all-bagplots-reformat.csv");
        break;
    }
  });

renderWithCsv("./bags/all-bagplots-reformat.csv");

// Render with data from a csv
function renderWithCsv(csvPath) {
  d3.csv(csvPath).then(function (data) {

    // Format all of our bag data as D3 will need it
    allBagplots = formatBagData(data);

    // Get all coordinates into one array for use in the scale and axis definition
    allBagplotDots = getAllDots(allBagplots);

    redraw();
  });
}

// Render with random data
function renderWithRandomData() {
  let numberOfBags = allBagplots.length;

  // Remove any old data
  allBagplots = [];

  // Get random bags
  allBagplots.push(generateRandomBag(2000, 3500, 3, 4, 2, 2));
  allBagplots.push(generateRandomBag(1000, 3000, 1.5, 2.5, 2, 2));
  allBagplots.push(generateRandomBag(3500, 4000, 2.5, 3, 2, 4));
  allBagplots.push(generateRandomBag(500, 1000, 2, 2.5, 2, 2));
  allBagplots.push(generateRandomBag(900, 1700, 3.1, 3.9, 2, 3));

  // Get all coordinates into one array for use in the scale and axis definition
  allBagplotDots = getAllDots(allBagplots);

  redraw();
}

function addHull(bagplot, color, opacity, i) {
  var bagColor = d3.color(color),
      fenceColor = d3.color(color);

  bagColor.opacity = opacity;
  fenceColor.opacity = opacity * 0.5;

  // plot group creation
  svg.selectAll("g.bagplot-" + i)
    .data([bagplot])
      .enter().append("g")
      .attr("class", "bagplot-" + i)
      .classed("plot-container", true);

  // bag: enter, update, exit
  svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
    .data([d3.polygonHull(bagplot.bagArray.map(d => [x(d[0]), y(d[1])] ))])
    .enter().append("path")
      .attr("class", "bag-hull")
      .attr("stroke", color)
      .attr("fill", bagColor)
      .attr("d", function(d) {
        return "M" + d.join("L") + "Z";
      });
  svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
    .transition().duration(1000)
    .attrTween("d", pathTween(4));
  svg.selectAll("g.bagplot-" + i).selectAll("path.bag-hull")
    .exit()
      .remove();

  // fence: enter, update, exit
  svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
    .data([d3.polygonHull(bagplot.fenceArray.map(d => [x(d[0]), y(d[1])] ))])
    .enter().append("path")
      .attr("class", "fence-hull")
      .attr("stroke", color)
      .attr("fill", fenceColor)
      .attr("d", function(d) {
        return "M" + d.join("L") + "Z";
      });
  svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
    .transition().duration(1000)
    .attrTween("d", pathTween(4));
  svg.selectAll("g.bagplot-" + i).selectAll("path.fence-hull")
    .exit()
      .remove();

  // center: enter, update, exit
  svg.select("g.bagplot-" + i).selectAll(".center")
    .data(bagplot.center)
    .enter().append("circle")
      .attr("class", "center")
      .attr("r", 5)
      .attr("fill", color)
      .attr("cx", function (d) {
        return x(d[0]);
      })
      .attr("cy", function (d) {
        return y(d[1]);
      });
  svg.select("g.bagplot-" + i).selectAll(".center")
    .transition().duration(1000)
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
  x.domain([0, d3.max(allBagplotDots, function (d) {
    return d[0];
  })]);
  y.domain([0, d3.max(allBagplotDots, function (d) {
    return d[1];
  })]);

  // Update the axis with the new scale
  if (firstRender) {
    svg.selectAll('g.x.axis')
      .call(xAxis);
    svg.selectAll('g.y.axis')
      .call(yAxis);
    firstRender = false;
  } else {
    svg.selectAll('g.x.axis')
      .transition().duration(1000)
      .call(xAxis);
    svg.selectAll('g.y.axis')
      .transition().duration(1000)
      .call(yAxis);
  }

  // Add hulls
  addHull(allBagplots[0], getColorByIndex(0), 0.5, 0);
  addHull(allBagplots[1], getColorByIndex(1), 0.5, 1);
  addHull(allBagplots[2], getColorByIndex(2), 0.5, 2);
  addHull(allBagplots[3], getColorByIndex(3), 0.5, 3);
  addHull(allBagplots[4], getColorByIndex(4), 0.5, 4);

  // Add the select options
  togglesSelect.selectAll("option")
    .data(allBagplots)
    .enter().append("option")
      .text((d,i) => {
        return "Focus: " + getColorByIndex(i);
      })
      .attr("data-toggle", (d,i) => i)
      .property("value", (d,i) => i);
  togglesSelect.exit().remove();

  // Only initially, add the default option
  if (allBagplots.length > 0 && togglesSelect.select(".default-option").empty()) {
    togglesSelect.insert("option", ":first-child")
      .text("View All")
      .attr("data-toggle", "all")
      .classed("default-option", true)
      .property("value", "all")
      .property("selected", true);
  }
}

/*
 Resize
 */
function resize() {
  redraw();
}

function addToggles() {

}

function getColorByIndex(index) {
  switch (index) {
    case 0:
      return "green";
    case 1: 
      return "orange";
    case 2:
      return "brown";
    case 3:
      return "blue";
    case 4:
      return "gray";
  }
}

function formatBagData(data) {
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

  return data;
}

function getAllDots(bagplotData) {
  let allDots = [];
  bagplotData.forEach(bagSet => {
    allDots = allDots.concat(bagSet.bagArray).concat(bagSet.fenceArray).concat(bagSet.center);
  });

  return allDots;
}

function generateRandomBag(xMin, xMax, yMin, yMax, distribution, fenceSpread) {
  // create our new empty bag object
  let bag = {bagArray: [], fenceArray: [], center: []};

  // generate points for the fence first
  for (let i = 0; i < 20; i++) {
    bag.fenceArray.push(generateFencePoint(xMin, xMax, yMin, yMax, distribution, fenceSpread));
  }

  // Generate points for the bag
  for (let j = 0; j < 20; j++) {
    bag.bagArray.push(generateConstrainedPoint(xMin, xMax, yMin, yMax, distribution, bag.fenceArray));
  }

  // Generate center
  bag.center.push(generateConstrainedPoint(xMin, xMax, yMin, yMax, distribution, bag.bagArray));

  return bag;
}

/**
 * Generate a random point given a set of parameters.
 */
function generatePoint(xMin, xMax, yMin, yMax, distribution = 1) {
  let xRange = xMax - xMin,
      yRange = yMax - yMin;

  return [Math.floor(Math.pow(Math.random(), distribution) * xRange) + xMin, Math.floor(Math.pow(Math.random(), distribution) * yRange * 100)/100 + yMin];
}

/**
 * Generate a random point for the fence of a bagplot given the parameters of the bag and a fence spread.
 */
function generateFencePoint(xMin, xMax, yMin, yMax, distribution = 1, fenceSpread = 2) {
  if (fenceSpread < 1) {
    throw new Error('The `fenceSpread` must be a number greater than 1.');
  }

  let xRange = xMax - xMin,
      yRange = yMax - yMin;

  // do something to get a point
  return [Math.floor(Math.pow(Math.random(), distribution) * xRange * fenceSpread) + xMin, Math.floor(Math.pow(Math.random(), distribution) * yRange * fenceSpread * 100)/100 + yMin];
  // check to see if point satisfies stuff
}

function generateConstrainedPoint(xMin, xMax, yMin, yMax, distribution, constraintPointsArray) {
  // Generate a new point to test
  let point = generatePoint(xMin, xMax, yMin, yMax, distribution);

  // Compare the two hulls, if they're equal our center lays within it! If not, try again
  if (isPointWithinGeneratedHull(point, constraintPointsArray)) {
    return point;
  } else {
    return generateConstrainedPoint(xMin, xMax, yMin, yMax, distribution, constraintPointsArray);
  }
}

function isPointWithinGeneratedHull(point, points) {
  let hull = d3.polygonHull(points),
    newHull = points.slice();

  // Add the point to the cloned array and generate a new hull  
  newHull.push(point);
  newHull = d3.polygonHull(newHull);

  // Compare the hull created from the existing points with the hull generated with the test point added
  return (hull.length === newHull.length && hull.every((value, index) => value === newHull[index]));
}








// Path tween function, adapted from https://bl.ocks.org/mbostock/3916621
// Takes a precision level, then returns a function with the default passed parameters.
// Generate your path and do the calculations to transform from one to another.
// Return your interpolation function.
// This pathTween function can only be used within the context of data binding because
// it expects to receive the polygon array as "d".
function pathTween(precision) {
  return function(d, i, a) {
    let d1 = "M" + d.join("L") + "Z";

    var path0 = this,
        path1 = path0.cloneNode(),
        n0 = path0.getTotalLength(),
        n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

    // Uniform sampling of distance based on specified precision.
    var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
    while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    var points = distances.map(function(t) {
      var p0 = path0.getPointAtLength(t * n0),
          p1 = path1.getPointAtLength(t * n1);
      return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
    });

    return function(t) {
      return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
    };
  }
}
