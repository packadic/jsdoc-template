define(['jquery', '../fn/defined', '../fn/cre', 'plugins/bs-switch'],
    function ($, defined, cre) {
        'use strict';

        var controls = {
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
                var $control = cre('select')
                    .appendTo($container)
                    .addClass(self.options.controlClass)
                    .attr('data-component-editor-for-id', editable.id);
                // Populate the select

                $.each(editable.options.choices, function (key, option) {
                    var opt = cre('option').attr('value', key).text(option.name);
                    if (editable.default === key) {
                        opt.attr('selected', 'selected');
                    }
                    $control.append(opt);
                });
                var onChange = function(){
                    var $el = $(this);
                    console.log('selected new editable option', $el.val());
                    var id = $el.data('component-editor-for-id');
                    var editable = self.editables[id];

                    self.getTarget(id)
                        .removeClass(editable.options[editable.current].class)
                        .addClass(editable.options[$el.val()].class);

                    self.setCurrent(id, $el.val());
                    console.log('changed option for', id, editable)
                };

                var customOnChange = function(){
                    return editable.options.onChange($(this)); //
                };


                // On change option
                $control.on('change', defined(editable.options.onChange) ? customOnChange : onChange);

                // Set the target to the default value
                self.setCurrent(editable.id, editable.default);
                var $editable = self.getTarget(editable.id);
                var defaultOption = editable.options[editable.default];
                //if (defined(defaultOption['class']) && !$editable.hasClass(defaultOption['class'])) {
                //    $editable.addClass(defaultOption['class']);
                // }

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

        function ComponentEditor($el, o) {
            var self = this;

            o = defined(o) ? o : {};
            this.options = _.merge(this.defaults, o);

            this.$el = $el;
            this.$target = $(this.options.target);
            this.$hidden = cre().addClass('hide').appendTo($('body'));

            this.editables = {};
            $.each(this.options.editables, function(i, editable){
                self.editables[editable.id] = editable;

            });

            this.editableTargets = {};
            this.$target.find('*[data-component-editor-id]').each(function(){
                var $el = $(this);
                var ids = $el.data('component-editor-id').split('|');
                $.each(ids, function(i, id){
                    if(defined(self.editableTargets[id])){
                        self.editableTargets[id] = self.editableTargets[id].add($el);
                    } else {
                        self.editableTargets[id] = $el;
                    }
                });
                console.log(ids);
            });
            this.createEditorPanel();
        }

        ComponentEditor.prototype = {
            constructor      : ComponentEditor,
            defaults         : {
                target     : '',
                containerClass: 'setting-box clearfix',
                labelWrapClass: 'setting-label pull-left',
                labelClass : 'control-label',
                controlWrapClass: 'setting-control pull-right',
                controlClass : 'form-control',
                editorTitle: 'Editor',
                editables  : [
                    {
                        id: 'header', name: 'Header class', type: 'select', default: '', options: {}
                    }
                ]
            },
            createEditorPanel: function () {
                var self = this;
                var $el = self.$el;
                var o = self.options;
                self.$form = cre('form').appendTo($el);
                $.each(self.editables, function (i, editable) {

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
            getEditable: function(id){
                return this.editables[id];
            },
            /**
             *
             * @param id
             * @returns {$}
             */
            getTarget: function(id){
                return this.editableTargets[id];
            },
            getCurrent: function(id){
                return this.editables[id].current;
            },
            setCurrent: function(id, current){
                this.editables[id].current = current;
            }
        };

        return ComponentEditor;
    });
