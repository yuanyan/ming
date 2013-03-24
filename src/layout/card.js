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
     * @param items array
     * @constructor
     */
    var Card = function(items){

        $.each(items, function(index, item){

            if(index === 0)
                // only display the top item when display by card style
                this.setActiveItem(item);
            else
                item.hide()
        })
    };

    Card.prototype = {

        layout: 'card',

        getActiveItem : function(){
            return this._activeItem;
        },

        setActiveItem: function(target){

            if (target) {
                this._activeItem && this._activeItem.hide();
                this._activeItem = $(target);
                this._activeItem.show();
            }
        }

    };


    return $[pluginName] =  Card;
});