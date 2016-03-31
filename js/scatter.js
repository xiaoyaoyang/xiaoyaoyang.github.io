if(!d3.chart) d3.chart = {};

d3.chart.scatter = function() {
  var g;
  var data;
  var margin = {top: 30, right: 30, bottom: 80, left: 80},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  var cx = 10;
  var numberBins = 5;
  var dispatch = d3.dispatch(chart, "hover");


  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    g.append("g")
    .classed("yaxis", true)

    update();
  }


  chart.update = update;


  function update() {
    var dateFormat = d3.time.format("%Y-%m-%d");
    var maxDate = d3.max(data, function(d) { return dateFormat.parse(d.issue_d) });
    var minDate = d3.min(data, function(d) { return dateFormat.parse(d.issue_d) });
    var maxScore = d3.max(data, function(d) { return d.selectvar });
    var minScore = d3.min(data, function(d) { return d.selectvar });
    var maxLoan = d3.max(data, function(d) { return d.loan_amnt });

    var colorScale = d3.scale.category10();
    colorScale.domain([0,1]);
    


    var dateScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([cx, width])

    var rScale = d3.scale.linear()
    .domain([0, maxLoan])
    .range([1, 8])

    var yScale = d3.scale.linear()
      .domain([minScore, maxScore])
      .range([height, cx])
  
     var xAxis = d3.svg.axis()
    .scale(dateScale)
    .ticks(5)
    .tickFormat(d3.time.format("%Y-%m-%d"))

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(3)
    .orient("left")

    var xg = g.select(".xaxis")
      .classed("axis", true)
      .attr("transform", "translate(" + [0,height] + ")")
      .transition()
      .duration(500)
      .call(xAxis)

    var yg = g.select(".yaxis")
      .classed("axis", true)
      .classed("yaxis", true)
      .attr("transform", "translate(" + [cx - 5,0] + ")")
      .transition()
      .duration(500)
      .call(yAxis)

      // add ylab
    g.append('text')
      // correspoding for margin left
      .data(data)
      .attr('class','ylab')
      .attr('y',-25)
      .attr('x',-height/2)
      .attr("transform", "rotate(-90)")
      .style('text-anchor','middle')
      ;

      g.select('.ylab')
      .transition()
      .text(function (d) {
            return d.varname ;
        });




    var circles = g.selectAll("circle")
    .data(data, function(d) { return d.id })

    circles.enter()
    .append("circle")


    circles
    .transition()
    .duration(500)
    .attr({
      cx: function(d,i) { return dateScale(dateFormat.parse(d.issue_d)) },
      cy: function(d,i) { return yScale(d.selectvar) },
      r: function(d) { return rScale(d.loan_amnt)}
    })

    circles.exit().remove()

    circles.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      dispatch.hover([d])
    })
    circles.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.hover([])
    })

    var hist = d3.layout.histogram()
    .value(function(d) { return d.selectvar })
    .range([d3.min(data, function(d){ return d.selectvar }), d3.max(data, function(d){ return d.selectvar }) ])
    .bins(numberBins);
    var layout = hist(data);

    for(var i = 0; i < layout.length; i++) {
      var bin = layout[i];
      g.selectAll("circle")
      .data(bin, function(d) { return d.id })
      .style("fill", function(d) {  return colorScale(d.default) })
    }

  }

  chart.highlight = function(data) {
    var circles = g.selectAll("circle")
    .style("stroke", "")

    circles.data(data, function(d) { return d.id })
    .style("stroke", "orange")
    .style("stroke-width", 3)
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");
}



