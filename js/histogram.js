    if(!d3.chart) d3.chart = {};

    d3.chart.histogram = function() {
      var dateFormat = d3.time.format("%Y-%m-%d");
      var g;
      var data;
      var margin = {top: 30, right: 30, bottom: 80, left: 80},
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
      var cx = 10;
      var numberBins = 5;
      var dispatch = d3.dispatch(chart, "hover");

      function chart(container) {
        g = container;
        update();
      }

      chart.update = update;

      function update() {

        // create hist layout
        var hist = d3.layout.histogram()
                      .value(function(d) { return d.selectvar })
                      .range([d3.min(data, function(d){ return d.selectvar }) , d3.max(data, function(d){ return d.selectvar }) ])
                      .bins(numberBins);
        var layout = hist(data);

        var maxLength = d3.max(layout, function(d) { return d.length });
        var widthScale = d3.scale.linear()
                          .domain([0, maxLength])
                          .range([0, width])

        var yScale = d3.scale.ordinal()
                      .domain(d3.range(numberBins))
                      .rangeBands([height, 0], 0)

        var colorScale = d3.scale.linear()
        .domain([0, d3.max(layout, function(d) { return d.y; })])
        .range([100, 240]);







        // create rect
        var rects = g.selectAll("rect")
                    .data(layout)
        
        rects.enter().append("rect")

        rects .transition()
              .duration(500)
              .attr({
                y: function(d,i) {
                  return yScale(i);
                },
                x: 50,
                height: yScale.rangeBand(),
                width: function(d,i) {
                  return widthScale(d.length);
                },
                fill: function(d) { return "rgb(0, 0, " + (colorScale(d.y)) + ")";}
              });



        // try to add text of bar value   why is it not working?

            console.log(layout);
            g.append('text')
            .data(layout)
            .attr('class','barvalue')
            .attr('y',function(d,i) {
                  return yScale(i);
                })
            .attr('x',function(d,i) {
                  return widthScale(d.length);
                })

            .style('text-anchor','middle')
            .text(function(d){return ;});



        rects.exit().transition().remove();



        rects.on("mouseover", function(d) {
          d3.select(this).style("fill", "orange")
          console.log("hist over", d)
          dispatch.hover(d)
        })
        rects.on("mouseout", function(d) {
          d3.select(this).style("fill", "")
          dispatch.hover([])
        })
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
