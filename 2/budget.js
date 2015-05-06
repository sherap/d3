(function(d3) {
    'use strict';

    /* chromium-browser --allow-file-access-from-files */
    var data1 = "https://raw.githubusercontent.com/CityOfPhiladelphia/open-budget-data/master/FY2016-proposed.csv";
    var data2 = "FY2016-proposed.csv";

    var width = 960;
    var height = 740;
    var radius = Math.min(width, height) / 2;
    var color = d3.scale.category20();

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d, i) { return d.values; });

    var svg = d3.select("#chart")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    d3.csv(data2, realizeCallback);

    function realizeCallback(error, dataset) {

        dataset = dataset.filter(function(e) { 
            if (e.Fund == "General Fund") {
                return true;
            }
            return false;
        });

        var byDept = d3.nest()
            .key(function(d) { return d.Department; })
            .rollup(function(values) { 
                return d3.sum(values, function(d) { return +d.Total; })
            })
            .entries(dataset);

        var path = svg.selectAll(".arc")
            .data(pie(byDept))
            .enter()
            .append("svg:g")
            .attr("class", "arc")
            .append("svg:path")
            .attr("d", arc)
            .style("fill", function(d) {
                return color(d.data.key);
            })

        var format = d3.format(",d");
        path.on("mouseover", function(d) { 
            tooltip.html(d.data.key + " " + format(d.data.values));
            tooltip.style("top", (d3.event.pageY + 2) + "px");
            tooltip.style("left", (d3.event.pageX + 2) + "px");
            tooltip.style("display", "block");
        });

        path.on("mouseout", function(d) {
            tooltip.style("display", "none");
        });
    };

})(window.d3);
