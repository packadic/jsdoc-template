require([
    'jquery', 'theme', 'fn/defined', 'fn/default', 'fn/cre', 'plugins/chartjs',

    'plugins/easypiechart', 'plugins/sparkline', 'flot', 'flot.pie'
], function ($, theme, defined, def, cre, Chart) {
    "use strict";
    $.fn.sparkline.defaults.common.width = '100px';
    $.fn.sparkline.defaults.common.height = '100px';

    $(function () {

        var initCharts = function () {
            return;
            var charts = $('.percentage');
            var barColors = ['amber-dark', 'green', 'teal', 'cyan'];
            charts.each(function (i) {
                var $chart = $(this);
                $chart.easyPieChart({
                    animate : 1000,
                    onStep  : function (value) {
                        this.$el.find('span').text(~ ~ value);
                    },
                    barColor: theme.colors[barColors[i]],
                    size: 85
                }).css({ 'margin': '0px 15px' });
            });
            charts.on('click', function (e) {
                e.preventDefault();
                charts.each(function () {
                    $(this).data('easyPieChart').update(Math.floor(100 * Math.random()));
                });
            });
        }.call();

    });
});


