
var data = [
		{key: "England",	value: 493454},
		{key: "North East",	value: 268629},
		{key: "North West",	value: 308969},
		{key: "Yorkshire and The Humber",	value: 306545},
		{key: "East Midlands",	value: 320233},
		{key: "West Midlands",	value: 346090},
		{key: "East of England",	value: 486136},
		{key: "London", 	value: 915300},
		{key: "South East", 	value: 572336},
		{key: "South West", 	value: 431119},
		{key: "Wales", 	value: 284343},
		{key: "Scotland", 	value: 303362}
	];
	
var w = 900;
var h = 600;
var margin = {
	top: 58,
	bottom: 120,
	left: 80,
	right: 40
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.key;
		}))
		.rangeBands([0, width]);
var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.value;
		})])
		.range([height, 0]);
var ordinalColorScale = d3.scale.category20();
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");
var svg = d3.select("#barchart1")
			.attr("id", "chart1")
			.attr("width", w)
			.attr("height", h);
var chart1 = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var controls = d3.select("#controls")
				.attr("id", "controls");
var sort_btn = controls.append("button")
				.html("Ascending Order")
				.attr("state", 0)
				.style("background-color", "rgb(202, 154, 154)")
				.style("padding", "15px 32px")
				.style("text-decoration", "none")
				.style("font-size", "16px")
				.style("border", "none")
				.style("border", "none");

				
var tooltip = d3.select("#tooltip");

function drawAxis(params){

	if(params.initialize === true){
		//Draw the gridlines and axes
		//Draw the gridlines
		this.append("g")
			.call(params.gridlines)
			.classed("gridline", true)
			.attr("transform", "translate(0,0)");

		//This is the x axis
		this.append("g")
			.classed("x axis", true)
			.attr("transform", "translate(" + 0 + "," + height + ")")
			.call(params.axis.x)
				.selectAll("text")
					.classed("x-axis-label", true)
					.style("text-anchor", "end")
					.style("font-size","14px")
					.style("fill","ffffff")
					.attr("dx", -8)
					.attr("dy", 8)
					.attr("transform", "translate(0,0) rotate(-45)");

		//This is the y axis
		this.append("g")
			.classed("y axis", true)
			.attr("transform", "translate(0,0)")
			.call(params.axis.y)
			.style("fill","ffffff");

		//This is the y label
		this.select(".y.axis")
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.style("text-anchor", "middle")
			.style("font-size","14px")
			.style("fill","#555555")
			.attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
			.text("Housing Prices ");

		//This is the x label
		this.select(".x.axis")
			.append("text")
			.attr("x", 20)
			.attr("y", 10)
			.style("text-anchor", "right")
			.style("font-size","30px")
			.style("fill","ffffff")
			.attr("transform", "translate(" + (width-120)/2 + ",135)")
			.text("Region");

	} else if(params.initialize === false){
		//Update info
		this.selectAll("g.x.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.x);
		this.selectAll(".x-axis-label")
			.style("text-anchor", "end")
			.style("font-size","12px")
			.attr("dx", -8)
			.attr("dy", 8)
			.attr("transform", "translate(0,0) rotate(-45)");
		this.selectAll("g.y.axis")
			.transition()
			.duration(500)
			.ease("bounce")
			.delay(500)
			.call(params.axis.y);
	}
}
function plot(params){
	x.domain(data.map(function(entry){
			return entry.key;
		}));
	y.domain([0, d3.max(data, function(d){
			return d.value;
		})]);

	//Draw the axes and axes labels
	drawAxis.call(this, params);

	//enter()
	this.selectAll(".bar")
		.data(params.data)
		.enter()
			.append("rect")
			.classed("bar", true)
			.on("mouseover", function(d,i){
				d3.select(this).style("fill", "yellow")
				tooltip.style("opacity", 1)
               .style("left",(d3.event.pageX)+"px")
               .style("top",(d3.event.pageY)+"px")
               .style("width","auto")
               .style("height","auto")
               .style("padding","10px")
               .html("The Mean housing price of "+d.key+" is $"+d.value);
						
				
			}).on("mousemove", function(d,i){

			})
			.on("mouseout", function(d,i){
				d3.select(this).style("fill", ordinalColorScale(i))
								tooltip.style("opacity", 0);	   
			});



	//update
	this.selectAll(".bar")
		.transition()
		.attr("x", function(d,i){
			return x(d.key);
		})
		.attr("y", function(d,i){
			return y(d.value);
		})
		.attr("height", function(d,i){
			return height - y(d.value);
		})
		.attr("width", function(d){
			return x.rangeBand();
		})
		.style("fill", function(d,i){
			return ordinalColorScale(i);
		});

	this.selectAll(".bar-label")
		.transition()
		.attr("x", function(d,i){
			return x(d.key) + (x.rangeBand()/2)
		})
		.attr("dx", 0)
		.attr("y", function(d,i){
			return y(d.value);
		})
		.attr("dy", -6)
		.text(function(d){
			return d.value;
		})

	//exit()
	this.selectAll(".bar")
		.data(params.data)
		.exit()
		.remove();

	this.selectAll(".bar-label")
		.data(params.data)
		.exit()
		.remove();
		
	
		
}

sort_btn.on("click", function(){
	var self = d3.select(this);
	var ascending = function(a,b){
		return a.value - b.value;
	};
	var descending = function(a,b){
		return b.value - a.value;
	}
	var state = +self.attr("state");
	var txt = "Prices in ";
	if(state === 0){
		data.sort(ascending);
		state = 1;
		txt += "Descending Order";
	} else if(state === 1){
		data.sort(descending);
		state = 0;
		txt += "Ascending Order";
	}
	self.attr("state", state);
	self.html(txt);

	plot.call(chart1, {
		data: data,
		axis:{
			x: xAxis,
			y: yAxis
		},
		gridlines: yGridlines,
		initialize: false
	});
});

plot.call(chart1, {
	data: data,
	axis:{
		x: xAxis,
		y: yAxis
	},
	gridlines: yGridlines,
	initialize: true
});



