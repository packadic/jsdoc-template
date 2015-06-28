require([
    'jquery', 'fn/defined', 'fn/default', 'fn/cre', 'plugins/chartjs', 'plugins/nvd3', 'plugins/vega', 'plugins/rickshaw',
    'flot', 'flot.pie'
], function ($, defined, def, cre, Chart, nv, vg, Rickshaw) {
    "use strict";
    Chart.defaults.global = packadic.config.chartjsGlobal;


    function initVega() {
        var SPECS = [
            "arc",
            "area",
            "bar",
            "barley",
            "choropleth",
            "grouped_bar",
            "error",
            "force",
            "image",
            "jobs",
            "lifelines",
            "map",
            "napoleon",
            "parallel_coords",
            "population",
            "scatter",
            "scatter_matrix",
            "stacked_area",
            "stacked_bar",
            "stocks",
            "treemap",
            "weather",
            "wordcloud"
        ];

        var getJson = function (name, cb) {
            $.ajax({
                url    : '/demo/vega/' + name + '.json',
                success: cb
            });
        };


        $('.demo-charts-vega').each(function(){
            var $el = $(this);
            var data = $el.data();
            var spec = data['spec'];
            var elId= 'demo-charts-vega-' + spec;
            $el.attr('id', elId);
            getJson('spec/' + spec, function(spec){
                spec.width = $el.width();
                if(defined(spec.padding)){
                    if(defined(spec.padding.left)){
                        spec.width -= parseInt(spec.padding.left);
                    }
                    if(defined(spec.padding.right)){
                        spec.width -= parseInt(spec.padding.right);
                    }
                }
                spec.height = 300;
                vg.parse.spec(spec, function (chart) {
                    chart({el: "#" + elId}).update();
                });
            });
            $el.closest('.box').find('> header > h3').text(spec);
        });
    }

    function initChartJS() {
        var data = {
            labels  : ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label               : "My First dataset",
                    fillColor           : "rgba(220,220,220,0.2)",
                    strokeColor         : "rgba(220,220,220,1)",
                    pointColor          : "rgba(220,220,220,1)",
                    pointStrokeColor    : "#fff",
                    pointHighlightFill  : "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data                : [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label               : "My Second dataset",
                    fillColor           : "rgba(151,187,205,0.2)",
                    strokeColor         : "rgba(151,187,205,1)",
                    pointColor          : "rgba(151,187,205,1)",
                    pointStrokeColor    : "#fff",
                    pointHighlightFill  : "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data                : [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var chartjs = {
            lineChart : new Chart($('#chartjs_line').get(0).getContext("2d")).Line(data, {
                bezierCurve: false
            }),
            barChart  : new Chart($('#chartjs_bar').get(0).getContext("2d")).Bar(data, {
                barShowStroke: false
            }),
            radarChart: new Chart($('#chartjs_radar').get(0).getContext("2d")).Radar(data, {
                pointDot: false
            })
        };
        $.each(chartjs, function (i, chart) {
            chart.chart.width = $(chart.chart.canvas).closest('section').innerWidth();
            chart.chart.height = $(chart.chart.canvas).closest('section').innerHeight();
            chart.resize();
            chart.reflow();
            chart.update();
        })
    }

    $(function () {
        if($('#chartjs_line').length > 0){
            initChartJS();
        }
        if($('.demo-charts-vega').length > 0) {
            initVega();
        }
    });

});


