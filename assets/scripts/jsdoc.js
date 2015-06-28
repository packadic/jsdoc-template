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
            $('pre.prettyprint').removeClass('prettyprint').addClass('hljs').find('code').each(function(){
                var $code = $(this);

                $.each($code.parent()[0].classList, function(i, className){
                    if(className.indexOf("lang-") !== -1){
                        var lang = className.replace('lang-', '');
                        if(lang === 'sh') lang = 'bash';
                        if(highlighter.HJS.listLanguages().indexOf(lang) === -1){
                            return console.warn('Could not load language: ' + lang);
                        }
                        var newContent = highlighter.HJS.highlight(lang, $code.html()).value;
                        $code.html(newContent);
                    }
                });
            });
        });
    }).onStart(function () {
    }).onStarted(function () {
    });

}.call());


