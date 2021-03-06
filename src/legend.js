/**
 * Legend is a attachable widget that can be added to other dc charts to render horizontal legend
 * labels.
 * Examples:
 * - [Nasdaq 100 Index](http://dc-js.github.com/dc.js/)
 * - [Canadian City Crime Stats](http://dc-js.github.com/dc.js/crime/index.html)
 * @name legend
 * @memberof dc
 * @example
 * chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
 * @returns {Legend}
 */
dc.legend = function () {
    var LABEL_GAP = 2;

    var _legend = {},
        _parent,
        _x = 0,
        _y = 0,
        _itemHeight = 12,
        _gap = 5,
        _horizontal = false,
        _legendWidth = 560,
        _itemWidth = 70,
        _autoItemWidth = false;

    var _g;

    _legend.parent = function (p) {
        if (!arguments.length) {
            return _parent;
        }
        _parent = p;
        return _legend;
    };

    _legend.render = function () {
        _parent.svg().select('g.dc-legend').remove();
        _g = _parent.svg().append('g')
            .attr('class', 'dc-legend')
            .attr('transform', 'translate(' + _x + ',' + _y + ')');
        var legendables = _parent.legendables();

        var itemEnter = _g.selectAll('g.dc-legend-item')
            .data(legendables)
            .enter()
            .append('g')
            .attr('class', 'dc-legend-item')
            .on('mouseover', function (d) {
                _parent.legendHighlight(d);
            })
            .on('mouseout', function (d) {
                _parent.legendReset(d);
            })
            .on('click', function (d) {
                d.chart.legendToggle(d);
            });

        _g.selectAll('g.dc-legend-item')
            .classed('fadeout', function (d) {
                return d.chart.isLegendableHidden(d);
            });

        if (legendables.some(dc.pluck('dashstyle'))) {
            itemEnter
                .append('line')
                .attr('x1', 0)
                .attr('y1', _itemHeight / 2)
                .attr('x2', _itemHeight)
                .attr('y2', _itemHeight / 2)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', dc.pluck('dashstyle'))
                .attr('stroke', dc.pluck('color'));
        } else {
            itemEnter
                .append('rect')
                .attr('width', _itemHeight)
                .attr('height', _itemHeight)
                .attr('fill', function (d) {return d ? d.color : 'blue';});
        }

        itemEnter.append('text')
                .text(dc.pluck('name'))
                .attr('x', _itemHeight + LABEL_GAP)
                .attr('y', function () {
                    return _itemHeight / 2 + (this.clientHeight ? this.clientHeight : 13) / 2 - 2;
                });

        var _cumulativeLegendTextWidth = 0;
        var row = 0;
        itemEnter.attr('transform', function (d, i) {
            if (_horizontal) {
                var translateBy = 'translate(' + _cumulativeLegendTextWidth + ',' + row * legendItemHeight() + ')';
                var itemWidth   = _autoItemWidth === true ? this.getBBox().width + _gap : _itemWidth;

                if ((_cumulativeLegendTextWidth + itemWidth) >= _legendWidth) {
                    ++row ;
                    _cumulativeLegendTextWidth = 0 ;
                } else {
                    _cumulativeLegendTextWidth += itemWidth;
                }
                return translateBy;
            } else {
                return 'translate(0,' + i * legendItemHeight() + ')';
            }
        });
    };

    function legendItemHeight () {
        return _gap + _itemHeight;
    }

    /**
     * Set or get x coordinate for legend widget.
     * @name x
     * @memberof dc.legend
     * @instance
     * @param  {Number} [x=0]
     * @returns {Legend}
     */
    _legend.x = function (x) {
        if (!arguments.length) {
            return _x;
        }
        _x = x;
        return _legend;
    };

    /**
     * Set or get y coordinate for legend widget.
     * @name y
     * @memberof dc.legend
     * @instance
     * @param  {Number} [y=0]
     * @returns {Legend}
     */
    _legend.y = function (y) {
        if (!arguments.length) {
            return _y;
        }
        _y = y;
        return _legend;
    };

    /**
     * Set or get gap between legend items.
     * @name gap
     * @memberof dc.legend
     * @instance
     * @param  {Number} [gap=5]
     * @returns {Legend}
     */
    _legend.gap = function (gap) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = gap;
        return _legend;
    };

    /**
     * Set or get legend item height.
     * @name itemHeight
     * @memberof dc.legend
     * @instance
     * @param  {Number} [itemHeight=12]
     * @returns {Legend}
     */
    _legend.itemHeight = function (itemHeight) {
        if (!arguments.length) {
            return _itemHeight;
        }
        _itemHeight = itemHeight;
        return _legend;
    };

    /**
     * Position legend horizontally instead of vertically.
     * @name horizontal
     * @memberof dc.legend
     * @instance
     * @param  {Boolean} [horizontal=false]
     * @returns {Legend}
     */
    _legend.horizontal = function (horizontal) {
        if (!arguments.length) {
            return _horizontal;
        }
        _horizontal = horizontal;
        return _legend;
    };

    /**
     * Maximum width for horizontal legend.
     * @name legendWidth
     * @memberof dc.legend
     * @instance
     * @param  {Number} [legendWidth=500]
     * @returns {Legend}
     */
    _legend.legendWidth = function (legendWidth) {
        if (!arguments.length) {
            return _legendWidth;
        }
        _legendWidth = legendWidth;
        return _legend;
    };

    /**
     * legendItem width for horizontal legend.
     * @name itemWidth
     * @memberof dc.legend
     * @instance
     * @param  {Number} [itemWidth=70]
     * @returns {Legend}
     */
    _legend.itemWidth = function (itemWidth) {
        if (!arguments.length) {
            return _itemWidth;
        }
        _itemWidth = itemWidth;
        return _legend;
    };

    /**
     * Turn automatic width for legend items on or off. If true, itemWidth() is ignored.
     * This setting takes into account gap().
     * @name autoItemWidth
     * @memberof dc.legend
     * @instance
     * @param  {Boolean} [autoItemWidth=false]
     * @returns {Legend}
     */
    _legend.autoItemWidth = function (autoItemWidth) {
        if (!arguments.length) {
            return _autoItemWidth;
        }
        _autoItemWidth = autoItemWidth;
        return _legend;
    };

    return _legend;
};
