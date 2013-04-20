## Deferred Helper

The difference of $.when and $.whenAll?

$.when will fail whenever which one fail


    $.when($.ajax("/page1.php"), $.ajax("/page2.php")).done(function(a1,  a2){

        // arguments are [ data, textStatus, jqXHR ]

    });


$.whenAll will done whenever which one fail

    $.whenAll($.ajax("/page1.php"), $.ajax("/page2.php")).done(function(a1,  a2){

        // arguments are {state: state, value: [ data, textStatus, jqXHR ]}

    });