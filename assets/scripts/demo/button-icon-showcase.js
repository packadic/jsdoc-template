define([ 'jquery',  'plugins/bs-select' ],
    function( $ ){
        'use strict';

        function isValidValue(value){
            if(typeof value === 'undefined'){
                return false;
            }
            if(typeof value === 'string' && value.length === 0){
                return false;
            }
            return true;
        }

        function Showcase( $el ) {
            var self = this;
            this.$el = $el;
            this.$buttons = this.$el.find(this.$el.data('editor-selector'));

            this.pickers = this.$el.data('editor').split(',');
            this.$pickers = {};

            _.each(this.pickers, function (picker) {
                self.$pickers[picker] = self.$el.find('.button-' + picker + '-select');
            });

            $(document).ready(function () {
                _.each(self.pickers, function (picker) {
                    self.$pickers[picker].selectpicker({});

                    var value = self.getPickerValue(picker);
                    //console.log('init picker', picker, 'setting value', typeof value, 'val=', value, 'valid=', isValidValue(value));
                    if (isValidValue(value)) {
                        self.$pickers[picker].selectpicker('val', value);
                    }

                    self.$pickers[picker].on('change', function () {
                        self.setPickerValue(picker, $(this).selectpicker('val'));
                    });
                });
            });
        }


        Showcase.prototype = {

            getPickerValue: function( picker ){
                return this.$el.data('editor-' + picker);
            },

            setPickerValue: function( picker, value ){
                this.$buttons.removeClass(this.getPickerValue(picker));

                //console.log('button-icon-showcase', 'setting picker', picker, 'setting value', typeof value, 'val=', value, 'valid=', isValidValue(value));
                if( isValidValue(value) ){
                    this.$buttons.addClass(value);
                }

                this.$el.data('editor-' + picker, value);
                this.$pickers[ picker ].selectpicker('val', value);
            }
        };

        return function( $els ){
            $els.each(function(){
                return new Showcase($(this));
            });
        };
    });
