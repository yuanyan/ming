!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = 'Card';

    /**
     *
     * @param views object
     * @constructor
     */
    var Card = function(views){
        // views map is safe, array is also support but may index
        this.add(views);
    };

    Card.prototype = {

        layout: 'card',

        views: {},

        // add('name', view)
        // add({'name': view})
        add: function(name, views){
            var self = this;
            if(views){
                self.views[name] = views;
            }else {
                $.each(views, function(index, view){
                    if(!self.activeView)
                        // default display the top item when display by card style
                        this.setActiveView(view);
                    else
                        view.hide();

                    self.views[index] = view;
                })
            }
        },

        getView: function(name){
            return this.views[name];
        },

        getActiveView : function(){
            return this.activeView;
        },

        setActiveView: function(view){
            if(typeof view === 'string'){
                 view = this.getView(view);
            }

            if (view !== this.activeView) {
                // active view maybe null when init active view
                this.activeView && this.activeView.hide();
                this.activeView = view;
                this.activeView.show();
            }
        }

    };


    return $[pluginName] =  Card;
});