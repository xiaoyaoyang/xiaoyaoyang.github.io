
// Bar plot

			var w = 600;
			var h = 250;
			var barPadding = 1;


//Width and height
// d3.csv('dti.csv', function(error, csv){
// 		dataset_bar = csv
// 	})

			
			var dataset_bar = [ 12
,477
,174029
,112622
,83518
,35814
,13993
,9395
,3393
,549 ];
			
			var xScaleBar = d3.scale.ordinal()
                .domain(d3.range(dataset_bar.length))
                .rangeRoundBands([0, w],0.05);

 			var yScaleBar = d3.scale.linear()
				.domain([0, d3.max(dataset_bar)])
				.range([0, h]);
			

			//Create SVG element

			var barPlot = d3.select("#plot-area-2")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			barPlot.selectAll("rect")
			   .data(dataset_bar)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return xScaleBar(i);
			   })
			   .attr("y", function(d) {
			   		return h - yScaleBar(d);
			   })
			   .attr("width", xScaleBar.rangeBand())
			   .attr("height", function(d) {
			   		return yScaleBar(d);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + yScaleBar(d) + ")";
			   })
			    .on("mouseover", function() {
			   		d3.select(this)
			   			.attr("fill", "orange");
			   })
			    .on("mouseout", function(d) {
				   d3.select(this)
				   .transition()
				   .duration(500)
					.attr("fill", "rgb(0, 0, " + yScaleBar(d) + ")");
			   });

			barPlot.selectAll("text")
			   .data(dataset_bar)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return xScaleBar(i) + xScaleBar.rangeBand() / 2;
			   })
			   .attr("y", function(d) {
			   		return h - yScaleBar(d) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white")
			   .style("pointer-events", "none");

			  d3.select("#click-bar")
			    .on("click", function() {
			    var numValues = dataset_bar.length;               //Count original length of dataset_bar
				dataset_bar = [];                                       //Initialize empty array
				for (var i = 0; i < numValues; i++) {               //Loop numValues times
				    var newNumber = Math.floor(Math.random() * 100); //New random integer (0-24)
				    dataset_bar.push(newNumber);                        //Add new number to array
				}
					xScaleBar = d3.scale.ordinal()
		                .domain(d3.range(dataset_bar.length))
		                .rangeRoundBands([0, w],0.05);

						yScaleBar.domain([0, d3.max(dataset_bar)]);
											
					barPlot.selectAll("rect")//Update all rects
					   .data(dataset_bar)
					   .transition()
					   .duration(5000)
					   .attr("x", function(d, i) {
			   				return xScaleBar(i);
			   			})
					   .attr("y", function(d) {
					   		return h - yScaleBar(d);
					   })
					   .attr("height", function(d) {
					   		return yScaleBar(d);
					   })
					   .attr("fill", function(d) {
							return "rgb(0, 0, " + (d * 10) + ")";
					   });
					//Update all labels
					barPlot.selectAll("text")
					   .data(dataset_bar)
					   .transition()								// <-- Now with 
					   .duration(5000)								//     label transitions!
					   .text(function(d) {
					   		return d;
					   })
					   .attr("x", function(d, i) {
					   		return xScaleBar(i) + xScaleBar.rangeBand() / 2;
					   })
					   .attr("y", function(d) {
					   		return h - yScaleBar(d) + 14;
					   });
			        //Do something  on click
			    });


