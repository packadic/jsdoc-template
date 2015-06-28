define([ 'jquery', 'plugins/gtreetable' ],
    function( $ ){
        'use strict';

        var demoContent = {"nodes":[{"id":1619,"name":"Test","level":0,"type":"default"},{"id":1624,"name":"deneme","level":0,"type":"default"},{"id":1631,"name":"sdfsdf","level":0,"type":"default"},{"id":1632,"name":"sdfsdf","level":0,"type":"default"},{"id":1633,"name":"sfdf","level":0,"type":"default"},{"id":1635,"name":"ss","level":0,"type":"default"}]};

        return function($els){
            console.log('gtreetable', $els);
            $els.gtreetable({
                'draggable': true,
                'source': function(id) {
                    return {
                        type: 'GET',
                        url: '/demo/gtreetable.php',
                        data: {
                            'id': id
                        },
                        dataType: 'json',
                        error: function(XMLHttpRequest) {
                            alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
                        }
                    }
                },
                'sort': function (a, b) {
                    var aName = a.name.toLowerCase();
                    var bName = b.name.toLowerCase();
                    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
                },
                'types': { default: 'fa fa-folder-open', folder: 'fa fa-folder-open'},
                'inputWidth': '255px'
            })
        };
    });
