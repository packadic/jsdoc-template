define([
    'jquery', 'fn/defined', 'fn/default', 'fn/cre', 'theme',
    'jquery-ui/widget', 'jquery-ui/draggable'
], function ($, defined, def, cre, theme) {
    "use strict";
    var $body = $('body');

    /**
     * @fileOverview
     * @version 1.0.0
     * @namespace packadic.box
     * @example
     *  $('.box').box({
     *      controls: ['close', 'minimize', 'move']
     *  });
     */
    $.widget('packadic.box', {
        version: '1.0.0',
        widgetEventPrefix: 'box.',
        defaults                : {
            controls: []
        },

        /**
         * @name packadic.box#minimize
         * @function
         * @description Minimizes the box
         */
        minimize: function(){},

        /**
         * @name packadic.box#maximize
         * @function
         * @description Maximize the box
         */
        maximize: function(){},

        /**
         * @name packadic.box#close
         * @function
         * @description Closes the box
         */
        close: function(){},

        /**
         * @name packadic.box#fullscreen
         * @function
         * @description Resizes the box to fullscreen
         */
        fullscreen: function(){},



        _getDataAttributes      : function () {
            var data = this.element.prefixedData('box');
            if ( defined(data.controls) ) {
                data.controls = data.controls.split(',');
            }
            return data;
        },
        _create                 : function () {
            var self = this;
            this.$section = this.element.find('> section');
            this.$header = this.element.find('> header');

            this.options = $.extend(true, this.defaults, this._getDataAttributes(), this.options);

            if ( this.options.controls.length > 0 ) {
                this._ensureControlsContainer();
                $.each(this.options.controls, function (i, control) {
                    self['_createControl' + control.charAt(0).toUpperCase() + control.substring(1)].call(self);
                });
            }

        },
        _createControl           : function (typeName, iconClass) {
            var $a;
            $a = this.$controls.find('a[data-box-control="' + typeName + '"]');
            if ( $a.length > 0 ) {
                $a.$i = $a.find('> i');
            } else {
                var $i = cre('i').addClass(iconClass);
                $a = cre('a')
                    .attr('data-box-control', typeName)
                    .append($i)
                    .attr('href', '#');
                $a.$i = $i;
            }
            return $a;
        },
        _createControlClose     : function () {
            console.log('_createControlClose');
            this.$close = this._createControl('close', 'fa fa-times');
            this.$controls.append(this.$close);
            this._off(this.$close, 'click');
            this._on(this.$close, {
                click: function (event) {
                    event.preventDefault();
                    this._trigger('close', event);
                    this.element.slideUp(300, function () {
                        this.element.remove();
                        this.destroy();
                    }.bind(this));
                }
            });
        },
        _createControlMinimize  : function () {
            console.log('_createControlMinimize');
            this.$minimize = this._createControl('minimize', 'fa fa-chevron-down');
            this.$controls.append(this.$minimize);
            this._off(this.$minimize, 'click');
            this._on(this.$minimize, {
                click: function (event) {
                    event.preventDefault();
                    var $i = this.$minimize.$i;
                    var $sec = this.options.scroll ? this.$section.parent() : this.$section;
                    if ( $i.hasClass('fa-chevron-down') ) {
                        this._trigger('minimize', event);
                        $sec.slideUp();
                        $i.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                    } else {
                        this._trigger('maximize', event);
                        $sec.slideDown();
                        $i.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                    }
                }
            });
        },
        _createControlMove      : function () {
            console.log('_createControlMove');
            this.$move = this._createControl('move', 'fa fa-arrows');
            this.$controls.append(this.$move);
            this.element.draggable({handle: this.$move});
        },
        _createControlFullscreen: function() {
            console.log('_createControlMove');
            this.$fullscreen = this._createControl('move', 'fa fa-expand');
            this.$controls.append(this.$fullscreen);
            this._off(this.$fullscreen, 'click');
            this._on(this.$fullscreen, {
                click: function (event) {
                    event.preventDefault();
                    if(this.element.hasClass('box-fullscreen')){
                        this.element.removeClass('on');
                        this.element.removeClass('box-fullscreen');
                        $body.removeClass('fullscreen');
                    } else {

                    }

                }
            });
        },
        _ensureControlsContainer: function () {
            var $actions = this.$header.find('> .actions');
            var $controls = this.$header.find('> .controls');
            if ( $controls.length == 0 ) {
                $controls = cre().addClass('controls');
                if ( $actions.length > 0 ) {
                    $actions.before($controls);
                } else {
                    this.$header.append($controls)
                }
            }
            this.$controls = $controls;
        },
        _destroy                : function () {
            if ( this.options.scroll ) {
                theme.destroySlimScroll(this.element.find('> section'));
            }
        },
        //  Any time the plugin is called with no arguments or with only an option hash,
        // the widget is initialized; this includes when the widget is created.
        _init                   : function () {

        },
        _setOptions             : function (options) {
            var that = this;

            $.each(options, function (key, value) {
                if ( key === "draggable" || key === "droppable" || key === 'closeable' ) {
                    value = value === "true";
                }
                that._setOption(key, value);
            });

        }
    });
});
