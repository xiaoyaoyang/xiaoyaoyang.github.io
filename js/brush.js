if(!d3.chart) d3.chart = {};

d3.chart.brush = function() {
  var dateFormat = d3.time.format("%Y-%m-%d");
  var g;
  var data;
    var margin = {top: 0, right: 30, bottom: 10, left: 80},
        width = 960 - margin.left - margin.right,
        height = 40 - margin.top - margin.bottom;
  var dispatch = d3.dispatch(chart, "filter");

  function chart(container) {
    g = container;
    
    var extent = d3.extent(data, function(d) {
      return dateFormat.parse(d.issue_d);
    });

    var scale = d3.time.scale()
      .domain(extent)
      .range([0, width]);

    var brush = d3.svg.brush()
    brush.x(scale)
    brush(g)
    g.selectAll("rect").attr("height", height)
    g.selectAll(".background")
      .style({fill: "#4B9E9E", visibility: "visible"})
    g.selectAll(".extent")
      .style({fill: "#78C5C5", visibility: "visible"})
    g.selectAll(".resize rect")
      .style({fill: "#276C86", visibility: "visible"});

    var rects = g.selectAll("rect.events")
    .data(data)
    .attr('class', 'brush')
    rects.enter()
    .append("rect").classed("events", true)
    rects.attr({
      x: function(d) { return scale(dateFormat.parse(d.issue_d));},
      y: 0,
      width: 1,
      height: height
    }).style("pointer-events", "none")
    ;

    rects.exit().remove()
    ;

    brush.on("brushend", function() {
      var ext = brush.extent()
      var filtered = data.filter(function(d) {
        return (dateFormat.parse(d.issue_d) > ext[0] && dateFormat.parse(d.issue_d) < ext[1])
      })
      g.selectAll("rect.events")
      .style("stroke", "")
      
      g.selectAll("rect.events")
      .data(filtered, function(d) { return d.id })
      .style({
        stroke: "#fff"
      })

      //emit filtered data
      dispatch.filter(filtered)
    })



    var axis = d3.svg.axis()
    .scale(scale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(d3.time.format("%Y-%m-%d"))

    var agroup = g.append("g").attr('class','brushaxis')
    agroup.attr("transform", "translate(" + [0, height] + ")")
    axis(agroup)

    agroup.selectAll("path")
      .style({ fill: "none", stroke: "#000"})
    agroup.selectAll("line")
      .style({ stroke: "#000"})
  }

  chart.highlight = function(data) {
    var rects = g.selectAll("rect.events")
    .style("stroke", "")
    .style("stroke-width", "")

    rects.data(data, function(d) { return d.id })
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
