define([ 'jquery', 'plugins/highlightjs', 'plugins/marked' ],
    function( $, highlightjs, marked ){
        'use strict';

        console.log('highlightjs', highlightjs);
        marked.setOptions({

            breaks: true,
            highlight: function(code, lang) {
                return highlightjs.highlightAuto(code).value;

                console.log('highlighting ', lang, code);
                if(typeof lang === 'undefined' || lang === 'undefined'){
                    return code;
                }
                if(highlightjs.listLanguages().indexOf(lang) === -1){
                    return code;
                }
                return highlightjs.highlight(lang, code).value;
            }
        });
        return function($els){
            console.log('plugin-markdown-readme', $els);
            $els.each(function(){
                var $el = $(this);
                $el.html(marked($el[0 ].innerHTML));
            })
        };
    });
