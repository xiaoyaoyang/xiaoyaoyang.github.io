
var dat;
var values;
var test;

window.onload = function(){
  d3.csv
  ('dti.csv'
  , 
      function(d) {
        return {
          // year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
          dti: +d.dti
          // model: d.Model,
          // length: +d.Length // convert "Length" column to number
          };
        }
  ,
        function(error, data) 
          {
            dat=data;
            ;

            var values = dat.map(function(d) {return d.dti;});
            draw_hist(values);
          }
  )
}





function draw_hist(values){

    // values should be an array


    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 30, right: 30, bottom: 80, left: 80},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        bin_padding=3;

    var x = d3.scale.linear()
        .domain([Math.floor(Math.min.apply(null,values)), Math.ceil(Math.max.apply(null,values))])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    console.log();
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);


    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var colorScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([0, 255]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(12);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });



    bar.append("rect")
        .attr("x", bin_padding)
        .attr("width", x(data[0].dx) - bin_padding)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", 'steelblue')
        .on("mouseover", function(d) {
        
                            var xPosition = x(data[0].dx)/2 - 1/2;
                            var yPosition = 10;
                            d3.select(this)
                            .attr("fill", "orange");
                            svg.append("text")
                                  .data(d)
                                  .attr("id","tooltip")
                                  .attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")")
                                  .attr("dy", ".75em")
                                  .attr("y", yPosition)
                                  .attr("x", xPosition)
                                  .attr("text-anchor", "middle")
                                  .style("fill","white")
                                  .text(formatCount(d.y))
                                  .style("pointer-events", "none")
                            ;
                      })
                      // Mouse out Effect! remove tooltip label and change color back
                      .on("mouseout", function(d) {
                        //Remove the tooltip
                          d3.select("#tooltip").remove();
                          d3.select(this)
                              .transition()
                              .duration(500)
                              .attr("fill", function(d) {
                                    return "rgb(0, 0, " + (colorScale(d.y)) + ")";
                                    })
                      });



    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        .attr('class','title')
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "underline")  
        .text("Histogram of Debt-to-Income Ratio");


}
