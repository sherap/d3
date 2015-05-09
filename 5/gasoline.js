/**
 * https://data.ny.gov/Energy-Environment/Estimated-Gasoline-Sales-Thousands-of-Gallons-Begi/cwrk-j5nn
 */
var datafile = "Estimated_Gasoline_Sales__Thousands_of_Gallons__Beginning_1995.csv";
var year = "2000";

var diameter = 960;
var margin = { top: 60, bottom: 0};
var format = d3.format(",d");
var color = d3.scale.category10();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#chart")
    .attr("width", diameter)
    .attr("height", diameter + margin.top)

var nys = newNewYorkState(d3);
d3.csv(datafile, dataCallback);

svg.append("text")
    .attr("class", "heading")
    .attr("x", (diameter/2))
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .text("New York State DEC: Estimated Gasoline Sales, Thousands of Gallons, " + year);

function dataCallback(error, rows) {

    rows = rows.filter(function(element) {
        if (element.Year == year) {
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

    // tooltip
    node.append("title")
        .text(function(d) { return d.key + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(nys.getRegion(d.key)) });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.key });
};


    



