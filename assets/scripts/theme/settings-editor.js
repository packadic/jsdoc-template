define(['jquery', '../fn/defined', '../fn/cre', 'plugins/bs-switch'],
    function ($, defined, cre) {
        'use strict';

        var packadic = (window.packadic = window.packadic || {});


        var controls = {
            texturePicker: function(editable, $container){
                var self = this;
                var $picker = cre();

                return $picker;
            },
            button: function(editable, $container){
                return cre('a').appendTo($container)
                    .attr({
                        id: editable.id,
                        class: 'btn btn-primary btn-xs',
                        href: '#'
                    })
                    .text(editable.name)
                    .on('click', function(){
                        editable.options.click.apply(editable.options);
                    });
            },
            select: function(editable, $container){
                var self = this;
                var $control = cre('select').addClass(self.options.controlClass).appendTo($container);

                $.each(editable.options.choices, function (key, option) {
                    var opt = cre('option').attr('value', key).text(option.name);
                    if (editable.default === key) {
                        opt.attr('selected', 'selected');
                    }
                    $control.append(opt);
                });

                var defaultOption = editable.options[editable.default];

                var onChange = function(){
                    if(!defined(editable.options.onChange)) return;
                    return editable.options.onChange($(this));
                };

                $control.on('change', onChange);

                return $control;
            },
            'switch': function(editable, $container){
                var self = this;

                return cre('input')
                    .appendTo($container)
                    .attr({
                        id: editable.id,
                        type: 'checkbox',
                        'data-size': 'mini',
                        'data-on-color': 'warning'
                    })
                    .addClass('switch')
                    .bootstrapSwitch({
                        state: editable.options.isEnabled(),
                        onSwitchChange: function(event, data){
                            console.log(event, data);
                            editable.options.toggle.apply(editable.options, [event, data]);
                        }
                    });
            }
        };

        function SettingsEditor($el, o) {
            var self = this;

            o = defined(o) ? o : {};
            this.options = _.merge(this.defaults, o);

            this.$el = $el;
            this.$hidden = cre().addClass('hide').appendTo($('body'));
            this.controls = {};

            $.each(this.options.controls, function(i, editable){
                self.controls[editable.id] = editable;

            });

            this.createEditorPanel();
        }

        SettingsEditor.prototype = {
            constructor      : SettingsEditor,
            defaults         : {
                target     : '',
                containerClass: 'setting-box clearfix',
                labelWrapClass: 'setting-label pull-left',
                labelClass : 'control-label',
                controlWrapClass: 'setting-control pull-right',
                controlClass : 'form-control',
                editorTitle: 'Editor',
                controls  : [
                ]
            },
            createEditorPanel: function () {
                var self = this;
                var $el = self.$el;
                var o = self.options;
                self.$form = cre('form').appendTo($el);
                $.each(self.controls, function (i, editable) {

                    var $box = cre().addClass(o.containerClass).appendTo(self.$form);
                    var $title = cre().addClass(o.labelWrapClass).appendTo($box),
                        $body = cre().addClass(o.controlWrapClass).appendTo($box);
                    var $label = cre('label')
                        .addClass(self.options.labelClass)
                        .text(editable.name)
                        .attr('for', editable.id)
                        .appendTo($title);

                    var $control = controls[editable.type].apply(self, [editable, $body]);
                });
            },
            getControl: function(id){
                return this.controls[id];
            }
        };

        return SettingsEditor;
    });
