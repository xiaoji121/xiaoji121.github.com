/**
 * Created by dongming on 14-9-19.
 * 计时器
 */

define(function(require, exports, module) {
    var seconds = 0;
    var timer = null;

    exports.start = function() {
        (function time() {
            seconds++;
            clearTimeout(timer);
            timer = setTimeout(time, 1000);
        })();
    };

    exports.pause = function() {
        clearTimeout(timer);
    };

    exports.getDuration = function() {
        return seconds;
    };

    exports.sleep = function(milliSeconds) {
        var startTime = new Date().getTime();
        while(new Date().getTime() < startTime + milliSeconds);
    };

});
