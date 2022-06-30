// create a path to pull the main reference dataset to dropdown
// Use the D3 library to read in samples.json
function init() {

    var dropdown = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
      var datanames = data.names;
      datanames.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });
  
      // Build  Chartplots
      var selected_Sample = datanames[0];
      buildCharts(selected_Sample);
      buildMetadata(selected_Sample);
    });
  }
//  Enable an option to pull unique data with new selection //
init();

function optionChanged(selected) {
  buildMetadata(selected);
  buildCharts(selected); 

}
//----------- Demographics Panel--------------//
//  Display the sample metadata, i.e., an individual's demographic information
// Display each key-value pair from the metadata JSON object 
 // Filter the data for the object with the desired unique sample id.
 // then enable the selected pull the meta_panel with id of `#sample-metadata` 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var obj_result = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = obj_result[0];
    var meta_panel = d3.select("#sample-metadata");

    // Update all of the plots any time that a new sample is selected.
    // by reseting any existing metadata
    meta_panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel

    Object.entries(result).forEach(([key, value]) => {
        meta_panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// ------------buildCharts---------------------------//
// Use d3.json to load and retrieve the samples.json file 

function buildCharts(sample) {
  
  d3.json("samples.json").then((data) => {
    // console.log(data);
    var samples = data.samples;
    var obj_results = samples.filter(obj => obj.id == sample);
    var result = obj_results[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = result.otu_ids;
    var otuLabs = result.otu_labels;
    var sampleVals = result.sample_values; 
    // filters the metadata
    var metadata = data.metadata;
    var obj_metadata = metadata.filter(sampleObj => sampleObj.id == sample);

    var metaResult = obj_metadata[0];
    // Create a variable that holds the washing frequency
    var washingFreq = parseInt(metaResult.wfreq);

    
  
  
    // Use sample_values as the values for the bar chart.
    // Use otu_ids as the labels for the bar chart.
    // Use otu_labels as the hovertext for the chart.
    var yticks = otuIDs.slice(0,10).reverse().map(function (elem) {return `OTU ${elem}`});
    var xticks = sampleVals.slice(0,10).reverse();
    var labels = otuLabs.slice(0,10).reverse();

    var barData = {
      x: xticks,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: labels
    };
    // layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // Create the trace for the bubble chart.
    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.
    var bubbleData = {
      x: otuIDs,
      y: sampleVals,
      text: otuLabs,
      mode: 'markers',
      marker: {
        size: sampleVals,
        color: otuIDs
      }
    };
    
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);   

    // Gauge chart
    var gaugeData = {
      value: washingFreq,
      title: {text:"Belly Button Washing Frequency<br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color:"#e2f7c1"},
          {range: [2,4], color:"#d0f7c1"},
          {range: [4,6], color:"#8fab32"},
          {range: [6,8], color:"#3ded1a"},
          {range: [8,10], color:"#0d8c28"}
        ]
      }
    };

    var gaugeLayout = {
      width: 500, height: 350, margin: {t: 0, b: 0}
    };

    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);

  });
 };

// ....................plot.ly challenge Solomon Rotich June 2022.....................................//