/**
 * 三体文明入口文件
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-16 08:48
 */


define(function(require, exports, module) {

    var config = require('./config');
    var stars = config.stars,
        planet = config.planet, planetR = planet.radius;

    var $planet = $('#' + planet.id);
    var m = require('./movement');

    var cons = require('./constants');
    var event = require('./event');
    var utils = require('./utils');
    var Timer = require('./timer');

    init();

    initEvent();

    function init() {

        var numSmallStar = 20;

        stars.forEach(function(star) {
            var r = star.radius;
            $('#' + star.id).css({
                width: 2 * r,
                height: 2 * r,
                borderRadius: r
            });
        });

        $planet.css({
            width: 2 * planetR,
            height: 2 * planetR,
            top: planet.y - planetR,
            left: planet.x - planetR,
            borderRadius: planetR
        });

        for (var i = 0; i < numSmallStar; i++) {
            utils.createSmallStar();
        }
    }


    function initEvent() {
        require('./listener');

        var paused = false;
        $('body').keydown(function(e) {

            if (e.keyCode === 32) {

                if (paused) {
                    resume();
                    paused = false;
                } else {
                    pause();
                    paused = true;
                }

            }
        });

        $('#start').mouseenter(function() {
            $(this).addClass('pressing');
        }).mouseleave(function() {
            $(this).removeClass('pressing');
        });

        $('#start').click(function() {

            $(this).addClass('pressing');
            $('#home').hide();
            $('#container').animate({
                opacity: 1
            }, {
                duration: 1000
            });

            start();
        });

        $('#restart').mousedown(function() {
            $(this).addClass('pressing');
        }).mouseup(function() {
            $(this).removeClass('pressing');
            window.location.reload();
        });

//        $('#start').click();
    }


    function start() {

        // 触发游戏开始事件，计时器可根据此事件开始计时
        event.trigger(cons.START_GAME);

        m.circular($('#star1'), 280, 250, 200, {
            reverse: true,
            initAngle: 3,
            deltaAngle: 0.01
        });
        m.circular($('#star1-back'), 280, 250, 200, {
            reverse: true,
            initAngle: 3,
            deltaAngle: 0.01
        });
        m.circular($('#star2'), 400, 240, 180, {
            initAngle: 2
        });
        m.circular($('#star2-back'), 400, 240, 180, {
            initAngle: 2
        });
        m.circular($('#star3'), 660, 290, 160, {
            reverse: true,
            initAngle: 1,
            deltaAngle: 0.01,
        });
        m.circular($('#star3-back'), 660, 290, 160, {
            reverse: true,
            initAngle: 1,
            deltaAngle: 0.01,
        });

        m.random($planet, 480, 270);
    }

    function pause() {

        event.trigger(cons.PAUSE_GAME);

        Timer.pause();
    }

    function resume() {

        event.trigger(cons.RESUME_GAME);

        Timer.start();
    }

});

