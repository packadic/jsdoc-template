/*
 *  BOOTING UP SHIT
 */

(function Boot(){

    var packadic = (window.packadic = window.packadic || {});

    packadic.fireEvent('pre-boot');

    require.config(packadic.config.requireJS);

    packadic.fireEvent('booting'); // Fire "booting" event

    require([ 'module', 'jquery',  'autoload', 'string', 'jade', 'storage', 'code-mirror', 'plugins/cookie', 'jq/general' ],
        function( module, $, autoload, _s, jade, storage){


            packadic.removePageLoader = function(){
                $('body').removeClass('page-loading');
            };

            window.jade = jade;
            window._s = _s;

            // SCSS Json
            var scss = _s.unquote($('head').css('font-family'), "'");
            while( typeof scss !== 'object' ){
                scss = JSON.parse(scss);
            }
            packadic.config.scss = scss;

            packadic.config.chartjsGlobal.tooltipTitleFontFamily = scss.fonts.subheading.join(', ');
            packadic.config.chartjsGlobal.tooltipFontFamily = scss.fonts.base.join(', ');
            packadic.config.chartjsGlobal.scaleFontFamily = scss.fonts.heading.join(', ');


            // Debug
            if(packadic.config.debug !== true){
                var isDebug = false;
                if( typeof $.cookie('debug') !== 'undefined' ){
                    isDebug = parseInt($.cookie('debug')) === 1
                }
                $('#debug-enable').on('click', function(){
                    $.cookie('debug', '1');
                    window.location.refresh();
                });
                packadic.config.debug = isDebug;
            }

            // Startup, figure out what modules to load
            var load = ['theme' ];
            if( packadic.config.debug === true ){
                load.push('debug');
            }
            if( packadic.config.demo === true ){
                load.push('demo');
            }



            // EVENT: booted
            packadic.fireEvent('booted');

            require(load, function( theme, debug, demo ){

                // EVENT: starting
                packadic.fireEvent('starting');

                if( packadic.config.demo === true && _.isObject(demo) ){
                    demo.init();
                }

                // EVENT: started
                packadic.fireEvent('started');

            });
        });
}.call());
