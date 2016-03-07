var headers = ['attacktype1_txt','targtype1_txt','gname','weaptype1_txt','dbsource','nkill' ];
//var headers_to_display = ['eventid','iyear','imonth','iday','attacktype1_txt','targtype1_txt'];//,'targtype1_txt','gname','weaptype1_txt','nkill','dbsource'];
var time_key = 'eventid';

var timeData = [];
var chartData = [];

function chart_click_handler(event) {
    console.log(amStockChart.startDate + ', ' + amStockChart.endDate);

    time_filtered_data = [];

    $.each(data, function(i, val) {
       
       textTime=new Array(val['iyear'],val['imonth'],val['iday']);
	var time = new Date(textTime);
      //console.log(time + ', ' + textTime);
	if(time >= amStockChart.startDate && time <= amStockChart.endDate)
	    time_filtered_data.push(val);
    });

    elastic_list_update();
    
}

function generateTimeData() {
    // count by days
    var counts = {};
    $.each(data, function(i, val) {
        
       textTime=new Array(val['iyear'],val['imonth'],val['iday']);
	var time = new Date(textTime);
     
       //console.log(time + ', ' + textTime);
	time.setUTCHours(0, 0, 0, 0);
	var push_val = time.getTime();
	if(push_val in counts)
	    counts[push_val] += 1;
	else
	    counts[push_val] = 1;
    });

    $.each(counts, function(time, count) {
	var newData = {
	    date: new Date(parseInt(time)),
	    value: count
	};
	timeData.push(newData);
    });
}

function generateChartData() {
    chartData = [];
    $.each(filtered_data, function(i, val) {
	chartData.push({value: val['geotag'],
			count: val['']});
    });

    $.each(counts, function(time, count) {
	var newData = {
	    date: new Date(parseInt(time)),
	    value: count
	};
	timeData.push(newData);
    });
}

var amStockChart = null;

function createBarChart() {
    var selected_chart_type = $('#barchartselectors input[name=group1]:checked').val();

    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = sorted_header_counts[selected_chart_type];
    chart.categoryField = "name";
    chart.startDuration = 0.5;

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.labelRotation = 90;
    categoryAxis.gridPosition = "start";

    // value
    var categoryAxis = chart.categoryAxis;
    categoryAxis.labelRotation = 90;
    categoryAxis.gridPosition = "start";

    var valuesAxis = new AmCharts.ValueAxis();
    valuesAxis.minimum = 0;
    chart.addValueAxis(valuesAxis)
    
    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.valueField = "count";
    graph.balloonText = "[[category]]: [[value]]";
    graph.type = "column";
    graph.lineAlpha = 0;
    graph.fillAlphas = 0.8;
    
    chart.addGraph(graph);
    
    chart.write("barchartdiv");
}


function createStockChart() {
    amStockChart = new AmCharts.AmStockChart();
    amStockChart.pathToImages = "images/";

    // DATASETS //////////////////////////////////////////
    var dataSet = new AmCharts.DataSet();
    dataSet.color = "#b0de09";
    dataSet.fieldMappings = [{
	fromField: "value",
	toField: "value"
    }];
    dataSet.dataProvider = timeData;
    dataSet.categoryField = "date";

    amStockChart.dataSets = [dataSet];

    // PANELS ///////////////////////////////////////////                                                  
    var stockPanel = new AmCharts.StockPanel();
 
    var graph = new AmCharts.StockGraph();
    graph.valueField = "value";
    graph.bullet = "round";
    stockPanel.addStockGraph(graph);
    

    amStockChart.panels = [stockPanel];
    

    // OTHER SETTINGS ////////////////////////////////////
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
    scrollbarSettings.graph = graph;
    scrollbarSettings.updateOnReleaseOnly = true;
    amStockChart.chartScrollbarSettings = scrollbarSettings;

    // PERIOD SELECTOR ///////////////////////////////////
    var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.position = "bottom";
    periodSelector.periods = [{
	period: "DD",
	count: 10,
	label: "10 days"
    }, {
	period: "MM",
	count: 1,
	label: "1 month"
    }, {
	period: "YYYY",
	count: 1,
	label: "1 year"
    }, {
	period: "YTD",
	label: "YTD"
    }, {
	period: "MAX",
	label: "MAX"
    }];
    amStockChart.periodSelector = periodSelector;

    var panelsSettings = new AmCharts.PanelsSettings();
    amStockChart.panelsSettings = panelsSettings;

    amStockChart.write('chartdiv');
}

// END AMCHARTS stuff


