// Set up the data for the chart
const data = [
    { name: "Sep 2019", value: 708.6 },
    { name: "Mar 2020", value: 754.6 },
    { name: "Sep 2020", value: 738.6 },
    { name: "Mar 2021", value: 834.6 },
    { name: "Sep 2021", value: 920.8 },
    ];

    // Set up the dimensions of the chart
    const width = document.querySelector('.col-sm-6').offsetWidth - 80;
    const height = document.querySelector('#chart1').offsetHeight * 0.9;
    var barPadding = width/data.length - (width/data.length * 0.5);
    
    // Set up the x and y scales for the chart
    const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(data.map((d) => d.name));
                
    const y = d3.scaleLinear()
                .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
                .range([height + barPadding - 50, barPadding]);

    // Create scalable x and y-axis
    var xAxis = d3.axisBottom()
                .tickValues(["Sep 2019", "Sep 2020", "Sep 2021"])
                .scale(x);

    var yAxis = d3.axisLeft()
                .ticks(data.length * 4)
                .scale(y);

    // Calculate the starting and ending values for each data point
    let initial = 0;
    for (let i = 0; i < data.length; i++)
    {
        if (i == 0)
        {
            data[i].start = initial;
            initial += (data[i].value);
            data[i].end = initial;
        }
        else
        {
            data[i].start = initial;
            initial += (data[i].value - data[i-1].value);
            data[i].end = initial;
        }
    }

    // Set the domain for the y scale based on the starting and ending values
    y.domain([0, d3.max(data, (d) => d.end)]);

    // Create the SVG element and set its dimensions
    const svg = d3
    .select("#chart1")
    .append("svg")
    .attr("width", width + 50)
    .attr("height", height + 40)
    .append("g")
    .attr("transform", "translate(" + 50 + "," + -10 + ")");

    // Add the bars to the chart
    svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d,i) => "bar " + ((i > 0 && d.value < data[i-1].value) ? "negative" : "positive")) //use this one to customize the bar color on CSs.
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(Math.max(d.start, d.end)))
    .attr("width", x.bandwidth())
    .attr("height", (d) => Math.abs(y(d.start) - y(d.end)))
    // Apply effect that when user hover a bar, other bars will faded
    .on("mouseover", function (event, d)
        {
            // Show a small box about the bar's value being hover on
            d3.select(this).append("title").text(`${d.name}: ${d.value}`);

            // Emphasize the bar being hovered on
            d3.select(this).style("opacity", 1);
            svg.selectAll(".bar:not(:hover)").style("opacity", 0.2);

            var xPosition = parseFloat(d3.select(this).attr("x"));
            var yPosition = parseFloat(d3.select(this).attr("y"));
            var value = d;

            // Adding label for each item
            svg.append("text")
            .attr("id","tooltip")
            .attr("x", xPosition + x.bandwidth() / 4)
            .attr("y",  yPosition - 10)
            .text(value.value)
            .attr("fill","black")
            .attr("position", "relative")
            .attr("z-index",1)
            .style("font-size", "14px")
            .attr("font-family","Times New Roman");
        })
    // When the user not hover on that bar anymore, make every other bars normal again
    .on("mouseout", function (event, d)
        {
            svg.selectAll(".bar").style("opacity", 1);

            d3.select("#tooltip").remove();
        });
    
    // Add the label of each item in the chart
    // svg.selectAll("text")
    // .data(data)
    // .enter()
    // .append("text")
    // .attr("class", "tool")
    // .attr("x", (d) => x(d.name) + x.bandwidth() / 2 - 20)
    // .attr("y",  (d) => y(Math.max(d.start, d.end) + 10))
    // .text(function(d) { return d.value; })
    // .attr("fill","black")
    // .attr("position", "relative")
    // .attr("z-index",1)
    // .style("font-size", "14px")
    // .attr("font-family","Times New Roman");

    // Add the axis labels to the chart
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (height - barPadding + 8.5) +")")
        .call(xAxis)
        .style("font-size", "14px")
        .attr("font-family","Times New Roman");

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .style("font-size", "14px")
        .attr("font-family","Times New Roman");

    // Add the x axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 100)
        .attr("y", height + 45)
        .text("Quarter")
        .style("font-size", "18px")
        .attr("font-family","Times New Roman")
        .attr("font-weight", "bold");

    // Add the y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", -300)
        .attr("y", -35)
        .attr("transform", "rotate(-90)")
        .text("Cost of Living ($thousand)")
        .attr("font-family","Times New Roman")
        .attr("font-weight", "bold")
        .attr("font-size", "18px");