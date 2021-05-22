var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/* 
Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, newYScale, xAxis, yAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  var leftAxis = d3.axisLeft(newYScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "hair_length") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }*/

  
  /*
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}*/

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;
  
  // parse data
  censusData.forEach(function(data) {
    data.id = +data.id;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.healthcare = +data.healthcare;
    data.healthcareHigh = +data.healthcareHigh;
    data.healthcareLow = +data.healthcareLow;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.obesityHigh = +data.obesityHigh;
    data.obesityLow = +data.obesityLow;
    data.smokes = +data.smokes;
    data.smokesHigh = +data.smokesHigh;
    data.smokesLow = +data.smokesLow;
  });
  
  // xLinearScale function above csv import
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d=>d.poverty)*0.8, d3.max(censusData, d=>d.poverty)*1.2])
    .range([0, width]);
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)*0.8, d3.max(censusData, d => d.healthcare)*1.2])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      var stateAbbr = d.abbr;
      console.log("Tool tip text: "+stateAbbr);
      return(stateAbbr);
    });

  chartGroup.call(toolTip);

  // append initial circles
  chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", function(d,i) {
      return xLinearScale(d.poverty);
    })
    .attr("cy", function(d,i) {
      return yLinearScale(d.healthcare);
    })
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("opacity", ".75");

  // Create group for two x-axis labels
  chartGroup.append("text")
    .attr("x", (width / 2))
    .attr("y", (height + 40))
    .classed("axis-text", true)
    .text("% in Poverty");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 1.5))
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("% without Healthcare");

  // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
  
  svg.selectAll(".dot")
    .data(censusData)
    .enter()
    .append("text")
    .text(function(data){
      return (data.abbr);
    })
    .attr("x", function(data){
        return xLinearScale(data.poverty);
    })
    .attr("y", function(data) {
        return yLinearScale(data.healthcare);
    })
    .attr("font-size","10px")
    .attr("fill","white")
    .style("text-anchor","middle");
    
}).catch(function(error) {
  console.log(error);
});
