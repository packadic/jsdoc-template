define([ 'jquery' ],
    function( $ ){
        'use strict';
        
        return function( $els ){
            $els
                .on('click', function( e ){
                    e.preventDefault();
                    var $el = $(this);
                    var code = $el[ 0 ].outerHTML;
                    theme.showCode({
                        title : 'Showing code',
                        code  : code,
                        editor: {
                            mode: 'htmlmixed'
                        }
                    });
                })
                .tooltip({
                    title: 'Click to view HTML code'
                });
        };
    });
