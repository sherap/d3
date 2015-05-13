/**
 * New York State DEC
 * Greenhouse Gas Emissions from Fuel Combustion
 * Million Metric Tons
 * 
 * Work based on Mike Bostock's block #3943967.
 */

var file = "Greenhouse_Gas_Emissions_From_Fuel_Combustion__Million_Metric_Tons__Beginning_1990.csv";
var margin = {top: 70, right:10, bottom: 20, left: 30};
var width = 960 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

d3.csv(file, accessor, dataCallback);

function accessor(d) {
    return {
        year:           +d.Year,
        residential:    +d[ 'Residential Total' ],
        commercial:     +d[ 'Commercial Total' ],
        industrial:     +d[ 'Industrial Total' ],
        transportation: +d[ 'Transportation Total' ],
        generation:     +d[ 'Electric Generation Total' ],
        imports:        +d[ 'Net Imports of Electricity' ]
    }
}

function dataCallback(error, data) {

    if (error) {
        return console.warn(error);
    }

    data.sort(compare);

    // Each series of values over time will count as a 'layer'.
    var series = [];
    series[0] = data.map(mapResidential);
    series[1] = data.map(mapCommercial);
    series[2] = data.map(mapIndustrial);
    series[3] = data.map(mapTransportation);
    series[4] = data.map(mapGeneration);
    series[5] = data.map(mapImports);
    var stack = d3.layout.stack();
    var layers = stack(series);
    var layerCount = series.length;

    var yGroupMax = d3.max(layers, function(layer) {
        return d3.max(layer, function(d) { return d.y; });
    });

    var yStackMax = d3.max(layers, function(layer) {
        return d3.max(layer, function(d) { return d.y0 + d.y; });
    });

    var xScale = d3.scale.ordinal()
        .domain(data.map(mapYear))
        .rangeRoundBands([0, width], 0.08);

    var yScale = d3.scale.linear()
        .domain([0, yStackMax])
        .range([height, 0]);

    var color = d3.scale.linear()
        .domain([0, layerCount-1])
        .range(["#e6550d", "#fdd0a2"]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

     /* tickSize: tick mark length (inner), and axis-terminating (outer) tick mark length.
        Setting outerTickSize to nonzero creates an area within a path element which can be filled.
      */
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(8, 0)
        .tickPadding(6)
        .orient("left");

    // modify the document
    var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("svg:g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color(i); });

    var rect = layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.x); })
        .attr("y", height) 
        .attr("width", xScale.rangeBand())
        .attr("height", 0);

    // On transition, reset y and height attributes of the data rectangle
    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return yScale(d.y0 + d.y); })
        .attr("height", function(d) { return yScale(d.y0) - yScale(d.y0 + d.y); });


    svg.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    svg.append("svg:g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "title")
        .attr("dx", "1em")
        .attr("dy", "-1.5em")
        .text("New York State Greenhouse Gas Emissions from Fuel Combustion");

    svg.append("text")
        .attr("class", "subtitle")
        .attr("dx", "3em")
        .attr("dy", "-.5em")
        .text("million metric tons");
}


function compare(a, b) {
    if (a.year < b.year) 
        return -1;
    if (a.year > b.year)
        return 1;
    return 0;
}

function mapYear(element, index) {
    return element.year;
}

function mapResidential(element) {
    return {x: element.year, y: element.residential};
}

function mapCommercial(element) {
    return {x: element.year, y: element.commercial};
}

function mapIndustrial(element) {
    return {x: element.year, y: element.industrial};
}

function mapTransportation(element) {
    return {x: element.year, y: element.transportation};
}

function mapGeneration(element) {
    return {x: element.year, y: element.generation};
}

function mapImports(element) {
    return {x: element.year, y: element.imports};
}
