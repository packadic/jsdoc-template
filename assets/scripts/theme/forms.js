define([ 'jquery', 'autoloader' ],
    function( $, autoloader ){
        'use strict';

        var forms = {};

        var initialized = false;

        forms.initMaterial = function(){

            $.material.init({
                autofill: true
            });
            $(document)
                .on('focus', $.material.options.inputElements, function(el){

                });

        };
        forms.init = function(){
            if( initialized ){
                return;
            }

            autoloader.detect('form', 'plugins/uniform', function(){
                $("form").not(".form-material").find("input[type='checkbox'], input[type='file'], input[type='radio']").not('.switch').uniform();
            });
            autoloader.detect('form.form-material', 'plugins/bs-material', function(){
                forms.initMaterial();
            });


        };

        return forms;
    });
