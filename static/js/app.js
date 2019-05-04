function buildMetadata(sample) {

// Use `d3.json` to fetch the metadata for a sample
d3.json(`/metadata/${sample}`).then((data)=> {
  console.log(data)


    // Use d3 to select the panel with id of `#sample-metadata`
 var X = d3.select(`#sample-metadata`)

    // Use `.html("") to clear any existing metadata
    X.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value])=>{
    
    console.log(`${key}: ${value}`),
    X.append("h3").text(`${key}: ${value}`)}
 );
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    })};
 
function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data)=> {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var otu_ids = data.otu_ids
  var sample_values = data.sample_values
  var otu_labels = data.otu_labels
    
// @TODO: Build a Bubble Chart using the sample data
var y_min = Math.min(sample_values)
var y_max = Math.max(sample_values)
var bubble = {
  x:otu_ids,
  y:sample_values,
  mode: 'markers',
  marker:{
    size:sample_values,
    color:otu_ids
  },
  text:otu_labels
}
var layout = { 
  xaxis: {
  title: 'OTU_IDs'},
  yaxis: {
    range: [y_min, y_max]}

}

var data=[bubble]

Plotly.newPlot('bubble', data, layout);
    

// @TODO: Build a Pie Chart
  
    var top_otu_ids = otu_ids.sort(function(a, b){return b-a}).slice(0,10)
    var top_sample_values = sample_values.sort(function(a, b){return b-a}).slice(0,10)
    var top_otu_labels = otu_labels.sort(function(a, b){return b-a}).slice(0,10)

    var data = [{
      values:top_sample_values ,
      labels:top_otu_ids ,
      hoverinfo:top_otu_labels,
      type: 'pie'}]

  Plotly.newPlot('pie', data);    
   
})};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

