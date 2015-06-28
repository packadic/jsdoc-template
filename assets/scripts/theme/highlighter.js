define([
    'jquery', 'fn/defined', 'fn/default', 'fn/cre',  'plugins/highlightjs', 'plugins/marked'
], function($, defined, def, cre, HJS, marked){
    "use strict";

    var highlighter = {};

    highlighter.HJS = HJS;

    highlighter.applyTo = function($els){
        $els.each(function(){
            var $el = $(this);
            var classes = $el[0 ].classList;
            $.each(classes, function(i, className){
                if(className.indexOf("lang-") !== -1){
                    var lang = className.replace('lang-', '');
                    var newContent = HJS.highlight(lang, $el.html()).value;
                    $el.html(newContent);
                }
            });
        })
    };

    highlighter.marked = function(){
        marked.setOptions({
            breaks: true,
            highlight: function(code, lang) {
                console.log('highlighting ', lang, code);
                return HJS.highlightAuto(code).value;
            }
        });
        return marked;
    }.call();

    return highlighter;

});
