
(function() {
    "use strict";

    createScatterTimeWatched();
    createScatterPercentWatched();

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

})();