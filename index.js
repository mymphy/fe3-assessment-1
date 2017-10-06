// Based on https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998 by Alan Dunning

// Define margins and size 
var svg = d3.select("svg"); // Selects the "svg" from the HTML file 
var margin = {top: 10, right: 50, bottom: 10, left: 110}; // Define the margin , unit is px
var width = 800 - margin.left - margin.right; // Define width 800 - 110 - 50 = 640px
var height = 500 - margin.top - margin.bottom; // Define height 500 - 10 - 10 = 480px

// Scales and axes
var x = d3
    .scaleLinear() // Map a serial set of input values to output values
                  // The data grow to fit a specific range
    .range([0, width]); // The value to scale the data to.
                        // Starts at 0 and goes till highest value on the width.
var y = d3
    .scaleBand() // Maps a serial set of input values to output values.
    .range([0, height]); // The value to scale the data to.
                        // Starts at 0 and goes till highest value.
// Creating extra elements
var g = svg
    .append("g") // Create "g" element inside the svg element from line 4.
                // Then append a g element to our SVG element so that 
                // everything added to the g element will be grouped together.
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Add additional elements 
    //translates between the data input and the display (x, y) on the canvas

var tooltip = d3 // Element tooltip for the hover effect 
    .select("body") // Selects the "body" from the HTML file.
    .append("div") // Create "div" element inside the body element from line 29.
    .attr("class", "toolTip"); // Add class element with the name of "toolTip".

// Load data
d3.tsv("languages.tsv", function(error, data) { 
  if (error) throw error; // Load the data of the ".tsv" file into
                         // the d3js graph.

    //Handle data
    x.domain([0, d3.max(data, function(d) { return d.speakers; })]);
     /* 
        domain specifies your data maximum and minimum
        The code above assign the data of the ".tsv" file to the x axis
        In this case the data of the column "speakers".   
    */      

    y.domain(data.map(function(d) { return d.language; })).padding(0.1);
    /*
        The code above assign the data of the ".tsv" file to the y axis
        In this case the data of the column "language".
    */ 

    // Assign color to data
    var colors = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.speakers; })])
    .range(["#ff8832", "#c61c6f"]);
    /*
        I want the height of the elements to be meaningful.
        Set the maximum value of the bar data in the domain. 
        In the range I included a range of colors, that goes in an array.
        The color used will be between the orange and the pink.
    */

    // x axis
    g.append("g") // Create "g" element inside the g element created in line 17.
        .attr("class", "x axis") // Add class element with the name of "x axis".
        .attr("transform", "translate(0," + height + ")")  // Calculates where the x axis has to appear. 
        .call(d3.axisBottom(x).ticks().tickFormat(function(d) { return parseInt(d / 1000000); }).tickSizeInner([-height]))
        .append("text") // Add text 
        .attr("class", "label") // Add class element with the name of "label".
        .attr("x", width) // Set x position.
        .attr("y", 30) // Set y position.
        .style("text-anchor", "end") // Text end alignment
        .text("number of total speakers (x 1.000.000)"); // The text that will be shown.
         /*
            .call() is used to call outside selections. xAxis / yAxis are selections 
            that exist outside the method chain, they can be called into the current
            selection using .call(). 
            .call() lets us separate the code for generating the axis from code that 
            adds the axis to the graph.
            x axis data starts at the bottom. 
            parseInt is used to make the numbers smaller. 
        */

    // Y axis
    g.append("g") // Create "g" element inside the g element created in line 17. 
        .attr("class", "y axis") // Add class element with the name of "y axis".
        .call(d3.axisLeft(y)) // Assign the data of the y axis to show on the the left of the axis
        .append("text") // Add text 
        .attr("class", "label") // Add class element with the name of "label".
        .attr("transform", "rotate(-90)") // rotates element -90grades
        .attr("y", -100) // Set y position
        .text("Languages"); // The text that will be shown.

    // bars
    var graphBar = g.selectAll(".bar") // selectAll() is used to get a selection of
                                      // elements, and data() is bound to them. 
        .data(data) //enter() is used to add the elements to the chart.
        .enter().append("rect")  // Create "rect" element inside the g element created in line 17. 
        .attr("class", "bar")  // Add class element with the name of "bar".
        .attr("x", 0) // Start x position. 
        .attr("height", y.bandwidth()) // Y position is assigned to the y bandwidth. 
        .attr("y", function(d) { return y(d.language); }) //callback function to get the y position of de column data language. 
        .attr("width", function(d) { return x(d.speakers); }) //callback function to get the witdh size of de column data speakers.
        .attr('fill', function(d){return colors(d.speakers)}) //callback function colors This assign the color to teh bar. The higher the bar is it will be pink. The lower it will be orange. The bar in between will get the colors in between de colors assign in the function color on line 53.
        
        // add event 
        /*
        mousemove event triggers every time the mouse pointer is moved over the div element.
        */
        .on("mousemove", function(d){
            //tooltip
            tooltip
            .style("border", 1 +"px" + " solid" + " " + colors(d.speakers)) //add a border style in the same style as the bar. 
                .style("left", x(d.speakers) + 130 + "px") // add style on the tooltip (inside the bar)
                /*
                    It starts from the left then it go to the rigth with the bar 
                    chart and + 130 px.
                    The tooltip will appear a few px next to the hovered bar.
                */           
                .style("top",y(d.language) + 25  + "px")
                 /*
                    It starts from the top then it go to the direction from the 
                    hovered balk and add 25 px.
                    The tooltip will appear a the same level as the hovered balk.
                */   
                .style("display", "inline-block") // Set style display to inline-block
                .html((d.language) + "<br>" + (d.speakers)); 
                /* 
                    Text that will be showed inside the tolltip. 
                    The Data of the language and under the full number of speakers of 
                    language.
                */
        })

        /*
           mouseover event triggers when the mouse pointer enters the div element.
        */
        .on("mouseover", function(d) {
            d3.select(this).style("opacity", .3); // For the selected element turn the opacity to .3.
        })

       /*
        mouseout event occurs when the mouse pointer is moved out of the div element
       */
        .on("mouseout", function(d){ 
            tooltip
                .style("display", "none");
                /*
                    On mouseout the selected element will set it self back to the
                    original display: none.
                */
        })
            
        .on("mouseout", function(){
            d3.select(this).style("opacity", 1); 
            /* 
                On mouseout the selected element will set it self back to the original
                style, in this case: opacity: 1.
            */
        });
           
});