var data = [];
var time_filtered_data = []
var filtered_data = [];
var sorted_header_counts = {};

function fill_select_with_counts(header, counts) {
    var selector = '#' + header;
    
    var selected_values = []
    // find selected values
    var options = $(selector).find('option');
    $.each(options, function(i, opt) {
	if(opt.selected === true)
	    selected_values.push(opt['value']);
    });	

    // clear entries
    $(selector).find('option').remove();
    
    // gather in to array
    var object_array = [];
    $.each(counts, function(key, val) {
	object_array.push({'name': key, 'count': val})
    });

    var object_array_clone = $.extend([], object_array);

    // sort by alpha
    object_array_clone.sort(function (a, b){
	var nameA=a['name'].toLowerCase(), nameB=b['name'].toLowerCase()
	if (nameA < nameB) //sort string ascending
	    return -1 
	if (nameA > nameB)
	    return 1
	return 0 //default return value (no sorting)
    });
    
    // store this for use in charting
    sorted_header_counts[header] = object_array_clone;
    
    // sort by count
    object_array.sort(function(a, b) {
	return b['count'] - a['count'];
    });
        
    $.each(object_array, function(i, val) {
	var option = new Option(val['name'] + ' (' + val['count'] + ')', val['name']);
	if($.inArray(val['name'], selected_values) != -1)
	    option.selected = true;
	$(selector).append(option);
    });
}

function gather_selected() {
    var selectedValues = {};
    $.each(headers, function(i, val) {
	selectedValues[val] = [];
	$("#" + val + " :selected").each(function(){
            selectedValues[val].push($(this).val()); 
	})});
    //console.log(selectedValues);
    return selectedValues;
}

function perform_general_data_query(selectedValues) {
    filtered_data = [];
    $.each(time_filtered_data, function(i, d) {
	var add_entry = true;
	$.each(selectedValues, function(category, selections) {
	    if(selections.length === 0)
		return true;
	    // loop through all selections in a given category
	    $.each(selections, function(i, selection) {
		add_entry = false;
		if(d[category] === selection) {
		    add_entry = true;
		    return false;
		}});
	    if(add_entry === false)
		return false;
	});
	if(add_entry === true) {
	    filtered_data.push(d);
	}
    });
}


function build_results(selectedValues) {
    perform_general_data_query(selectedValues);

}

function elastic_list_update() {
    var selectedValues = gather_selected();
    build_results(selectedValues);
    setup_lists(filtered_data);
    createBarChart();
   
}

function setup_click_handlers() {
    $.each(headers, function(i, val) {
	$('#' + val).click(elastic_list_update)});
}

function set_radio_button(ds_results) {
    ds_results	
	.attr('type', 'radio')
	.attr('name', 'group1')
	.attr('value', function(d) { return d})
	.property('checked', true)
	.text(function(d) { return d});
}

function setup_radio_buttons() {
    var doms = d3.select("#barchartselectors form").selectAll('input').data(headers);
    doms.call(set_radio_button);
    doms.enter().append('span')
    	.each(function (d) {
	    d3.select(this).append("input").call(set_radio_button)
		.style('float', 'left')
	    d3.select(this).append("p")
		.style('white-space', 'nowrap')
		.style('float', 'left')
		.text(d)
	});
    doms.exit().remove();
}

function setup_lists(d) {
    $.each(headers, function(i, header) {
	fill_select_with_counts(header, gather_ds_values(d, header))});
}

function request_data() {
    d3.json('data1.json',
	    function(error, d) {
		if(console && console.log) {
		    //console.log('received data: ', d);
		    data = d;
		    time_filtered_data = d;
		}
		
		setup_radio_buttons();
		setup_lists(data);
		setup_click_handlers();
	    	//newly_recieved = true;
		
		generateTimeData();
		createStockChart();
	    });
}

function gather_ds_values(d, key) {
    var counts = {};
    $.each(d, function(i, val) {
	var push_val = val[key];
	if(push_val in counts)
	    counts[push_val] += 1;
	else
	    counts[push_val] = 1;
    });
    return counts;
}

function set_header(results) {
    results.attr('class', 'elastic_list')
	.append("p").text(function(d) { return d} )
	.append("form")
	.append("select")
	.attr("id", function(d) { return d})
	.property("multiple", true);
}

$(function () {
    var doms = d3.select("#elastic_list_entries").selectAll(".elastic_list").data(headers);
    doms.enter().append("div").call(set_header);

    request_data();

    $('#chartdiv').click(chart_click_handler);
    $('#barchartselectors').click(chart_click_handler);

 
});