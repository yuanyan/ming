!(function (factory) {
    if (typeof define === 'function') {
        define(['$'], factory);
    } else {
        factory($);
    }
})(function ($) {
    'use strict';
    var pluginName = "View";

    function View(options){
        this.configure(options);
        this.bindElement();
        this.renderChildren();
        this.initialize.apply(this, arguments);
    }

    View.prototype = {
        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){},

        // The default `tagName` of a View's element is `"div"`.
        tagName: 'div',

        // The default `display` of a View's element is `"block"`.
        display: 'block',

        options: {},

        configure: function(options){

            for(var opt in options){
                if(options.hasOwnProperty(opt)) {
                    this.options[opt] = this[opt] = options[opt];
                }
            }
        },

        // Ensure that the View has a DOM element to render into.
        bindElement: function(el) {
            if(el){
                this.el = el;
                // TODO: get element default display attr
            } else if (!this.options.el) {
                this.el = document.createElement(this.tagName);
            }
            this.el.style.display = this.display;
            return this;
        },

        // Logic subview set.
        children: [],

        renderChildren: function(){
            this.children.forEach(function(subview){
                subview.render();
            });
        },

        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        render: function() {
            return this;
        },

        show: function() {
            this.el.style.display = this.display;
        },

        hide: function() {
            this.el.style.display = 'none';
        }
    }

    return $[pluginName] =  View;
});