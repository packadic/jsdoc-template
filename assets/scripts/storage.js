define([ 'json', 'fn/defined' ], function( json, defined ){

    /**
     * A wrapper around the localStorage, allows expiration settings and JSON in/output
     * @exports storage
     */
    var storage = {};

    storage.on = function( callback ){
        if( window.addEventListener ){
            window.addEventListener("storage", callback, false);
        } else {
            window.attachEvent("onstorage", callback);
        }
    };

    storage.set = function( key, val, options ){
        options = $.extend({json: false, expires: false}, options);
        if( options.json ){
            val = json.stringify(val);
        }
        if( options.expires ){
            var now = Math.floor((Date.now() / 1000) / 60);
            window[ 'localStorage' ].setItem(key + ':expire', now + options.expires);
        }
        window[ 'localStorage' ].setItem(key, val);
    };

    storage.get = function( key, options ){
        options = $.extend({json: false, default: null}, options);

        if( !defined(key) ){
            return options.default;
        }

        if( _.isString(window[ 'localStorage' ].getItem(key)) ){
            if( _.isString(window[ 'localStorage' ].getItem(key + ':expire')) ){
                var now = Math.floor((Date.now() / 1000) / 60);
                var expires = parseInt(window[ 'localStorage' ].getItem(key + ':expire'));
                if( now > expires ){
                    storage.del(key);
                    storage.del(key + ':expire');
                }
            }
        }

        var val = window[ 'localStorage' ].getItem(key);

        if( !defined(val) || defined(val) && val == null ){
            return options.default;
        }

        if( options.json ){
            return json.parse(val);
        }
        return val;
    };


    storage.del = function( key ){
        window[ 'localStorage' ].removeItem(key);
    };

    storage.clear = function(){
        window.localStorage.clear();
    };

    /**
     * Get total localstorage size in MB. If key is provided,
     * it will return size in MB only for the corresponding item.
     * @param [key]
     * @returns {string}
     */
    storage.getSize = function( key ){
        key = key || false;
        if( key ){
            return ((localStorage[ x ].length * 2) / 1024 / 1024).toFixed(2);
        } else {
            var total = 0;
            for( var x in localStorage ){
                total += (localStorage[ x ].length * 2) / 1024 / 1024;
            }
            return total.toFixed(2);
        }
    };


    return storage;
});
