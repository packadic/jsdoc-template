define([ 'jquery', 'plugins/bootstrap' ],
    function( $ ){
        'use strict';

        return function($els){
            $els.each(function(){
                var $this = $(this);
                $this.popover({
                    content: $this.data('content'),
                    title: $this.attr('title')
                })
            });

        };
    });
