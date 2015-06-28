define([ 'jquery', 'console', 'module', 'plugins/contextmenu' ],
    function( $, Console, module ){
        'use strict';

        var packadic = (window.packadic = window.packadic || {});

        var debug = {};

        function getPrefix( type ){
            var loadTime = (new Date()).getTime() - window.packadic.start.getTime();
            var prefix = [];
            var header = 'Debug'.debugLineHeader;
            if( _.isString(type) ){
                if( type === 'event' ){
                    header += ':' + 'Event'.debugLineEvent
                }
            }
            prefix.push(header);
            prefix.push((loadTime / 1000).toString().debugLineTime);
            return prefix;
        }


        if( packadic.config.debug === true ){

            Console.styles.register({
                font_scp   : 'font-family: \'Source Code Pro\', monospace;',
                debugHeader: 'background: url(http://www.iconsdb.com/icons/download/dim-gray/github-512.png) no-repeat left; background-size: 30px;padding: 10px 10px 10px 50px;' +
                                'line-height: 50px; font-size: 25px; text-transform: uppercase; font-weight: bold; color: grey;',
                debugHeaderSmall: 'font-weight: bold; color: orange; text-transform: uppercase;  font-size: 15px',
                debugLineHeader : 'font-family: \'Source Code Pro\', monospace; color: orange; text-transform: uppercase; font-size: 13px',
                debugLineEvent  : 'font-family: \'Source Code Pro\', monospace; color: red; text-transform: uppercase;  font-size: 13px',
                debugLineTime   : 'font-family: \'Source Code Pro\', monospace; color: green; text-transform: uppercase; font-size: 13px'
            });

            console.log([ 'Packadic'.debugHeader.font_scp, 'Debug'.debugHeaderSmall.font_scp ].join(''));

            window.logDebug = function(){
                console.log.apply(console, [ getPrefix().join(' ') ].concat($.makeArray(arguments)));
            };

            window.logDebugEvent = function(){
                console.log.apply(console, [ getPrefix('event').join(' ') ].concat($.makeArray(arguments)));
            };

            require([ 'templates/debug-contextmenu' ], function( template ){

                if( parseInt($.cookie('debug')) === 1 ){
                    $('body')
                        .css('position', 'relative')
                        .attr('data-toggle', 'debug-context')
                        .attr('data-target', '#debug-contextmenu')
                        .prepend(template({}))
                        .contextmenu({'target': '#debug-contextmenu'})
                        .on('click', '[data-debug-action]', function( e ){
                            var action = e.target.dataset.debugAction;
                            logDebugEvent('click debug event', action, e);

                            switch( action ){
                                case "disable":
                                    $.cookie('debug', '0');
                                    window.location.href = window.location.href;
                                    break;

                            }
                        });
                }
            });
        }

        return debug;
    });
