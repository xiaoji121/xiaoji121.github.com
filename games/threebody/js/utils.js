/**
 * 帮助函数
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-18 19:25
 */

define(function(require, exports, module) {

    var level = getParam()['level'] || 'info', guid = 1;

    function getParam() {
        var search = location.search, items, item, param = {};

        if (search) {
            search = search.substring(1);
            items = search.split('&');
            for (var i = 0, leni = items.length; i < leni; i++) {
                item = items[i].split('=');
                param[item[0]] = item[1];
            }
        }

        return param;
    }

    exports.debug = function() {
        if (level === 'debug') {
            console.log.apply(console, arguments);
        }
    };

    exports.info = function() {
        if (level === 'info' || level === 'debug') {
            console.log.apply(console, arguments);
        }
    };

    exports.guid = function() {
        return guid++;
    };

    exports.createSmallStar = function() {

        var width = Math.floor(3 * Math.random());
        var top = 130 + 280 * Math.random();
        var left = 130 + 700 * Math.random();

        $('<div>').attr({
            id: exports.guid(),
            class: 'small-star'
        }).css({
            width: width,
            height: width,
            borderRadius: width / 2,
            top: top,
            left: left
        }).appendTo('#container');


    }

});