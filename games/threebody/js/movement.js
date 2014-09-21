/**
 * 位置移动相关的方法
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-17 19:04
 */


define(function(require, exports, module) {

    var event = require('./event');
    var collision = require('./collision');

    var config = require('./config'), width = config.width, height = config.height;
    var stars = config.stars,
        planet = config.planet, planetR = planet.radius;

    var $planet = $('#' + planet.id);
    var cons = require('./constants');
    var utils = require('./utils');

    /**
     * 限定行星在一个固定的横向区域运动
     */
    function getFixX(x, gap) {

        gap = gap || 0;

        if (x < planetR + gap) {
            x = planetR + gap;
        } else if (x > width - gap - planetR) {
            x = width - gap - planetR;
        }

        return x;
    }

    /**
     * 限定行星在一个固定的纵向区域运动
     */
    function getFixY(y, gap) {

        gap = gap || 0;

        if (y < planetR + gap) {
            y = planetR + gap;
        } else if (y > height - gap - planetR) {
            y = height - gap - planetR;
        }

        return y;
    }

    function setPos(obj, x, y, omitShadow) {
        var r = obj.width() / 2, origPos = getPos(obj);
        var id, $shadow;
//omitShadow = true;
        if (!omitShadow) {
            id = 'shadow' + utils.guid();

            $shadow = $('<div class="shadow"></div>');

            $shadow.css({
                width: r / 2.5,
                height: r / 2.5,
                top: origPos.y - r / 5,
                left: origPos.x - r / 5
            }).attr('id', id).appendTo($('#container'));

            setTimeout(function() {
                $('#' + id).animate({
                    opacity: 0,
                    width: 0
                }, {
                    complete: function() {
                        $('#' + id).remove();
                    }
                });
            }, 1000);
        }


        obj.css({
            top: y - r,
            left: x - r
        })

    }

    function getPos(obj) {

        var pos = obj.position(), r = obj.width() / 2;

        return {
            x: pos.left + r,
            y: pos.top + r
        }
    }

    exports.setPos = setPos;

    exports.getPos = getPos;

    exports.setPlanetPos = function(x, y) {

        setPos($planet, x, y);

    };

    exports.getPlanetPos = function() {
        var pos = $planet.position();
        return {
            x: pos.left + planetR,
            y: pos.top + planetR
        };
    };

    /**
     * 圆周运动
     *
     * @param obj
     * @param centerX
     * @param centerY
     * @param radius
     * @param options
     */
    exports.circular = function(obj, centerX, centerY, radius, options) {

        var angle, x, y, r = radius, reverse, deltaAngle, stop = false;

        options = options || {};
        reverse = options.reverse || false;
        angle = options.initAngle || 0;
        deltaAngle = options.deltaAngle || 0.01;

        function always() {

            if (stop) {
                return;
            }

            angle += deltaAngle;
            x = centerX + Math.cos(angle) * r;
            y = centerY + (reverse ? -Math.sin(angle) * r : Math.sin(angle) * r);

            setPos(obj, x, y, true);

            setTimeout(always, 17);
        }

        event.on(cons.PAUSE_GAME_STAR, function() {
            stop = true;
        });

        event.on(cons.RESUME_GAME_STAR, function() {
            stop = false;
            always();
        });

        always();
    };

    /**
     * 随机运动，目前可随机直线、弧线
     *
     * @param obj
     * @param initX
     * @param initY
     */
    exports.random = function(obj, initX, initY) {

        var x = initX, y = initY, reverse = false, stop = false;

        function goon() {

            x += Math.random() < 0.5 ? 100 + Math.random() * 100 : -100 - Math.random() * 100;
            y += Math.random() < 0.5 ? 100 + Math.random() * 100 : -100 - Math.random() * 100;

            x = getFixX(x, 150);
            y = getFixY(y, 150);

            reverse = !reverse;
            exports.arc(obj, x, y, {
                deltaAngle: 0.025,
                reverse: reverse
            });
        }

        goon();

        event.on('lineFinished arcFinished', function(e) {

            if (e.type === 'lineFinished') {
                utils.info('lineFinished...');
            } else if (e.type === 'arcFinished') {
                utils.info('arcFinished...');
            }
            setTimeout(goon,  17);
        });

    };


    /**
     * 弧线运动
     *
     * @param obj
     * @param targetX
     * @param targetY
     * @param options
     */
    exports.arc = function(obj, targetX, targetY, options) {

        options = options || {};

        var objPos = getPos(obj), objX = objPos.x, objY = objPos.y;
        var centerX = (objX + targetX) / 2, centerY = (objY + targetY) / 2;
        var r = Math.sqrt(Math.pow(objX - centerX, 2) + Math.pow(objY - centerY, 2));

        var reverse = options.reverse || false;
        var deltaAngle = options.deltaAngle || 0.01;

        var initAngle = calInitAngle(objX, objY, centerX, centerY), angle = initAngle;
        var path = [], popPoint, stop = false;

        utils.debug('from: x ->' + objX + ', objY ->' + objY);
        utils.debug('to: x -> ' + targetX + ', y -> ' + targetY);
        utils.debug('width radius -> ' + r);
        utils.debug('');

        var totalAngle = Math.PI * 2;

        if (reverse) {
            while (angle > initAngle - totalAngle) {

                angle -= deltaAngle;
                x = centerX + Math.cos(angle) * r;
                y = centerY + Math.sin(angle) * r;

                path.push([x, y]);
            }
        } else {
            while (angle < initAngle + totalAngle) {

                angle += deltaAngle;
                x = centerX + Math.cos(angle) * r;
                y = centerY + Math.sin(angle) * r;

                path.push([x, y]);
            }
        }


        function step() {

            if (collision.checkCollision()) {
                collision.doCollision();
                return;
            }

            if (stop) {
                return;
            }

            if ((popPoint = path.shift()) !== undefined) {
                setPos(obj, popPoint[0], popPoint[1]);

                setTimeout(step, 17);
            } else {

                event.trigger('arcFinished');
            }

        }

        step();

        event.off(cons.PAUSE_GAME_PLANET);
        event.on(cons.PAUSE_GAME_PLANET, function() {
            utils.info('pause game...');
            stop = true;
        });

        event.off(cons.RESUME_GAME_PLANET);
        event.on(cons.RESUME_GAME_PLANET, function() {
            utils.info('resume game...');
            stop = false;
            step();
        });

        event.off(cons.STOP_PLANET_ARC);
        event.on(cons.STOP_PLANET_ARC, function(e, star) {

            utils.info('stop planet arc...');
            // 停止行星的直线运动
            stop = true;

            // 获取到相关数据，用来调整行星位置后，再次随机运动
            var $star = $(star),
                starPos = getPos($star), starX = starPos.x, starY = starPos.y,
                planetPos = exports.getPlanetPos(), planetX = planetPos.x, planetY = planetPos.y,
                factor = Math.abs((starY - planetY) / (starX - planetX)),
                offsetX = 50, offsetY = 50 * factor > 50 ? 50 : 50 * factor;

            setTimeout(function() {

                exports.line($planet, starX > planetX ? planetX + offsetX : planetX - offsetX, starY > planetY ? planetY + offsetY : planetY - offsetY);
//                exports.line($planet, starX > planetX ? planetX + offsetX : planetX - offsetX, starY > planetY ? planetY + offsetX : planetY - offsetX);
            }, 17);

//            event.trigger('arcFinished');

        });

    };

    // 计算运动开始的初始角度
    function calInitAngle(objX, objY, centerX, centerY) {

        var ret, angle = Math.atan(Math.abs(objY - centerY) / Math.abs(objX - centerX));

        // 第一象限
        if (objX > centerX && objY < centerY) {
            ret = 2 * Math.PI - angle;
        }
        // 第二象限
        else if (objX < centerX && objY < centerY) {
            ret = Math.PI + angle;
        }
        // 第三象限
        else if (objX < centerX && objY > centerY) {
            ret = Math.PI - angle;
        }
        // 第四象限
        else if (objX > centerX && objY > centerY) {
            ret = angle;
        } else {
            console.error('calInitAngle error!');
        }

        return ret;
    }

    /**
     * 直线运动
     *
     * @param obj
     * @param targetX
     * @param targetY
     */
    exports.line = function(obj, targetX, targetY) {

        var pos = exports.getPlanetPos(), x = pos.x, y = pos.y;
        var factor = (targetY - y) / (targetX - x);
        var path = [], popPoint;
        var stop = false;

        utils.debug('from: x ->' + x + ', y ->' + y);
        utils.debug('to: x -> ' + targetX + ', y -> ' + targetY);
        utils.debug('factor: ', factor);
        utils.debug('');

        if (x < targetX) {
            while (x + 2 < targetX) {
                x += 2;
                y += 2 * factor;
                path.push([x, y]);
            }
        } else if (x > targetX) {
            while (x - 2 > targetX) {
                x -= 2;
                y -= 2 * factor;
                path.push([x, y]);
            }
        }

        function step() {

            if (collision.checkCollision()) {
                collision.doCollision();
                return;
            }

            if (stop) {
                return;
            }

            if ((popPoint = path.shift()) !== undefined) {
                setPos(obj, popPoint[0], popPoint[1]);

                setTimeout(step, 17);
            } else {

                event.trigger('lineFinished');
            }

        }

        step();

        event.off(cons.PAUSE_GAME_PLANET);
        event.on(cons.PAUSE_GAME_PLANET, function() {
            utils.info('pause game...');
            stop = true;
        });

        event.off(cons.RESUME_GAME_PLANET);
        event.on(cons.RESUME_GAME_PLANET, function() {
            utils.info('resume game...');
            stop = false;
            step();
        });

        event.off(cons.STOP_PLANET_LINE);
        event.on(cons.STOP_PLANET_LINE, function(e, star) {

            utils.info('stop planet line...');
            // 停止行星的直线运动
            stop = true;

        });

    };

});