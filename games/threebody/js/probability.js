/**
 * Created by dongming on 14-9-19.
 * 计算概率事件
 */

define(function(require, exports, module) {

    exports.isHappend = function(rate) {

        var rateStr = rate.toString();
        var power = (rateStr.split('.')[1]).length;

        rate = Math.pow(10, power) * rate;

        var randomNum = exports.getIntRandom(1, 100);

        // 1-rate则为命中
        if (randomNum <= rate) {
            return true;
        } else {
            return false;
        }
    };

    exports.whichHappend = function() {
        var args = Array.prototype.slice.call(arguments);

        var min = Math.min.apply(null, args);
        var rateStr = min.toString();
        var power = (rateStr.split('.')[1]).length;
        var sum = 0;
        var arr = [];

        var ret = args.map(function(ele) {
            sum += Math.floor(ele * Math.pow(10, power));
            return Math.floor(ele * Math.pow(10, power));
        });

        var randomNum = exports.getIntRandom(0, sum);

        for (var i = 0, l = ret.length; i < l; i++) {
            var ele = ret[i];
            for(var j = 0; j < ele; j++) {
                arr.push(i);
            }
        }

        var which = arr[randomNum];

        return which;
    };

    exports.getIntRandom = function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    exports.getFloatRandom = function(min, max) {
        var rateStr = min.toString();
        var power = (rateStr.split('.')[1]).length;
        var ret = Math.pow(10, power);

        min = Math.floor(min * ret);
        max = Math.floor(max * ret);

        return exports.getIntRandom(min, max) / ret;
    };

});
