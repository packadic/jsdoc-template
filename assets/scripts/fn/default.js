define(['fn/defined'], function(defined){
    'use strict';

    return function ( val, def ){
        return defined(val) ? val : def;
    }
});
