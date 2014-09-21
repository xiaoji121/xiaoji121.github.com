/**
 * 用于处理游戏中的事件监听
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-18 16:35
 */

define(function(require, exports, module) {

    var cons = require('./constants');
    var event = require('./event');
    var supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
    var onEvent = supportsTouch ? 'touchend' : 'click';
    var config = require('./config'), stars = config.stars;
    var ps = require('./ps');
    var Timer = require('./timer'), intervalId, intervalId2;
    var decription = require('./description');
    var abilityDetail = decription.abilityDetail;

    $('body').on(onEvent, '.star', function(e) {
        console.log($(this).attr('id') + ' clicked');

        event.trigger(cons.STOP_PLANET, $(this));
    });

    event.on(cons.START_GAME, function() {
       $('#music')[0].play();
    });

    $('#ability').click(function() {

        event.trigger(cons.PAUSE_GAME);
        Timer.pause();
        $('#ability-p').show();

        $('#A em').text(ps.getColdResistance() + 1);
        $('#B em').text(ps.getHeatResistance() + 1);
        $('#C em').text(ps.getOrbitModify() + 1);
        $('#D em').text(ps.getPoliticalCulture() + 1);
        $('#E em').text(ps.getScienceTechnology() + 1);
        $('#F em').text(ps.getResourceEconomy() + 1);

        if (ps.getStarAge() > 1200) {
            $('#globe').css({
                backgroundImage: 'http://threebody.com/threebody/image/globe1.gif'
            })
        }
    });

    $('#ability-l').on('click', '.ability-item', function() {

        var abilityName = $(this).attr('id');

        $('#ability-name').text(abilityDetail[abilityName].name);
        $('#ability-d').text(abilityDetail[abilityName].description);
        $('#ability-cnt').text(abilityDetail[abilityName].cntDesc);

        $(this).siblings('.ability-item').removeClass('pressing');
        $(this).addClass('pressing');
    });

    $('#more').click(function() {
        event.trigger(cons.PAUSE_GAME);
        Timer.pause();
        $('#ability-p').show();

    });

    $('.close').click(function() {
        event.trigger(cons.RESUME_GAME);
        Timer.start();
        $(this).closest('.popup').hide();

    });

    $('#upgrade').mousedown(function() {

        $(this).addClass('pressing');

        var abilityName = $('#ability-l .pressing').attr('id');

        if (ps.getStarDustNum() >= 5) {
            switch (abilityName) {
                case 'A':
                    ps.setColdResistance();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
                case 'B':
                    ps.setHeatResistance();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
                case 'C':
                    ps.setOrbitModify();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
                case 'D':
                    ps.setPoliticalCulture();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
                case 'E':
                    ps.setScienceTechnology();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
                case 'F':
                    ps.setResourceEconomy();
                    ps.setStarDustNum(-5);
                    $('#count').text(ps.getStarDustNum());
                    break;
            }

            $('#A em').text(ps.getColdResistance() + 1);
            $('#B em').text(ps.getHeatResistance() + 1);
            $('#C em').text(ps.getOrbitModify() + 1);
            $('#D em').text(ps.getPoliticalCulture() + 1);
            $('#E em').text(ps.getScienceTechnology() + 1);
            $('#F em').text(ps.getResourceEconomy() + 1);
        }

    }).mouseup(function() {
        $(this).removeClass('pressing');
    });

    Timer.start();

    intervalId = setInterval(function() {

        record();

    }, 1000);

    event.on(cons.PAUSE_GAME, function(){
        clearInterval(intervalId);
        clearInterval(intervalId2);
    });

    event.on(cons.RESUME_GAME, function(){
        intervalId = setInterval(function() {

            record();

        }, 1000);

        intervalId2 = setInterval(function() {
            var disasterObj = ps.whichDisasterHappend();
            if (disasterObj[0]) {
                $('#eventMsg').text('事件：' + disasterObj[0]);
            }
        })
    });

    intervalId2 = setInterval(function() {

        var disasterObj = ps.whichDisasterHappend();
        if (disasterObj[0]) {
            $('#eventMsg').text('事件：' + disasterObj[0]);
        }
    }, 1000);

    function record() {
        // 文明点数
        $('#count').text(ps.getStarDustNum());
        // 文明人口
        ps.setPopulation();
        $('#population').text(ps.getPopulation());
        // 文明寿命
        $('#age').text(ps.getStarAge());
        // 文明阶段
        $('#era').text(ps.getCurrentAgeName()[0]);
    }

});
