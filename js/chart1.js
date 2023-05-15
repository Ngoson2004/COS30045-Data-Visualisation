// Set up the data for the chart
d3.csv("../csv/statisticsforcanada.csv").then(function(dataset)
{
    waterfallChart(dataset);
})

function waterfallChart(data)
{
    // Set up the dimensions of the chart
    const margin = {top: 70, right: 30, bottom: 60, left: 80}
    const width = document.querySelector('.col-5').offsetWidth  - margin.left - margin.right;
    const height = document.querySelector('#chart1').offsetHeight * 0.85 - margin.top - margin.bottom;

    // Calculate the starting and ending values for each data point
    let initial = 0;
    for (let i = 0; i < data.length; i++)
    {
        if (i == 0)
        {
            data[i].start = initial + 180000;
            initial += (+data[i].Number);
            data[i].end = initial ;
        }
        else
        {
            data[i].start = initial;
            initial += (+data[i].Number - +data[i-1].Number);
            data[i].end = initial;
        }
    }

    // Set up the x and y scales for the chart
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.CensusYears))
        .paddingInner(0.1);
        
    const y = d3.scaleLinear()
        .domain([180000, d3.max(data, (d) => +d.end)])
        .range([height, 0]);

    // Create the SVG element and set its dimensions
    const svg = d3
    .select("#chart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add the chart title
    svg.append("text")
    .attr("id", "chart-title")
    .attr("x", width / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Population Growth in Canada")
    .style("font-size", "24px")
    .style("font-weight", 700)
    ;

    // Add the axis labels to the chart
    svg.append("g")
        .attr("id", "x-axis")
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .call(d3.axisBottom(x)
                // .tickValues(["2017-2018", "2019-2020", "2021-2022"])
                )
        .call(g => g.select(".domain").remove())
        .attr("transform", `translate(0, ${height})`)
        .style("font-weight", 550)
        .style("color", "#777")
        ;
    
    svg.selectAll(".tick line")
        .attr("transform", `translate(0, ${-height})`) // move the tick lines to the top of the chart
        .style("stroke-opacity", 0);
    
    svg.selectAll(".tick text")
        .attr("fill", "#777")
        .attr("y", 10)
        .style("text-anchor", "middle");

    svg.append("g")
        .style("font-size", "14px")
        .attr("font-family","Times New Roman")
        .call(d3.axisLeft(y)
                    .tickFormat(d3.format(".2s"))
                    .ticks(data.length * 4))
        .call(g => g.select(".domain").remove()) 
        .selectAll(".tick text")
        .style("color", "#777") 
        .style("visibility", (d, i, nodes) =>
        {
            if (i === 0)
            {
                return "hidden"; 
            }
            else
            {
                return "visible"; 
            }
        })
        .style("font-weight", 550);
        
    svg.selectAll(".tick line")
        .attr("transform", `translate(0, ${-height})`) // move the tick lines to the top of the chart
        .style("stroke-opacity", 0.2);

    // Add the x axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("CENSUS YEARS")
        .style("font-size", "18px")
        .style("font-weight", 700)
        .attr("font-family","Times New Roman");

    // Add the y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("NUMBER OF PEOPLE")
        .attr("font-family","Times New Roman")
        .attr("font-size", "18px")
        .style("font-weight", 700);

    // Add the bars to the chart
    svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d,i) => "bar " + ((i > 0 && +d.Number < +data[i-1].Number) ? "negative" : "positive")) //use this one to customize the bar color on CSs.
    .attr("x", (d) => x(d.CensusYears))
    .attr("y", (d) => y(Math.max(d.start, d.end)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => Math.abs(y(d.start) - y(d.end)))
    // Apply effect that when user hover a bar, other bars will faded
    .on("mouseover", function (event, d)
        {
            // Show a small box about the bar's value being hover on
            d3.select(this).append("title").text(`${d.CensusYears}: ${+d.Number}`);

            // Emphasize the bar being hovered on
            d3.select(this).style("opacity", 1);
            svg.selectAll(".bar:not(:hover)").style("opacity", 0.1);

            // Add the label for the line
            svg.append("text")
                .attr("id", "hover-label")
                .attr("x", x(d.CensusYears) + x.bandwidth() / 2)
                .attr("y", y(d.end) - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .text(d.Number);
        })
    // When the user not hover on that bar anymore, make every other bars normal again
    .on("mouseout", function (event, d)
        {
            svg.selectAll(".bar").style("opacity", 1);

            svg.select("#hover-label")
                .remove();
        })
    .attr("transform", "translate(0, 0)");

    // Append line to the chart
    const line = d3.line()
                    .x(function(d) {return x(d.CensusYears)})
                    .y(function(d) {return y(d.Number)});

    // Initial the starting point for the line chart on x-axis
    const adjust = x.bandwidth() / 2;

    // Draw the line on the chart
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "1")
        .attr("transform", `translate(${adjust},0)`);
}

