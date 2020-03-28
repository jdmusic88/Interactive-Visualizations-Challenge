
// Main Function
function buildMetadata(sample) {
    
    // Use `d3.json` to fetch the metadata for a sample
    d3.json("data/samples.json").then(importData =>{

        // Use d3 to select the panel with id of `#sample-metadata`
        var panelSelector = d3.select("#sample-metadata");
        panelSelector.html(' ');
        var Metadata = importdata.metadata
        console.log(Metadata);
        var data = Metadata.filter(sampleData => sampleData["id"] === parseInt(sample))
            
        // Use `.html("") to clear any existing metadata
        panelSelector.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(metadata).forEach(data(([key, value]) => {
            panelSelector.append("h5").text(`${key} : ${value}`)
                .html(`${data[0]}`)
        })

  );
}
        //  Build the Gauge Chart
        
        //buildGauge(data.wfreq);
  

function buildCharts(sample) {


    // Use `d3.json` to fetch the sample data for the plots
    d3.json("data/samples.json").then(importData =>{
    var datasample = importdata.samples;
    console.log(datasample);
    var data = datasample.filter(sampleData => sampleData["id"] === parseInt(sample));
    var otu_id = result.otu_ids; 
    var sample_values = result.sample_values;
    var otu_labels = result.otu_labels;
        
     //  Build a Bubble Chart using the sample data

    var bubblelayout = {
        
           
        var trace_Bubble = {
            x: data.otu_ids,
            y: data.sample_values,
            text: data.otu_labels
            mode: "markers",
            marker: {
                size: data.sample_values,
                color: data.otu_ids
                
            },
            
        }

        var data_Bubble = [trace_Bubble];

        var layout_Bubble = {
            title: "<b>Belly Buttons Biodiversity</b>",
            xaxis: { title: "Microbial Species - OTU ID" },
            yaxis: { title: "OTU Sample Values)" }
        }

        Plotly.newPlot("bubble", data_Bubble, layout_Bubble);
        var barlayout = {
            title:
        
        var bardata = [{

        }]
        text as otu_labels barlayout
        .slice(0,10)

    }

}

//read in the JSON file
//NOTE:  remember to start a localhost server to read in the JSON file
//use terminal by navigating to the location of the index.html file
//and typing in the command: python -m http.server

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
