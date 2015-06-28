define([ 'jquery', '../fn/defined', '../fn/default', '../fn/cre', '../theme', 'Q',
         'datatables', '../vendor/dataTables.bootstrap', 'plugins/select2' ],
    function( $, defined, def, cre, theme, Q ){
        'use strict';

        var dt = {};

        (function render(){
            /**
             * Get default Server Side Processing vars
             */
            dt.getDefaultSSPVars = function( overrides ){
                overrides = overrides || {};
                var defaults = {
                    "bPaginate"    : true,
                    "bLengthChange": true,
                    "bFilter"      : true,
                    "bSort"        : true,
                    "bInfo"        : true,
                    "bAutoWidth"   : false,
                    "bStateSave"   : true,
                    "lengthMenu"   : [
                        [ 10, 20, 50, 100, 150, -1 ],
                        [ 10, 20, 50, 100, 150, "All" ]
                    ],
                    "pageLength"   : 10,
                    "processing"   : true,
                    "serverSide"   : true
                };
                return _.merge(defaults, overrides);
            };

            dt.create = function(datatableVars, templateVars){
                var defer = Q.defer();
                theme.table(def(templateVars, null)).then(function($table){
                    $table.appendTo(theme.$hidden).dataTable(datatableVars);
                    var $wrapper = $table.parents('.dataTables_wrapper').first();
                    $wrapper.find('.dataTables_length select').select2();
                    $wrapper.$table = $table;
                    defer.resolve($wrapper);
                });
                return defer.promise;
            }

        }.call());

        return dt;
    });
