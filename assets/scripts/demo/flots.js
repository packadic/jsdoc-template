require([
    'jquery', 'fn/defined', 'fn/default', 'fn/cre',
    'flot', 'flot.pie'
], function ($, defined, def, cre) {
    "use strict";


    $(function () {

        (function charts() {
            if ( ! jQuery.plot ) {
                return;
            }

            var data = [];
            var totalPoints = 250;

            // random data generator for plot charts

            function getRandomData() {
                if ( data.length > 0 ) data = data.slice(1);
                // do a random walk
                while (data.length < totalPoints) {
                    var prev = data.length > 0 ? data[data.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if ( y < 0 ) y = 0;
                    if ( y > 100 ) y = 100;
                    data.push(y);
                }
                // zip the generated y values with the x values
                var res = [];
                for (var i = 0; i < data.length; ++ i) {
                    res.push([i, data[i]]);
                }

                return res;
            }



            (function c4() {
                if ( $('#chart_4').size() != 1 ) {
                    return;
                }
                //server load
                var options = {
                    series: {
                        shadowSize: 1
                    },
                    lines : {
                        show     : true,
                        lineWidth: 0.5,
                        fill     : true,
                        fillColor: {
                            colors: [{
                                opacity: 0.1
                            }, {
                                opacity: 1
                            }]
                        }
                    },
                    yaxis : {
                        min          : 0,
                        max          : 100,
                        tickColor    : "#eee",
                        tickFormatter: function (v) {
                            return v + "%";
                        }
                    },
                    xaxis : {
                        show: false,
                    },
                    colors: ["#6ef146"],
                    grid  : {
                        tickColor  : "#eee",
                        borderWidth: 0,
                    }
                };

                var updateInterval = 30;
                var plot = $.plot($("#chart_4"), [getRandomData()], options);

                function update() {
                    plot.setData([getRandomData()]);
                    plot.draw();
                    setTimeout(update, updateInterval);
                }

                update();
            }.call())

        }.call());


        (function pies() {

            var data = [];
            var series = Math.floor(Math.random() * 10) + 1;
            series = series < 5 ? 5 : series;

            for (var i = 0; i < series; i ++) {
                data[i] = {
                    label: "Series" + (i + 1),
                    data : Math.floor(Math.random() * 100) + 1
                };
            }


            // DEFAULT
            if ( $('#pie_chart_1').size() !== 0 ) {
                $.plot($("#pie_chart_1"), data, {
                    series: {
                        pie: {
                            show: true
                        }
                    }
                });
            }


            // GRAPH 2
            if ( $('#pie_chart_2').size() !== 0 ) {
                $.plot($("#pie_chart_2"), data, {
                    series: {
                        pie: {
                            show  : true,
                            radius: 1,
                            label : {
                                show      : true,
                                radius    : 1,
                                formatter : function (label, series) {
                                    return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                                },
                                background: {
                                    opacity: 0.8
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            }

            // GRAPH 3
            if ( $('#pie_chart_3').size() !== 0 ) {
                $.plot($("#pie_chart_3"), data, {
                    series: {
                        pie: {
                            show  : true,
                            radius: 1,
                            label : {
                                show      : true,
                                radius    : 3 / 4,
                                formatter : function (label, series) {
                                    return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                                },
                                background: {
                                    opacity: 0.5
                                }
                            }
                        }
                    },
                    legend: {
                        show: false
                    }
                });
            }

        }.call());


    });
});


