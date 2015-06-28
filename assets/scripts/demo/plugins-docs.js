define([ 'jquery',  'gfm' ],
    function( $, gfm ){
        'use strict';

        function Docs($el){
            this.$el = $el;
            this.$docLinks = $el.find('.plugin-doc-link');
            this.$docBoxes = $el.find('.plugin-doc-box');

            var self = this;

            this.$docBoxes.each(function(){
                var $doc = $(this);
                var $body = $doc.find('.plugin-doc-body');
                var $toc = $doc.find('.plugin-doc-toc');
                var $target = $doc.find('.plugin-doc-generated');

                if($body.length > 0){
                    $target.append(gfm($body.text()))
                }
                if($toc.length > 0){
                    var toc = gfm($toc.text());
                    $target.find('h1').first().after(toc);
                }
                //$body.find('h1').after();
            });


            this.$docLinks.on('click', function(e){
                e.preventDefault();
                var $link = $(this);
                var targetId = "doc-" + $link.data('filename');
                var $target = $("#" + targetId);
                self.$docBoxes.removeClass('hide').addClass('hide');
                $target.removeClass('hide');
            })
        }

        return function($els){
            console.log('button-icon-showcase', $els);
            $els.each(function(){
                return new Docs($(this));
            });
        };
    });
