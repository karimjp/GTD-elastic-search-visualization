var chartData1 = [];


function generateChartData() {
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 500);
    firstDate.setHours(0, 0, 0, 0);

    for (var i = 0; i < 500; i++) {
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        var a1 = Math.round(Math.random() * (40 + i)) + 100 + i;
        var b1 = Math.round(Math.random() * (1000 + i)) + 500 + i * 2;

        

        chartData1.push({
            date: newDate,
            value: a1,
            volume: b1
        });
      
    }
}

AmCharts.ready(function() {
    generateChartData();
    createStockChart();
});

function createStockChart() {
    var chart = new AmCharts.AmStockChart();
    chart.pathToImages = "http://www.amcharts.com/lib/images/";
    chart.glueToTheEnd = true;

    // DATASETS //////////////////////////////////////////
    // create data sets first
    var dataSet1 = new AmCharts.DataSet();
    dataSet1.title = "first data set";
    dataSet1.fieldMappings = [{
        fromField: "value",
        toField: "value"},
    {
        fromField: "volume",
        toField: "volume"}];
    dataSet1.dataProvider = chartData1;
    dataSet1.categoryField = "date";

  
    // set data sets to the chart
    chart.dataSets = [dataSet1];
  

    // PANELS ///////////////////////////////////////////                                                  
    // first stock panel
    var stockPanel1 = new AmCharts.StockPanel();
    stockPanel1.showCategoryAxis = false;
    stockPanel1.title = "Value";
    stockPanel1.percentHeight = 60;

    // graph of first stock panel
    var graph1 = new AmCharts.StockGraph();
    graph1.valueField = "value";
    graph1.comparable = true;
    graph1.compareField = "value";
    stockPanel1.addStockGraph(graph1);

    // create stock legend                
    stockPanel1.stockLegend = new AmCharts.StockLegend();


    // set panels to the chart
    chart.panels = [stockPanel1];


    // OTHER SETTINGS ////////////////////////////////////
    var sbsettings = new AmCharts.ChartScrollbarSettings();
    sbsettings.graph = graph1;
    sbsettings.usePeriod = "WW";
    chart.chartScrollbarSettings = sbsettings;


    // PERIOD SELECTOR ///////////////////////////////////
    var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.position = "left";
    periodSelector.periods = [{
        period: "DD",
        count: 10,
        label: "10 days"},
    {
        period: "MM",
        selected: true,
        count: 1,
        label: "1 month"},
    {
        period: "YYYY",
        count: 1,
        label: "1 year"},
    {
        period: "YTD",
        label: "YTD"},
    {
        period: "MAX",
        label: "MAX"}];
    chart.periodSelector = periodSelector;


    // DATA SET SELECTOR
    var dataSetSelector = new AmCharts.DataSetSelector();
    dataSetSelector.position = "left";
    chart.dataSetSelector = dataSetSelector;

    chart.write('chartdiv');
    
    // set up the chart to update every second
    setInterval(function () {
        // normally you would load new datapoints here,
        // but we will just generate some random values
        // and remove the value from the beginning so that
        // we get nice sliding graph feeling
        
        // remove datapoint from the beginning
        chartData1.shift();
        chartData2.shift();
        chartData3.shift();
        chartData4.shift();
        
        // add new datapoint at the end
        var newDate = new Date(chartData1[chartData1.length - 1].date);
        newDate.setDate(newDate.getDate() + 1);
        
        var i = chartData1.length;

        var a1 = Math.round(Math.random() * (40 + i)) + 100 + i;
        var b1 = Math.round(Math.random() * (1000 + i)) + 500 + i * 2;

        var a2 = Math.round(Math.random() * (100 + i)) + 200 + i;
        var b2 = Math.round(Math.random() * (1000 + i)) + 600 + i * 2;

        var a3 = Math.round(Math.random() * (100 + i)) + 200;
        var b3 = Math.round(Math.random() * (1000 + i)) + 600 + i * 2;

        var a4 = Math.round(Math.random() * (100 + i)) + 200 + i;
        var b4 = Math.round(Math.random() * (100 + i)) + 600 + i;

        chart.dataSets[0].dataProvider.push({
            date: newDate,
            value: a1,
            volume: b1
        });
        chart.dataSets[1].dataProvider.push({
            date: newDate,
            value: a2,
            volume: b2
        });
        chart.dataSets[2].dataProvider.push({
            date: newDate,
            value: a3,
            volume: b3
        });
        chart.dataSets[3].dataProvider.push({
            date: newDate,
            value: a4,
            volume: b4
        });
        
        chart.validateData();
    }, 1000);
}