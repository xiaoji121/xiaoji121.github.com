/**
 * 星球相关属性配置
 *
 * @author lihao.ylh@alibaba-inc.com
 * @date 2014-09-16 16:10
 */

define(function(require, exports, module) {
    return {
        width: 960,
        height: 540,
        stars: [{
            id: 'star1',
            radius: 40,
            x: 200,
            y: 200
        }, {
            id: 'star1-back',
            radius: 40,
            x: 200,
            y: 200
        }, {
            id: 'star2',
            radius: 30,
            x: 800,
            y: 260
        }, {
            id: 'star2-back',
            radius: 30,
            x: 800,
            y: 260
        }, {
            id: 'star3',
            radius: 34,
            x: 450,
            y: 200
        }, {
            id: 'star3-back',
            radius: 34,
            x: 450,
            y: 200
        }],
        planet: {
            id: 'cutie',
            radius: 20,
            x: 480,
            y: 270
        }
    };
});
