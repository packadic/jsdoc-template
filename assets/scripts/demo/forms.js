define([ 'jquery'       ,'plugins/select2', 'plugins/bs-datepicker', 'plugins/bs-maxlength' ],
    function( $ ){
        'use strict';
        var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];

        $('.form-demo-select2-tags').select2({
            data: data,
            tags: true,
            tokenSeparators: [',', ' ']
        });

        $('.form-demo-select2').select2({
            data: data
        })

        $('.form-demo-datepicker-inline').datepicker({
            todayBtn: true,
            clearBtn: true,
            calendarWeeks: true
        });

        $('.form-demo-datepicker-input').datepicker();


        $('.form-demo-maxlength').maxlength();
    });
