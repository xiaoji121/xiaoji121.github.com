/**
 * 碰撞检测
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-18 19:26
 */

define(function(require, exports, module) {

    var config = require('./config'), stars = config.stars, planet = config.planet;
    var $planet = $('#' + planet.id);
    var utils = require('./utils');
    var ps = require('./ps');
    var cons = require('./constants');
    var event = require('./event');

    exports.checkCollision = function() {

        for (var i = 0, leni = stars.length; i < leni; i++) {
            if (collision($planet, $('#' + stars[i].id))) {
                return true;
            }
        }

        var $smallStars = $('.small-star'), $smallStar;

        for (var i = 0, leni = $smallStars.length; i < leni; i++) {

            $smallStar = $($smallStars[i]);
            if (collision($planet, $smallStar, 8)) {
                ps.setStarDustNum();
                $('#count').text(ps.getStarDustNum());
                $smallStar.remove();
                utils.createSmallStar();
            }
        }

        return false;
    };

    exports.doCollision = function() {

        event.trigger(cons.PAUSE_GAME);
        
        var starAge = ps.getStarAge(), population = ps.getPopulation(), era = ps.getCurrentAgeName();
        $('#su-age').text(starAge > 10 ? starAge - 10 : starAge);
        $('#su-era').text(era[0]);
        $('#su-pop').text(population);
        $('#ending').show();

    };

    function collision(obj1, obj2, offset) {

        offset = offset || 18;

        var obj1Center = getPos(obj1), obj2Center = getPos(obj2);
        var obj1Radius = obj1.width() / 2, obj2Radius = obj2.width() / 2;
        // 因为恒星外围的虚幻部分导致恒星的实际大小小于设定的半径，故做出18px的修正
        var radiusSum = obj1Radius + obj2Radius - offset;
        var centerXDiff = obj1Center.x - obj2Center.x;
        var centerYDiff = obj1Center.y - obj2Center.y;

        return Math.pow(centerXDiff, 2) + Math.pow(centerYDiff, 2) <= Math.pow(radiusSum, 2);
    }

    function getPos(obj) {

        var pos = obj.position(), r = obj.width() / 2;

        return {
            x: pos.left + r,
            y: pos.top + r
        }
    }
});