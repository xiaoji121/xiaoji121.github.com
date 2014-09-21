/**
 * 事件api
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-18 16:48
 */

define(function(require, exports, module) {

    return {
        trigger: function(eventName, data) {
            $('body').trigger(eventName, data);
        },
        on: function(eventName, fn) {
            $('body').on(eventName, fn);
        },
        off: function(eventName, fn) {
            $('body').off(eventName, fn);
        },
        one: function(eventName, fn) {
            $('body').one(eventName, fn);
        }
    }
});
