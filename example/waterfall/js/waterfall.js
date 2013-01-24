define(function (require) {
    var $ = require('$');

    $.fn.waterfall = function (options) {

        if (!this.waterfallOptions) {
            this.waterfallOptions = $.extend({
                container:$('body'),
                offset:2,
                autoResize:false,
                itemWidth:$(this[0]).outerWidth(),
                resizeDelay:50
            }, options);
        } else if (options) {
            this.waterfallOptions = $.extend(this.waterfallOptions, options);
        }

        // Layout variables.
        if (!this.waterfallColumns) {
            this.waterfallColumns = null;
            this.waterfallContainerWidth = null;
        }

        // Main layout function.
        this.waterfallLayout = function () {
            // Calculate basic layout parameters.
            var columnWidth = this.waterfallOptions.itemWidth + this.waterfallOptions.offset;
            var containerWidth = this.waterfallOptions.container.width();
            var columns = Math.floor((containerWidth + this.waterfallOptions.offset) / columnWidth);
            var offset = Math.round((containerWidth - (columns * columnWidth - this.waterfallOptions.offset)) / 2);

            // If container and column count hasn't changed, we can only update the columns.
            var bottom = 0;
            if (this.waterfallColumns != null && this.waterfallColumns.length == columns) {
                bottom = this.waterfallLayoutColumns(columnWidth, offset);
            } else {
                bottom = this.waterfallLayoutFull(columnWidth, columns, offset);
            }

            // Set container height to height of the grid.
            this.waterfallOptions.container.css('height', bottom + 'px');
        };

        /**
         * Perform a full layout update.
         */
        this.waterfallLayoutFull = function (columnWidth, columns, offset) {
            // Prepare Array to store height of columns.
            var heights = [];
            while (heights.length < columns) {
                heights.push(0);
            }

            // Store column data.
            this.waterfallColumns = [];
            while (this.waterfallColumns.length < columns) {
                this.waterfallColumns.push([]);
            }

            // Loop over items.
            var item, top, left, i = 0, k = 0, length = this.length, shortest = null, shortestIndex = null, bottom = 0;
            for (; i < length; i++) {
                item = $(this[i]);

                // Find the shortest column.
                shortest = null;
                shortestIndex = 0;
                for (k = 0; k < columns; k++) {
                    if (shortest == null || heights[k] < shortest) {
                        shortest = heights[k];
                        shortestIndex = k;
                    }
                }

                // Postion the item.
                item.css({
                    position:'absolute',
                    top:shortest + 'px',
                    left:(shortestIndex * columnWidth + offset) + 'px'
                });

                // Update column height.
                heights[shortestIndex] = shortest + item.outerHeight() + this.waterfallOptions.offset;
                bottom = Math.max(bottom, heights[shortestIndex]);

                this.waterfallColumns[shortestIndex].push(item);
            }

            return bottom;
        };

        /**
         * This layout function only updates the vertical position of the
         * existing column assignments.
         */
        this.waterfallLayoutColumns = function (columnWidth, offset) {
            var heights = [];
            while (heights.length < this.waterfallColumns.length) {
                heights.push(0);
            }

            var i = 0, length = this.waterfallColumns.length, column;
            var k = 0, kLength, item;
            var bottom = 0;
            for (; i < length; i++) {
                column = this.waterfallColumns[i];
                kLength = column.length;
                for (k = 0; k < kLength; k++) {
                    item = column[k];
                    item.css({
                        left:(i * columnWidth + offset) + 'px',
                        top:heights[i] + 'px'
                    });
                    heights[i] += item.outerHeight() + this.waterfallOptions.offset;

                    bottom = Math.max(bottom, heights[i]);
                }
            }

            return bottom;
        };

        // Listen to resize event if requested.
        this.waterfallResizeTimer = null;
        if (!this.waterfallResizeMethod) {
            this.waterfallResizeMethod = null;
        }
        if (this.waterfallOptions.autoResize) {
            // This timer ensures that layout is not continuously called as window is being dragged.
            this.waterfallOnResize = function (event) {
                if (this.waterfallResizeTimer) {
                    clearTimeout(this.waterfallResizeTimer);
                }
                this.waterfallResizeTimer = setTimeout($.proxy(this.waterfallLayout, this), this.waterfallOptions.resizeDelay)
            };

            // Bind event listener.
            if (!this.waterfallResizeMethod) {
                this.waterfallResizeMethod = $.proxy(this.waterfallOnResize, this);
            }
            $(window).resize(this.waterfallResizeMethod);
        }
        ;

        /**
         * Clear event listeners and time outs.
         */
        this.waterfallClear = function () {
            if (this.waterfallResizeTimer) {
                clearTimeout(this.waterfallResizeTimer);
                this.waterfallResizeTimer = null;
            }
            if (this.waterfallResizeMethod) {
                $(window).unbind('resize', this.waterfallResizeMethod);
            }
        };

        // Apply layout
        this.waterfallLayout();

        // Display items (if hidden).
        this.show();
    };

});

