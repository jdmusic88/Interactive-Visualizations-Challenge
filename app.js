// Color palette for Bar and Bubble Charts
var arrColorsB = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868"];

// Color palette for Gauge Chart
var arrColorsG = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "white"];

// helper functions 
var makeRepeated = (arr, repeats) => [].concat(...Array.from({ length: repeats }, () => arr));

function convertAsString(val) {
  return "OTU " + val.toString();
}

// main functions
function buildMetadata(sample) {
    d3.json("data/samples.json").then(importedData =>{

     var objs = importedData.metadata;
     //console.log("objs", objs);

     var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
     //console.log("matchedSampleObj", matchedSampleObj);

      var dataSelector = d3.select('#sample-metadata');
      dataSelector.html("");

      Object.entries(matchedSampleObj[0]).forEach(([key,value]) =>{dataSelector.append('h6').text(`${key} : ${value}`)
    });
  })
}

// =================================================================================== Build Bar Chart
function barChart(data){

    console.log("barChart", data);

    data.sample_values.sort((a, b) => b - a);

    let otu_ids = data.otu_ids.slice(0,10);
    let otu_labels = data.otu_labels.slice(0,10);
    let sample_values = data.sample_values.slice(0,10);

    //console.log("otu_ids", otu_ids);
    //console.log("otu_labels", otu_labels);
    //console.log("sample_values", sample_values)

    let yAxis = otu_ids.map(convertAsString)
    //.log ("yAxis", yAxis);

    let trace = [{
      x: sample_values.reverse(),
      y: yAxis.reverse(),
      text: otu_labels.reverse(),
      marker: {color: arrColorsB},
      type: "bar",
      orientation: "h"      
    }];

    let layout = {
        title: '<b>Belly Button Bar Chart</b>',
      };

      Plotly.newPlot('bar', trace , layout, {responsive: true});
}
// =================================================================================== Build Bubble Chart
function bubbleChart(data) {

  console.log("bubbleChart", data);

  let x = data.otu_ids;
  let y = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels;
  let repeatColors = markercolors.length/([arrColorsB].length);
  
  let trace =[{
    x: x,
    y: y,
    mode: 'markers',
    marker: {
       color: makeRepeated([...arrColorsB], repeatColors),
       size: markersize,
    },
    text: textvalues
  }];

  let layout = {
    title:"<b>Belly Button Bubble Chart</b>",
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'Sample Value'},
  };

  Plotly.newPlot('bubble', trace, layout, {responsive: true});
}

// =================================================================================== Build Gauge Chart
function gaugeChart(data) {

  console.log("gaugeChart", data);

  if(data.wfreq === null){
    data.wfreq = 0;
  }

  let degree = parseInt(data.wfreq) * (180/10);

  // Trig to calc meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);

  let trace = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 50, color:'2F6497'},
      showlegend: false,
      name: 'WASH FREQ',
      text: data.wfreq,
      hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    textfont:{
      size : 16,
      },
    marker: {colors:[...arrColorsG]},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
    hoverinfo: 'text',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  let layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '#2F6497',
        line: {
          color: '#2F6497'
        }
      }],

    title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
    height: 550,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});
}

// ===================================================================================================
function buildCharts(sample) {

  console.log("sample",sample);

  d3.json("data/samples.json").then(importedData =>{
    var objs = importedData.samples;
   // console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => sampleData.id === sample);
    console.log("matchedSampleObj", matchedSampleObj[0]);
      // bar Chart
      barChart(matchedSampleObj[0]);

      // Bubble Chart 
      bubbleChart(matchedSampleObj[0]);
    });   
}

function buildGaugeChart(sample) {

  d3.json("data/samples.json").then(importedData =>{

    var objs = importedData.metadata;
    //console.log("objs", objs);

    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
    //console.log("buildGaugeChart matchedSampleObj", matchedSampleObj);

    gaugeChart(matchedSampleObj[0]);
 });   
}

function init() {
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then(importedData => {

    var sampleNames = importedData["names"];
    //console.log("sampleNames", sampleNames)

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
    buildGaugeChart(firstSample)    
  });
}

function optionChanged(newSample) {
  // get new data each time a new sample is selected

   console.log('new Sample', newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGaugeChart(newSample);   
}

// initialize the dashboard
init();