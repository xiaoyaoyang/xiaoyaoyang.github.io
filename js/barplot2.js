
var margin = {top: 30, right: 30, bottom: 80, left: 80},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);


// Create SVG object

var chart = d3.select("#creditBar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("files/dti_count.csv", type, function(error, data) {
            console.log(JSON.stringify(data));
            // Set up domain and range, from true value to our graph scale
            x.domain(data.map(function(d) { return d.Range; }));
            y.domain([0,d3.max(data, function(d) { return +d.Freq; })])
                      .range([height,0]);

            // Create xAxis and yAxis in order to generate axis
            var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

            var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")


            // xAxis
            chart.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis)
                      .selectAll("text")  
                      .style("text-anchor", "end")
                      .attr("dx", "-.8em")
                      .attr("dy", ".15em")
                      .attr("transform", function(d) {
                          return "rotate(-60)" 
                          });
            // Add title
              chart.append("text")
                      .attr('class','title')
                      .attr("x", (width / 2))             
                      .attr("y", 0 - (margin.top / 2))
                      .attr("text-anchor", "middle")  
                      .style("font-size", "18px") 
                      .style("text-decoration", "underline")  
                      .text("Histogram of Debt-to-Income Ratio");

            // yAxis
            chart.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Frequency");
            // Draw bar plot!
            chart.selectAll("rect")
                      .data(data)
                      .enter().append("rect")
                      .attr("x", function(d) { return x(d.Range); })
                      .attr("y", function(d) { return y(d.Freq); })
                      .attr("height", function(d) { return height - y(d.Freq); })
                      .attr("width", x.rangeBand())
                      .attr("fill", function(d) {
                        return "rgb(0, 0, " + y(d3.max(data, function(d) { return +d.Freq; })-d.Freq) + ")";
                        })
           
                      // Mouseover Effect! show label as tooltip and change color to orange.
                      .on("mouseover", function(d) {
                            d3.select(this)
                            .attr("fill", "orange");
                            var xPosition = parseFloat(d3.select(this).attr("x")) + x.rangeBand() / 2;
                            var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
                      //Create the tooltip label
                            chart.append("text")
                              .attr("id", "tooltip")
                              .attr("x", xPosition)
                              .attr("y", yPosition)
                              .attr("text-anchor", "middle")
                              .attr("font-family", "sans-serif")
                              .attr("font-size", "11px")
                              .attr("font-weight", "bold")
                              .attr("fill", "black")
                              .text(d.Freq)
                              .style("pointer-events", "none");
                      })
                      // Mouse out Effect! remove tooltip label and change color back
                      .on("mouseout", function(d) {
                        //Remove the tooltip
                          d3.select("#tooltip").remove();
                          d3.select(this)
                              .transition()
                              .duration(500)
                              .attr("fill", "rgb(0, 0, " + y(d3.max(data, function(d) { return +d.Freq; })-d.Freq) + ")");
                      });

      

});

// Error function to coerce char to number
function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

d3.select("#click-bar2")
          .on("click", function() {
            d3.csv("files/creditScore.csv", type, function(error, dat) {
            console.log(JSON.stringify(dat));
            // Set up domain and range, from true value to our graph scale
            x.domain(dat.map(function(d) { return d.Range; }));
            y.domain([0,d3.max(dat, function(d) { return +d.Freq; })])
                      .range([height,0]);

            // Create xAxis and yAxis in order to generate axis
            var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

            var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")



              //Update X axis
            chart.select(".x.axis")
                .transition()
                .duration(4000)
                .call(xAxis);

            //Update Y axis
          chart.select(".y.axis")
              .transition()
              .duration(4000)
             .call(yAxis);
            
            // Update title
              chart.selectAll(".title")
                    .transition()
                    .duration(4000)
                    .text("Histogram of Credit Score");


          // select
            var new_chart=chart.selectAll("rect")
                          .data(dat)

          // enter
            new_chart.enter()
                      .append("rect")
                      .attr("x", width+500)
                      .attr("y", function(d) { return y(d.Freq); })
                      .attr("height", function(d) { return height - y(d.Freq); })
                      .attr("width", x.rangeBand())
                      .attr("fill", function(d) {
                        return "rgb(0, 0, " + y(d3.max(dat, function(d) { return +d.Freq; })-d.Freq) + ")";
                        });

              new_chart.transition()
                        .duration(5000)
                        .attr("x", function(d) { return x(d.Range); })
                      .attr("y", function(d) { return y(d.Freq); })
                      .attr("height", function(d) { return height - y(d.Freq); })
                      .attr("width", x.rangeBand())
                      ;

              new_chart.exit()
                      .transition()
                      .duration(5000)
                      .attr('x',width+500 )
                      .remove()
                      ;
    
           
                      // Mouseover Effect! show label as tooltip and change color to orange.
                new_chart.on("mouseover", function(d) {
                            d3.select(this)
                            .attr("fill", "orange");
                            var xPosition = parseFloat(d3.select(this).attr("x")) + x.rangeBand() / 2;
                            var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
                      //Create the tooltip label
                            chart.append("text")
                              .attr("id", "tooltip")
                              .attr("x", xPosition)
                              .attr("y", yPosition)
                              .attr("text-anchor", "middle")
                              .attr("font-family", "sans-serif")
                              .attr("font-size", "11px")
                              .attr("font-weight", "bold")
                              .attr("fill", "black")
                              .text(d.Freq)
                              .style("pointer-events", "none");
                      })
                      // Mouse out Effect! remove tooltip label and change color back
                      .on("mouseout", function(d) {
                        //Remove the tooltip
                          d3.select("#tooltip").remove();
                          d3.select(this)
                              .transition()
                              .duration(500)
                              .attr("fill", "rgb(0, 0, " + y(d3.max(dat, function(d) { return +d.Freq; })-d.Freq) + ")");
                      });

      

});
          
          });
