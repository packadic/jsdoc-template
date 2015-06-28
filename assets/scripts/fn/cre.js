define([ 'jquery', 'fn/defined' ], function( $ , defined ){
    'use strict';

    return function( name ){
        if( !defined(name) ){
            name = 'div';
        }
        return $(document.createElement(name));
    }
});
