(function () {

    var packadic = (window.packadic = window.packadic || {});

    packadic.mergeConfig({
        debug   : true,
        demo    : true,
        oauth_io: 'UpFevf23G2O93iSlMOQ5PRL4zq0'
    }).onPreBoot(function () {
        console.warn('(' + packadic.getElapsedTime() + 's) PRE-BOOT');
    }).onBoot(function () {
        console.warn('(' + packadic.getElapsedTime() + 's) BOOTING');
    }).onBooted(['jquery', 'theme', 'theme/sidebar', 'autoload', 'jq/box'], function ($, theme, sidebar, autoload) {
        console.warn('(' + packadic.getElapsedTime() + 's) BOOTED');
        theme.init();
        sidebar.init({hidden: false, items: packadic.site.data.navigation.sidebar});

        $(function(){
            autoload.scan($('body'), function () {
                if ( packadic.config.pageLoadedOnAutoloaded === true ) {
                    packadic.removePageLoader();
                }
            });
        });
    }).onStart(function () {
        console.warn('(' + packadic.getElapsedTime() + 's) STARTING');
    }).onStarted(function () {
        console.warn('(' + packadic.getElapsedTime() + 's) STARTED');
    });

    packadic.onStart(['jquery', 'jq/box'], function ($, theme, cre) {
        $(function() {
            var tb = $('.test-box');
            tb.box();
        });
    });
    // Create layout settings editor for demo
    packadic.onStart(['jquery', 'theme/settings-editor', 'theme', 'storage', 'fn/cre'], function ($, SettingsEditor, theme, storage, cre) {




        var shouldSave = function () {
            return storage.get('demo.layout.editor.save', {default: false}) == "true";
        };

        var layoutEditor = window.ceditors = new SettingsEditor($('#layout-editor'), {
            target  : '#layout-editor',
            controls: [{
                id: 'persistent-save', name: 'Save adjustments', 'default': false, type: 'switch', options: {
                    isEnabled: shouldSave,
                    toggle   : function (event, val) {
                        storage.set('demo.layout.editor.save', val);
                    }
                }
            }, {
                id: 'top', name: 'Top', 'default': theme.get('section-top'), type: 'select', options: {
                    choices : {
                        'hidden': {name: 'Hidden'},
                        'normal': {name: 'Normal'},
                        fixed   : {name: 'Fixed'}
                    },
                    onChange: function ($el) {
                        theme.set('section-top', $el.val(), true, shouldSave())
                    }
                }
            }, {
                id: 'page-boxed', name: 'Boxed Layout', 'default': false, type: 'switch', options: {
                    isEnabled: function () {
                        return theme.get('layout-option') === 'boxed'
                    },
                    toggle   : function (event, val) {
                        theme.set('layout-option', val ? 'boxed' : 'fluid', true, shouldSave());
                    }
                }
            }, {
                id: 'footer-fixed', name: 'Fixed Bottom', 'default': true, type: 'switch', options: {
                    isEnabled: function () {
                        return theme.get('section-bottom') === 'fixed'
                    },
                    toggle   : function (event, val) {
                        theme.set('section-bottom', val ? 'fixed' : 'default', true, shouldSave());
                    }
                }
            }, {
                id: 'sidebar-fixed', name: 'Fixed Sidebar', 'default': false, type: 'switch', options: {
                    isEnabled: function () {
                        return theme.get('sidebar-option') === 'fixed'
                    },
                    toggle   : function (event, val) {
                        theme.set('sidebar-option', val ? 'fixed' : 'default', true, shouldSave());
                    }
                }
            }, {
                id: 'sidebar-style', name: 'Light Sidebar', 'default': false, type: 'switch', options: {
                    isEnabled: function () {
                        return theme.get('sidebar-option') === 'light'
                    },
                    toggle   : function (event, val) {
                        theme.set('sidebar-style', val ? 'light' : 'default', true, shouldSave());
                    }
                }

            }, {
                id: 'sidebar-menu', name: 'Sidebar Hover', 'default': false, type: 'switch', options: {
                    isEnabled: function () {
                        return theme.get('sidebar-menu') === 'hover'
                    },
                    toggle   : function (event, val) {
                        theme.set('sidebar-menu', val ? 'hover' : 'default', true, shouldSave());
                    }
                }
            }, {
                id: 'layout-reset-default', name: 'Reset to defaults', type: 'button', options: {
                    click: function () {
                        theme.reset(shouldSave());
                        window.location.reload();
                    }
                }
            }]
        })


        var texturePicker = function () {
            var $el = $('#texture-picker');
            setInterval(function () {
                return;
                var element = $(':hover');
                if ( element.length ) {
                    var domElement = element[element.length - 1];
                    var tagName = domElement.tagName;
                    var id = domElement.id ? ' id="' + domElement.id + '"' : "";

                    document.getElementById('test').innerHTML =
                        "hover: &lt;" + tagName.toLowerCase() + id + "&gt;";
                }
            }, 100);
        }.call();
    });
}.call());


