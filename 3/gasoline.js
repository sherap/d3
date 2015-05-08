
/**
 * https://data.ny.gov/Energy-Environment/Estimated-Gasoline-Sales-Thousands-of-Gallons-Begi/cwrk-j5nn
 */

var datafile = "Estimated_Gasoline_Sales__Thousands_of_Gallons__Beginning_1995.csv";

var width = 1280;
var barHeight = 20;

var xscale = d3.scale.linear()
    .range([0, width]);

var chart = d3.select("#chart")
    .attr("width", width);

d3.csv(datafile, dataCallback);

function dataCallback(error, rows) {

    rows = rows.filter(function(element) {
        if (element.Year == "1996") {
            return true;
        }
        return false;
    })

    rows = d3.entries(rows[0])
        .filter(function(element) {
            if ((element.key == "Year") || (element.key == "Statewide Total")) {
                return false;
            }
            return true;
        });

    rows.forEach(function(element) { element.value = +element.value; });
    xscale.domain([0, d3.max(rows, function(d) { return d.value })]);

    chart.attr("height", barHeight * rows.length);
    
    var bar = chart.selectAll("g")
        .data(rows)
        .enter().append("svg:g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return xscale(d.value); })
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", function(d) { return xscale(d.value) - 3; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.key; });
};


    



