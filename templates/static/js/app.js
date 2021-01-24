// Interactive Dashboard to explore the Belly Button Biodiversity Dataset

console.log("Welcome")

function init() {
  // Select dropdown select menu id and assign it to a variable
  var selectdropdownmenu = d3.select("#selDataset");
  // Read "names" values from json file and append into dropdown menu
    d3.json("./data/samples.json").then((data) => {
    var name = data.names;
    
    name.forEach((sample) => {
      selectdropdownmenu
        .append("option")
        .text(sample)
        .property("value",sample);
    })

    // Use the first sample from the list to build the default metadata and plots   
    var firstSample = name[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    getGauge(firstSample);
    console.log("In the End of of init() function");
  });
};
// Function called by DOM changes
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  getGauge(newSample);
  console.log("In the End of optionChanged(newSample) function");
  };
// Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample from json file for each subject and assign it to a variable
    d3.json("./data/samples.json").then((metadataSample) => {
      //Filter the data
      var metadata = metadataSample.metadata
        .filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata` 
    // and add .html("") to clear any existing metadata
    var subjectmetadata = d3.select("#sample-metadata").html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach(([key,value]) => {
        subjectmetadata.append("h6").text(`${key} : ${value}`);
      });
    });
    console.log("In the End of buildMetadata(sample) function");
};
// Initialize the dashboard
init();

// Build a function to build bar chart , bubble chart
function buildCharts(sample) {
     // Use `d3.json` to fetch each sample data, assign it to a variable, and plot it
    d3.json("./data/samples.json").then((data) => {
    var plotDataset = data.samples.filter(sampleObj => sampleObj.id.toString() == sample)[0];
    console.log("plotDataset=", plotDataset);
    
    var otu_ids = plotDataset.otu_ids;
    var otu_labels = plotDataset.otu_labels;
    var sample_values = plotDataset.sample_values;


    // Create a horizontal bar chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // Data/Trace for bar chart that displays each sample top 10 OTU values
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        hoverlabel: { font: { size: 12 } },
        marker: {
          color: '#143080',
          opacity: 1,
                }
      }
    ];
    // Layout
    var chartLayout = {
      title: {
        text: `Top 10 Bacteria Cultures for Test Subject No. ${sample}`,
        font: {
            family: 'Arial',
            size: 18,
            color: 'black'
              },
            },
      xaxis: {
       tickwidth: 10,
       tickcolor: '#ffffff',
       tickfont: { family: 'Arial', color: 'black' },
       title: {
        text: "Value",
        font: {
            family: 'Arial',
            size: 16,
            color: 'black'
               },
              },
          },
      yaxis: {
        automargin: true,
        tickwidth: 20,
        tickcolor: '#ffffff',
        tickfont: { family: 'Arial', color: 'black' },
        title: {
          text: 'Bacteria ID ',
          font: {
              family: 'Arial',
              size: 16,
              color: 'black'
                },
              },
          },
      width: 460,
      height: 400,
      //margin: { t: 30, r: 15, l: 15, b: 5 },
      //paper_bgcolor: "lavender",
      margin: { t: 30, r: 15 , l: 15 , b: 50},
      //font: { color: "darkblue", family: "Arial" }
    };
    // Render the plot to the div tag with id 'bar'
    Plotly.newPlot("bar", barData, chartLayout);

    // Build a Bubble Chart using the sample data

    // Data/Trace for bubble chart that displays each sample values
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "Earth"
        },
        text: otu_labels
      }];
      var bubbleLayout = {
        title: {
          text: `Bacteria Cultures for Test Subject No. ${sample}`,
          font: {
              family: 'Arial',
              size: 18,
              color: 'black'
          },
      },
        hovermode: "closest",
        xaxis: 
        { tickcolor: '#ffffff',
          title:  
            {
            text: 'OTU ID (Bacteria)',
            font: {
                family: 'Arial',
                size: 16,
                color: 'black'
                  },
            }, 
        },
        yaxis: {
          automargin: true,
          tickcolor: '#ffffff',
          //tickfont: { family: 'Arial', color: 'black' },
          title: {
              text: 'Sample Value',
              font: {
                  family: 'Arial',
                  size: 16,
                  color: 'black'
              },
          },
      },
       //margin: {l: 50, r: 10, t: 30},
        height: 500,
        width: 1200,
       // paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
    };
       // Render the plot to the div tag with id 'bubble'
      Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    });
    console.log("In the End of buildCharts(sample) function");
};

// Gauge chart
function getGauge(sample) {
// Build a Gauge Chart using the sample data

// Use `d3.json` to fetch each sample data, assign it to a variable, and plot it
d3.json("./data/samples.json").then((data) => {
  var plotDataset = data.metadata.filter(sampleObj => sampleObj.id.toString() === sample)[0];
  console.log("plotDataset=", plotDataset);
  
  // Extract "wfreq" data and assign it to a variable to build an indicator
  var value = plotDataset.wfreq;
  console.log(value);
  
    // Data/Trace for Gauge chart that displays each sample values
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number+delta",
        value: value,
        title: { text: "<b>Belly Button Washing Frequency </b><br> Scrubs per Week", font: { size: 20, color: 'black', family: 'Arial' } },
        //delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "maroon" , thickness: 0.3},
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "darkblue",         
          steps: [
            { range: [0, 1], color: '#c2ddff' },
            { range: [1, 2], color: '#8fc1ff' },
            { range: [2, 3], color: '#5ca5ff' },
            { range: [3, 4], color: '#2989ff'},
            { range: [4, 5], color: '#0777ff' },
            { range: [5, 6], color: '#0067e4' },
            { range: [6, 7], color: '#0057c2' },
            { range: [7, 8], color: '#00397e' },
            { range: [8, 9], color: '#001a3a' }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 9
          }
        }
      }
    ];
    //Layout
    var layout = {
      width: 450,
      height: 400,
      margin: { t: 30, r: 15, l: 15, b: 0 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };
     // Render the plot to the div tag with id 'gauge'
    Plotly.newPlot('gauge', data, layout);
  });
}
