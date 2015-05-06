/* chromium-browser --allow-file-access-from-files */
var S1 = "https://raw.githubusercontent.com/CityOfPhiladelphia/open-budget-data/master/FY2016-proposed.csv";
var S2 = "FY2016-proposed.csv";

var width = 960;
var height = 740;
var radius = Math.min(width, height) / 2;
var color = d3.scale.category20();

// Construct an arg generator.
// for a pie chart, the inner radius is always 0.
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// Construct a pie layout function
// disable sorting
// specify the value accessor
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d, i) { return d.values; });

// Create the svg of a specific size
// with a transform of x + 1/2 width, y + 1/2 height to place 0,0 in center.
var svg = d3.select("body")
    .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

// Process the data
d3.csv(S2, function(error, rows) {

    // Filter by Fund value
    rows = rows.filter(function(e) { 
        if (e.Fund == "General Fund") {
            return true;
        }
        return false;
    });

    // Sum Total by Department
    var byDept = d3.nest()
        .key(function(d) { return d.Department; })
        .rollup(function(values) { 
            return d3.sum(values, function(d) { return +d.Total; })
        })
        .entries(rows);

    // Select svg sub elements of class "arc" - initially an empty selection,
    // join with totals by dept, processed by the pie layout function
    // create one g element of class "arc" per data element

    var g = svg.selectAll(".arc")
        .data(pie(byDept))
        .enter().append("svg:g")
            .attr("class", "arc");

    // Each g element has corresponding data joined to it by the d3 library
    // To each append an svg:path made by the arc generating function from the data
    // and a fill color determined by the Department.

    g.append("svg:path")
        .attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.key);
        });
});

