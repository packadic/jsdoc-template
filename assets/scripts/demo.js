define([ 'jquery' ],
    function( $ ){
        'use strict';
        var demo = {};

        demo.present = function(selector, module){
            var $els = $(selector);
            if($els.length > 0){
                require(['demo/' + module], function(mod){
                    if(typeof mod === 'function'){
                        mod($els);
                    }
                });
            }
        };

        demo.init = function(){
            this.present('.demo-modal', 'modals');
            this.present('.demo-popover', 'popover');
            this.present('#packadic-themer', 'themer');
            this.present('.demo-button-editor', 'button-icon-showcase');
            this.present('#gtreetable', 'gtreetable');
            this.present('.show-class', 'show-class');
            this.present('.show-html', 'show-html');
            this.present('#demo-plugins-docs', 'plugins-docs');
            this.present('.plugin-markdown', 'plugin-markdown');
            this.present('.demo-jq-impromptu', 'jq-impromptu');
            this.present('#demo-forms', 'forms');
            this.present('#charts-demo', 'flots');
            this.present('#charts-demo', 'charts');
            this.present('#dashboard-demo', 'dashboard');
        };

        return demo;
    });
