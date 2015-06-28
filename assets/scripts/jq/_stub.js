require([
    'jquery', 'fn/defined', 'fn/default', 'fn/cre',
    'jquery-ui/widget'
], function($, defined, def, cre){
    "use strict";

    $.ajax({

    });
    $.widget('box', null, {
        _create: function(){

        },
        _destroy: function(){

        },
        //  Any time the plugin is called with no arguments or with only an option hash,
        // the widget is initialized; this includes when the widget is created.
        _init: function() {

        },
        _setOptions: function( options ) {
            var that = this;

            $.each( options, function( key, value ) {
                that._setOption( key, value );
                if ( key === "height" || key === "width" ) {
                    // do something
                }
            });

        }
    });
});
