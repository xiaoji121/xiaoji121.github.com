/**
 * 常量
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-19 15:20
 */


define(function(require, exports, module) {

    return {
        START_GAME: 'gameStarted',

        PAUSE_GAME: 'gamePaused',
        PAUSE_GAME_STAR: 'gamePaused.star',
        PAUSE_GAME_PLANET: 'gamePaused.planet',

        RESUME_GAME: 'gameResumed',
        RESUME_GAME_STAR: 'gameResumed.star',
        RESUME_GAME_PLANET: 'gameResumed.planet',

        STOP_PLANET: 'planetStopped',
        STOP_PLANET_LINE: 'planetStopped.line',
        STOP_PLANET_ARC: 'planetStopped.arc',

        LINE_FINISH: 'lineFinished',
        ARC_FINISH: 'arcFinished'
    }

});