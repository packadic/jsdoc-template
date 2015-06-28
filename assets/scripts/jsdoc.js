(function () {

    var packadic = (window.packadic = window.packadic || {});

    packadic.mergeConfig({
        debug   : true,
        requireJS: {
            baseUrl: 'scripts'
        }
    }).onPreBoot(function () {
    }).onBoot(function () {
    }).onBooted(['jquery', 'theme', 'theme/sidebar', 'autoload', 'theme/highlighter', 'jq/box'], function ($, theme, sidebar, autoload, highlighter) {
        theme.init();
        sidebar.init({hidden: false}); //, items: packadic.site.data.navigation.sidebar});

        $(function(){
            autoload.scan($('body'), function () {
                if ( packadic.config.pageLoadedOnAutoloaded === true ) {
                    packadic.removePageLoader();
                }
            });
            $('pre.hljs').find('code').each(function(){
                var $code = $(this);
                $code.html(highlighter.HJS.highlightAuto($code.html()).value);
            });
        });
    }).onStart(function () {
    }).onStarted(function () {
    });

}.call());


