define([ 'jquery', 'plugins/events' ], function( $, EventEmitter ){

    var packadic = (window.packadic = window.packadic || {});

    var make = function( name, obj, prop ){
        if( typeof prop !== 'string' ){
            prop = '_events';
        }
        obj[ prop ] = new EventEmitter();
        obj.on = function(){
            obj[ prop ].on.apply(obj[ prop ], $.makeArray(arguments))
        };
        obj.once = function(){
            obj[ prop ].once.apply(obj[ prop ], $.makeArray(arguments))
        };
        obj.off = function(){
            obj[ prop ].off.apply(obj[ prop ], $.makeArray(arguments))
        };
        obj._trigger = function(){
            var args = $.makeArray(arguments);
            if( packadic.config.debug === true ){
                console.debug('DEBUG::event:' + name + ':' + args[ 0 ])
            }
            obj[ prop ].trigger.apply(obj[ prop ], args);
        };
        obj._defineEvent = function(){
            obj[ prop ].defineEvent.apply(obj[ prop ], $.makeArray(arguments));
        };
        return obj;
    };


    /**
     * A wrapper to add event system to an object
     * @exports eventer
     */
    function eventer( name, obj, prop ){
        return make(name, obj, prop);
    }

    eventer.get = function(){
        return new EventEmitter();
    };

    return eventer;
});
