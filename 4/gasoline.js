
/**
 * https://data.ny.gov/Energy-Environment/Estimated-Gasoline-Sales-Thousands-of-Gallons-Begi/cwrk-j5nn
 */

var datafile = "Estimated_Gasoline_Sales__Thousands_of_Gallons__Beginning_1995.csv";

var diameter = 960;
var format = d3.format(",d");

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#chart")
    .attr("width", diameter)
    .attr("height", diameter);

d3.csv(datafile, dataCallback);

function dataCallback(error, rows) {

    // Take 1996
    rows = rows.filter(function(element) {
        if (element.Year == "1996") {
            return true;
        }
        return false;
    })

    // Convert the remaining row to an array of objects containing key,value and remove metadata
    rows = d3.entries(rows[0])
        .filter(function(element) {
            if ((element.key == "Year") || (element.key == "Statewide Total")) {
                return false;
            }
            return true;
        });

    // Convert to numeric
    rows.forEach(function(element) { element.value = +element.value; });

    var root = { "name" : "New York",
                 "children" : rows };

    var node = svg.selectAll(".node")
        .data(bubble.nodes(root)
        .filter(function(d) { return !d.children; }))
        .enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.key + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return "goldenrod" });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.key });
};


    