/*
 var asdf = function (editable, $container) {
 var self = this;
 if(defined(this['_texturePickerBox'])){}
 theme.box('Texture picker', 'photo').then(function ($box) {

 var $d = $(window.document);
 var ed = {
 $prev          : null,
 _selecting     : false,
 _started       : false,
 _onMove        : function () {
 var $e = $(':hover').last();
 if ( $e.hasClass('mmhover') ) {
 return;
 } else {
 if ( ed.$prev != null ) ed.$prev.removeClass('mmhover');
 $e.addClass('mmhover');
 ed.$prev = $e;
 }
 },
 _onTextureClick: function () {
 console.log('ontext', $(this).data('filename'));
 ed.$prev.css({
 'background-image' : "url('/assets/images/textures/" + $(this).data('filename') + "')",
 'background-repeat': 'repeat'
 });
 },
 start          : function () {
 if ( ed._selecting || ed._started ) return;
 require(['plugins/mscrollbar'], function () {
 });
 ed.$prev = $(':hover');
 ed._selecting = true;
 ed._started = true;
 $d.on('mousemove', ed._onMove);
 $d.on('click', function () {
 if ( ! ed._selecting ) return;
 $d.off('mousemove', ed._onMove);
 console.log(ed.$prev.removeClass('mmhover'));
 $box.show();
 ed._selecting = false;
 })
 }
 };



 $box.addClass('box-draggable');
 $box.createAction('close-texture-picker', 'Close', 'red', '#').on('click', function ()
 if ( ! ed._started ) return;
 ed._started = false;
 $box.
 });

 var $textureContainer = cre().css({width: '100%', height: '350px'});

 var $starter = cre('a').addClass('btn green').text('START').on('click', function () {
 ed.start();
 });


 var $closer = cre('a')
 .addClass('btn red').text('STOP')
 .on('click', function () {
 $textureContainer.remove();
 });

 $box.$content.append($starter).append($closer).append($textureContainer);


 $.each(packadic.site.data.theme.textures, function (i, fileName) {
 cre('a')
 .addClass('btn btn-sm grey-light').attr('data-filename', fileName)
 .css({
 background: 'url(/assets/images/textures/' + fileName + ') repeat',
 height    : '50px',
 width     : '50px',
 margin    : '2px'
 })
 .appendTo($textureContainer)
 .on('click', ed._onTextureClick);
 });

 require(['plugins/mscrollbar'], function () {
 $textureContainer.mCustomScrollbar({
 axis               : 'y',
 theme              : "dark",
 alwaysShowScrollbar: 2,
 mouseWheel         : {axis: "y"},
 advanced           : {
 //autoExpandHorizontalScroll: true,
 updateOnImageLoad: true
 }
 })
 });
 });

 return $picker;
 };
 */
