/*global d3:false */

function createScatter(idName, dataset) {
	//Width and height
	var w = 500;
	var h = 300;
	var padding = 30;

	//Create scale functions
	var xScale = d3.scale.linear()
		.domain([0, 100])
		.range([padding, w - padding * 2]);

	var yScale = d3.scale.linear()
		.domain([0, 20])
		.range([h - padding, padding]);

	//Define X axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(20);

	//Define Y axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);

	//Create SVG element
	var svg = d3.select(idName)
		.insert("svg")
		.attr("width", w)
		.attr("height", h);

	//Create circles
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", function (d) {
			return xScale(d[0]);
		})
		.attr("cy", function (d) {
			return yScale(d[1]);
		})
		.attr("r", 2);

	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);

	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

}

function createBar(idName, dataset) {

	var margin = {top: 20, right: 30, bottom: 30, left: 40},
		width = 500 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = d3.select(idName)
		.insert("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(dataset.map(function(d) { return d.name; }));
	y.domain([0, d3.max(dataset, function(d) { return d.value; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	svg.selectAll(".bar")
		.data(dataset)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.attr("width", x.rangeBand());
}

(function() {
	"use strict";

	createScatterTimeWatched();
	createScatterPercentWatched();
	createBarFailedAttempts();
	createBarAnswers();
	createBarRewatch();

	function createScatterTimeWatched() {

		var numDataPoints = 20;
		var xRange = 100;
		var yRange = 20;
		var dataset = [];
		for (var i = 0; i < numDataPoints; i++) {
			var newNumber1 = Math.round(Math.random() * xRange);
			var newNumber2 = Math.round(Math.random() * yRange);
			dataset.push([newNumber1, newNumber2]);
		}
		
		createScatter("#svg-scatter-time-watched", dataset);
	}

	function createScatterPercentWatched() {

		var numDataPoints = 20;
		var xRange = 100;
		var yRange = 20;
		var dataset = [];
		for (var i = 0; i < numDataPoints; i++) {
			var newNumber1 = Math.round(Math.random() * xRange);
			var newNumber2 = Math.round(Math.random() * yRange);
			dataset.push([newNumber1, newNumber2]);
		}

		createScatter("#svg-scatter-percent-watched", dataset);
	}

	function createBarFailedAttempts() {
		var dataset = [{name : "0", value: 10}, {name: "1", value: 5}, {name: "2", value: 2},{name: "3", value: 0}, {name: "4", value: 1} ];
		createBar("#svg-q1-failed-attempts", dataset);
	}

	function createBarRewatch() {
		var dataset = [{name : "Rewatched segment", value: 25}, {name: "Continued", value: 4}];
		createBar("#svg-q1-rewatch", dataset);
	}

	function createBarAnswers() {
		var dataset = [{name : "cheese", value: 10}, {name: "cheeese", value: 15}, {name: "bob", value: 1}];
		createBar("#svg-q1-answers", dataset);
	}

})();