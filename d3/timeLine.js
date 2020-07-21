//convention for styling the dimensions of the SVG
var margin = { top: 40, right: 20, bottom: 40, left: 40 };
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var svg = d3
  .select("body")
  .append("svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${
      height + margin.top + margin.bottom
    }`
  )
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set x scale
var x = d3.scaleBand().rangeRound([0, width]).padding(0.5).align(0.1);

//yScale
var y = d3.scaleLinear().rangeRound([height, 0]);

// set the colors
var colors = ["#00D7D2", "#FF4436", "#313c53"];

// Define the div for the tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//function that is called when the event is clicked
function loadHtml(clickedBar) {
  d3.selectAll("iframe").attr(
    "src",
    `https://en.wikipedia.org/wiki/${clickedBar.data.eventName}`
  );
  $(".modal-title").text(clickedBar.data.eventName);
}

//this gets us the data
d3.json("data/data.json", function (err, data) {
  //get all unique years and their events
  var unique_years = d3
    .nest()
    .key(function (d) {
      return d.eventYear;
    })
    .entries(data);
  console.log(unique_years);

  //array used to help load data info formatedData
  let formatedEvents = [];
  //formated data will go in here
  let formatedData = [];

  //This adds a new key, value pair of place
  //looping through each year
  for (event in unique_years) {
    //gets all events for a specific year
    formatedEvents = unique_years[event].values;
    //loop through the events
    formatedEvents.map(function (event, i) {
      //assign a place property to the event based off of its index
      event.place = ++i;
      //push the event to the new array of Objects
      formatedData.push(event);
    });
  }

  //returns the different event types
  var allGroup = d3
    .map(formatedData, function (d) {
      return d.type;
    })
    .keys();

  //creates the key that will be used for the stack
  var stack = d3.stack().keys(["place"]);
  //the data that will be used for the stack
  var stackedSeries = stack(formatedData);

  // add the options to the button
  d3.select("#selectButton")
    .selectAll("myOptions")
    .data(allGroup)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }); // corresponding value returned by the button

  // Create a g element for each series
  var g = d3
    .select("g")
    .selectAll("g.series")
    .data(stackedSeries)
    .enter()
    .append("g")
    .classed("series", true)
    .style("fill", (d, i) => {
      return colors[i];
    });
  x.domain(
    formatedData.map((d) => {
      return d.eventYear;
    })
  );

  //find the max value, its adds them up and finds the max
  y.domain([
    0,
    d3.max(stackedSeries, (d) => {
      return d3.max(d, (d) => {
        return d[0] + d[1];
      });
    }),
  ]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));

  g.selectAll("rect")
    .data((d) => {
      return d;
    })
    .enter()
    .append("rect")
    .attr("height", (d) => {
      //This takes the height of the svg divides it by
      //the largest stack
      return (
        height /
        d3.max(stackedSeries, (d) => {
          return d3.max(d, (d) => {
            return d[0] + d[1];
          });
        })
      );
    })
    .attr("y", (d) => {
      return y(d[0] + d[1]);
    })
    .attr("x", (d, i) => {
      return x(d.data.eventYear);
    })
    .attr("width", x.bandwidth())
    .attr("stroke", function (d, i) {
      return "black";
    })
    .attr("data-toggle", "modal")
    .attr("data-target", "#wikiModal")
    //mouse hover function
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", ".85");
      div.transition().duration(50).style("opacity", 1);
      event = d.data.eventName;
      //creating variables to hold the data
      var newHtml = [];
      let year = "";
      let title = "";
      let imageUrl = "";
      //for in loop to iterate thru the object
      //depending on the key it'll pass its value to the appropriate variable
      for (key in d.data) {
        if (key === "eventName") {
          title = d.data[key];
        }
        if (key === "eventYear") {
          year = d.data[key];
        }
        if (key === "image") {
          imageUrl = d.data[key];
        }
      }
      //push this into the newHtml array to create the tooltip
      newHtml.push(
        "<div class='card' style='width: 18rem;'>",
        `<img src='Rozsa-Peter.png' class='card-img-top' alt='...'>`,
        "<div class='card-body'>",
        "<h5 class='card-title'>" + title + "</h5>",
        "<p class='card-text'>" + year + "</p>",
        "</div>",
        "</div>"
      );
      div
        .html(newHtml.join(""))
        //this will style the newly added html
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 100 + "px");
    })
    //when you hover outside of the bar it'll run this function.
    .on("mouseout", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", "1");
      div.transition().duration("50").style("opacity", 0);
    })
    //onClick function that runs another function to open an iframe
    .on("click", function (d) {
      loadHtml(d);
    });

  // A function that update the chart
  function update(selectedGroup) {
    //erase the series
    d3.selectAll("g.series").remove();

    // Create new data format with the selection?
    var dataFilter = data.filter(function (d) {
      //if the selected group is none return all of the data
      if (selectedGroup === "None") {
        return data;
        //else return the data that matches the selected group ONLY
      } else return d.type == selectedGroup;
    });

    var unique_years2 = d3
      .nest()
      .key(function (d) {
        return d.eventYear;
      })
      .entries(dataFilter);

    let formatedEvents2 = [];
    let formatedData2 = [];

    //looping through each year
    for (event in unique_years2) {
      //gets all events for a specific year
      formatedEvents2 = unique_years2[event].values;
      //loop through the events
      formatedEvents2.map(function (event, i) {
        //assign a place property to the event based off of its index
        event.place = ++i;
        //push the event to the new array of Objects
        formatedData2.push(event);
      });
    }
    var stack2 = d3.stack().keys(["place"]);
    var stackedSeries2 = stack2(dataFilter);

    var g = d3
      .select("g")
      .selectAll("g.series")
      .data(stackedSeries2)

      .enter()
      .append("g")
      .classed("series", true)
      .style("fill", (d, i) => {
        return colors[i];
      });

    x.domain(
      data.map((d) => {
        return d.eventYear;
      })
    );

    //find the max value, its adds them up and finds the max
    y.domain([
      0,
      d3.max(stackedSeries2, (d) => {
        return d3.max(d, (d) => {
          return d[0] + d[1];
        });
      }),
    ]);

    g.selectAll("rect")
      .data((d) => {
        return d;
      })
      .enter()
      .append("rect")

      .attr("height", (d) => {
        return (
          height /
          d3.max(stackedSeries2, (d) => {
            return d3.max(d, (d) => {
              return d[0] + d[1];
            });
          })
        );
      })
      .attr("y", (d) => {
        return y(d[0] + d[1]);
      })
      .attr("x", (d, i) => {
        return x(d.data.eventYear);
      })
      .attr("width", x.bandwidth())
      .attr("stroke", function (d, i) {
        return "black";
      })
      .attr("data-toggle", "modal")
      .attr("data-target", "#wikiModal")
      .on("mouseover", function (d, i) {
        d3.select(this).transition().duration("50").attr("opacity", ".85");
        div.transition().duration(50).style("opacity", 1);
        event = d.data.eventName;
        //creating variables to hold the data
        var newHtml = [];
        let year = "";
        let title = "";
        let imageUrl = "";

        for (key in d.data) {
          if (key === "eventName") {
            title = d.data[key];
          }
          if (key === "eventYear") {
            year = d.data[key];
          }
          if (key === "image") {
            imageUrl = d.data[key];
          }
        }
        newHtml.push(
          "<div class='card' style='width: 18rem;'>",
          `<img src='Rozsa-Peter.png' class='card-img-top' alt='...'>`,
          "<div class='card-body'>",
          "<h5 class='card-title'>" + title + "</h5>",
          "<p class='card-text'>" + year + "</p>",
          "</div>",
          "</div>"
        );
        div
          .html(newHtml.join(""))
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 100 + "px");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).transition().duration("50").attr("opacity", "1");
        div.transition().duration("50").style("opacity", 0);
      })
      .on("click", function (d) {
        loadHtml(d);
      });
  }

  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value");
    if (selectedOption === "None") {
      update("None");
    } else update(selectedOption);

    // run the updateChart function with this selected option
  });
});
