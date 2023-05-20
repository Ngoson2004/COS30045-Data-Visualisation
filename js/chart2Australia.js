// Define the dimensions of the chart
const margin = {top: 70, right: 60, bottom: 150, left: 80}
const width = document.querySelector('.col-4').offsetWidth  - margin.left - margin.right;
const height = document.querySelector('#chart1').offsetHeight * 0.8 - margin.top - margin.bottom;

// Set up the scales for x and y axes
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the lines
var lineGDP = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.GDPGrowth); });

var lineUnemployment = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.UnemploymentRate); });

var linePoverty = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.PovertyRate); });

// Create the SVG element and append it to the body of the page
var svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create a text element for the year label
var yearLabel = svg.append("text")
    .attr("class", "year-label")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif");

// Create a text element for the year label
var GDPGrowthLabel = svg.append("text")
    .attr("id", "GDPGrowth-label")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("opacity", 1);

// Create a text element for the year label
var UnemploymentRateLabel = svg.append("text")
    .attr("id", "UnemploymentRate-label")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("opacity", 1);

// Create a text element for the year label
var PovertyRateLabel = svg.append("text")
    .attr("id", "PovertyRate-label")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("opacity", 1);

// Load the CSV data
d3.csv("./csv/AustraliaData2.csv").then(function(data)
{
    // Format the data
    data.forEach(function(d)
    {
        d.Year = +d.Year;
        d.GDPGrowth = +d.GDPGrowth;
        d.UnemploymentRate = +d.UnemploymentRate;
        d.PovertyRate = +d.PovertyRate;
    });

    // Set the domains of the x and y scales
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([d3.min(data, function(d) { return Math.min(d.GDPGrowth, d.UnemploymentRate, d.PovertyRate); }), d3.max(data, function(d) { return Math.max(d.GDPGrowth, d.UnemploymentRate, d.PovertyRate); })]).nice();

    // Add the X axis
    svg.append("g")
        .attr("transform", `translate(0, height + 50)`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .transition()
        .duration(1000)
        .attr("transform", `translate(0,${height})`)
        .style("opacity", 1);

    // Add the x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .attr("transform", `translate(0, 70)`)
        .text("YEARS")
        .style("font-size", "18px")
        .style("font-weight", 700)
        .attr("font-family","Times New Roman")
        .transition()
        .duration(1000)
        .attr("transform", `translate(0,0)`)
        .style("opacity", 1);

    // Add the y-axis labels to the chart
    svg.append("g")
        .attr("transform", "translate(-50, 0)")
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .call(d3.axisLeft(y))
        .transition()
        .duration(1000)
        .attr("transform", `translate(0,0)`)
        .style("opacity", 1)
        .selectAll(".tick text")
        .style("color", (d, i, nodes) =>
            {
                if (i == 1)
                {
                    return "#ff0000"; // Red color
                }
                else
                {
                    return "black"; 
                }
            });


    // Add the y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left * 2)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("PERCENTAGE (%)")
        .attr("font-family","Times New Roman")
        .attr("font-size", "18px")
        .style("font-weight", 700)
        .transition()
        .duration(1000)
        .attr("y", -70)
        .attr("x", 0 - (height / 2))
        .style("opacity", 1);

    // Add the GDP line
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("opacity", 0)
        .attr("fill", "none")
        .style("stroke", "#7fc97f")
        .attr("d", lineGDP)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Add the unemployment line
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("opacity", 0)
        .attr("fill", "none")
        .style("stroke", "#beaed4")
        .attr("d", lineUnemployment)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Add the poverty line
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("opacity", 0)
        .attr("fill", "none")
        .style("stroke", "#fdc086")
        .attr("d", linePoverty)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    // Add a circle element for PovertyRate
    const circle1 = svg.append("circle")
        .attr("id", "circle1")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    // Add a circle element for PovertyRate
    const circle2 = svg.append("circle")
        .attr("id", "circle2")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    // Add a circle element for PovertyRate
    const circle3 = svg.append("circle")
        .attr("id", "circle3")
        .attr("r", 0)
        .attr("fill", "steelblue")
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    // create a listening rectangle
    const listeningRect = svg.append("rect")
        .attr("id","overlay")
        .attr("width", width + margin.right)
        .attr("height", height);

    // create the mouse move function
    listeningRect.on("mousemove", function (event)
    {
        const [xCoord] = d3.pointer(event, this);
        const bisectYear = d3.bisector(d => d.Year).left;
        const x0 = x.invert(xCoord);
        const i = bisectYear(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
        const xPos = x(d.Year);
        const yPos1 = y(d.PovertyRate);
        const yPos2 = y(d.UnemploymentRate);
        const yPos3 = y(d.GDPGrowth);

        // Update the circle position
        circle1.attr("cx", xPos)
            .attr("cy", yPos1);

        // Update the circle position
        circle2.attr("cx", xPos)
            .attr("cy", yPos2);

        // Update the circle position
        circle3.attr("cx", xPos)
            .attr("cy", yPos3);

        // Update the year label position and text content
        GDPGrowthLabel.attr("x", xPos + 30)
            .attr("y", yPos3 - 10)
            .attr("text-anchor", "middle")
            .text(`${d3.format(".2f")(d.GDPGrowth)}%`)
            .attr("fill", "#7fc97f")
            .style("opacity", 1);

        UnemploymentRateLabel.attr("x", xPos + 30)
            .attr("y", yPos2 - 10)
            .attr("text-anchor", "middle")
            .text(`${d3.format(".2f")(d.UnemploymentRate)}%`)
            .attr("fill", "#beaed4")
            .style("opacity", 1);

        PovertyRateLabel.attr("x", xPos + 30)
            .attr("y", yPos1 + 20)
            .attr("text-anchor", "middle")
            .text(`${d3.format(".2f")(d.PovertyRate)}%`)
            .attr("fill", "#fdc086")
            .style("opacity", 1);

        // Add transition for the circle radius
        circle1.transition()
            .duration(20)
            .attr("r", 5);

        // Add transition for the circle radius
        circle2.transition()
            .duration(20)
            .attr("r", 5);

        // Add transition for the circle radius
        circle3.transition()
            .duration(20)
            .attr("r", 5);
    });
    // listening rectangle mouse leave function

    listeningRect.on("mouseout", function () 
    {
        circle1.transition()
            .duration(100)
            .attr("r", 0);

        circle2.transition()
            .duration(100)
            .attr("r", 0);

        circle3.transition()
            .duration(100)
            .attr("r", 0);

        GDPGrowthLabel.transition()
            .duration(100)
            .style("opacity", 0);

        UnemploymentRateLabel.transition()
            .duration(100)
            .style("opacity", 0);
        
        PovertyRateLabel.transition()
            .duration(100)
            .style("opacity", 0);
    });

    // Add the chart title
    svg
        .append("text")
        .attr("class", "chart-title")
        .attr("x", -80)
        .attr("y", margin.top - 100)
        .style("font-size", "22px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Australia economic statistic from 2016 to 2021");

    // Append the important line to demonstrate a special milestone on the chart
    svg.append("line")
        .attr("class", "line milestone")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", width)
        .attr("y2", y(0))
        .style("stroke", "red");

    // Set up the legend data
    var legendData = [
        { label: "GDP Growth", color: "#7fc97f" },
        { label: "Unemployment Rate", color: "#beaed4" },
        { label: "Poverty Rate", color: "#fdc086" }
        ];

    // Set up the legend container
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0," + (height + margin.bottom - 60) + ")");

    // Append legend data 
    var legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", function(d, i) {return `translate(0,${i * 20})`;});

    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", function(d) {return d.color;});

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(function(d) {return d.label;});
});