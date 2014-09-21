/**
 * Created by dongming on 14-9-19.
 * population strategy
 * 人口数值策略
 */

define(function(require, exports, module) {

    // 人口初始值 - 100万
    var population = 1000000;

    var GROWTH_RATE = 0.02;     // 定值

    // 人口增长率初始值 - 0.002
    var growth_rate = 0.02;
    // 星际尘埃初始值 - 0
    var star_dust = 0;
    // 发生灾难的概率
    var disaster_rate = 0.15;

    /* 星球事件初始概率 */
    var p_war = 0.3;        // 战争
    var p_plague = 0.2;     // 瘟疫
    var p_disaster = 0.4;   // 自然灾害
    var p_lack = 0.1;       // 资源匮乏

    /* 可提升属性数值 */
    var cold_resistance = 0;        // 行星抗寒 -> alias A
    var heat_resistance = 0;        // 行星抗热 -> alias B
    var orbit_modify = 0;           // 轨道变更 -> alias C
    var political_culture = 0;      // 政治文化 -> alias D
    var science_technology = 0;     // 科学技术 -> alias E
    var resource_economy = 0;       // 资源经济 -> alias F

    var Probability = require('./probability');
    var Description = require('./description');

    var wating = false;
    var watingTimer = null;

    exports.resetGrowthRate = function() {
        growth_rate = GROWTH_RATE;
    };

    /**
     * 设置尘埃数（文明点数）
     * @param val
     */
    exports.setStarDustNum = function(val) {
        val ? star_dust += val : star_dust++;
    };

    /**
     * 获取尘埃数（文明点数）
     * @returns {number}
     */
    exports.getStarDustNum = function() {
        return star_dust;
    };

    exports.setColdResistance = function() {
        cold_resistance++;
    };

    exports.getColdResistance = function() {
        return cold_resistance;
    };

    exports.setHeatResistance = function() {
        heat_resistance++;
    };

    exports.getHeatResistance = function() {
        return heat_resistance;
    };

    exports.setOrbitModify = function() {
        orbit_modify++;
    };

    exports.getOrbitModify = function() {
        return orbit_modify;
    };

    exports.setPoliticalCulture = function() {
        political_culture++;
    };

    exports.getPoliticalCulture = function() {
        return political_culture;
    };

    exports.setScienceTechnology = function() {
        science_technology++;
    };

    exports.getScienceTechnology = function() {
        return science_technology;
    };

    exports.setResourceEconomy = function() {
        resource_economy++;
    };

    exports.getResourceEconomy = function() {
        return resource_economy;
    };

    // 获取各事件概率

    exports.getWarProbability = function() {
        return p_war;
    };

    exports.getPlagueProbability = function() {
        return p_plague;
    };

    exports.getDisasterProbability = function() {
        return p_disaster;
    };

    exports.getLackProbability = function() {
        return p_lack;
    };

    /**
     * 获取星球寿命(历史年代)
     * 游戏时间 * 10年
     * @returns {number}
     */
    exports.getStarAge = function() {
        var Timer = require('./timer');
        return 10 * (Timer.getDuration());
    };

    /**
     * 根据传入的提升属性名称，降低行星各个事件的发生概率
     * @param attr
     */
    exports.changeProbability = function(attr) {
        switch (attr) {
            // 增加了抗寒能力
            case 'A':
                setColdResistanceEffect();
                break;
            // 增加了抗热能力
            case 'B':
                setHeatResistanceEffect();
                break;
            // 轨道变更
            case 'C':
                setOrbitModifyEffect();
                break;
            // 政治文化
            case 'D':
                setPoliticalCultureEffect();
                break;
            // 科学技术
            case 'E':
                setScienceTechnologyEffect();
                break;
            // 资源经济
            case 'F':
                setResourceEconomyEffect();
                break;
            default :
                break;
        }
    };

    /**
     * 根据传入的提升属性名称，消耗尘埃数
     * @param attr
     */
    exports.consumeStarDust = function(attr) {
        switch (attr) {
            // 增加了抗寒能力
            case 'A':
                star_dust -= 2;
                break;
            // 增加了抗热能力
            case 'B':
                star_dust -= 3;
                break;
            // 轨道变更
            case 'C':
                star_dust -= 5;
                break;
            // 政治文化
            case 'D':
                star_dust -= 7;
                break;
            // 科学技术
            case 'E':
                star_dust -= 11;
                break;
            // 资源经济
            case 'F':
                star_dust -= 13;
                break;
            default :
                break;
        }
    };

    /**
     * 设置行星抗寒能力对行星各个事件的发生概率的影响（降低概率）
     */
    function setColdResistanceEffect() {
        // 降低自然灾害0.03（强关联）
        // 降低自然匮乏0.01（弱关联）
        p_disaster -= 0.03;
        p_lack -= 0.01;
    }

    /**
     * 设置行星抗热能力对行星各个事件的发生概率的影响（降低概率）
     */
    function setHeatResistanceEffect() {
        // 和行星抗寒能力对行星各事件发生概率的影响一致
        setColdResistanceEffect();
    }

    /**
     * 设置行星轨道变更对行星各个事件的发生概率的影响（降低概率）
     */
    function setOrbitModifyEffect() {
        // 无任何影响（玩家提升轨道变更数值就是在坑爹啊！）
        return;
    }

    /**
     * 设置行星政治文化数值对行星各个事件的发生概率的影响（降低概率）
     */
    function setPoliticalCultureEffect() {
        // 降低战争概率0.03（强关联）
        // 降低瘟疫概率0.02（中关联）
        // 降低自然灾害0.01（弱关联）
        // 增加自然匮乏random(0.001, 0.01)（负关联）
        p_war -= 0.03;
        p_plague -= 0.02;
        p_disaster -= 0.01;
        p_lack += Probability.getFloatRandom(0.001, 0.01);
    }

    /**
     * 设置行星科学技术数值对行星各个事件的发生概率的影响（降低概率）
     */
    function setScienceTechnologyEffect() {
        // 增加战争概率random(0.001, 0.01)（负关联）
        // 降低战争概率0.02（中关联）
        // 降低瘟疫概率0.03（强关联）
        // 降低自然灾害0.01（弱关联）
        p_war += Probability.getFloatRandom(0.001, 0.01);
        p_war -= 0.02;
        p_plague -= 0.03;
        p_disaster -= 0.01;
    }

    /**
     * 设置行星资源经济数值对行星各个事件的发生概率的影响（降低概率）
     */
    function setResourceEconomyEffect() {
        // 降低战争概率0.01（弱关联）
        // 降低瘟疫概率0.01（弱关联）
        // 增加自然灾害random(0.001, 0.01)（负关联）
        // 降低自然匮乏0.03（强关联）
        p_war -= 0.01;
        p_plague -= 0.01;
        p_disaster += Probability.getFloatRandom(0.001, 0.01);
        p_lack -= 0.03;
    }

    exports.triggerWar = function() {
        warEffects();
    };

    function warEffects() {
        // 人口增长率降低random(0.003, 0.03)
        growth_rate -= Probability.getFloatRandom(0.001, 0.002);

    }

    exports.triggerPlague = function() {
        plagueEffects();
    };

    function plagueEffects() {
        // 人口增长率降低random(0.03, 0.05)
        growth_rate -= Probability.getFloatRandom(0.003, 0.005);
    }

    exports.triggerDisaster = function() {
        disasterEffects();
    };

    function disasterEffects() {
        // 人口增长率降低random(0.01, 0.03)
        growth_rate -= Probability.getFloatRandom(0.001, 0.003);
    }

    exports.triggerLack = function() {
        lackEffects();
    };

    function lackEffects() {
        // 人口增长率降低random(0.01, 0.05)
        growth_rate -= Probability.getFloatRandom(0.001, 0.005);
    }

    /**
     * 根据evnetId触发相应事件
     * @param eventId
     */
    exports.triggerEvent = function(eventId) {
        switch(eventId) {
            case 0:
                exports.triggerWar();
                break;
            case 1:
                exports.triggerPlague();
                break;
            case 2:
                exports.triggerDisaster();
                break;
            case 3:
                exports.triggerLack();
                break;
            default :
                break;
        }
    };

    /**
     * 获取人口增长率
     * @returns {number}
     */
    exports.getPopulationGrowthRate = function() {
        return growth_rate;
    };

    /**
     * 通过传入的事件名称获取事件持续的时间
     * @param event {0|1|2|3}
     * @returns {number}
     */
    exports.getEventDuration = function(event) {
        var eventName = ['war', 'plague', 'disaster', 'lack'];
        var duration = 0;

        switch (eventName[event]) {
            case 'war':
                duration = exports.getWarDuration();
                break;
            case 'plague':
                duration = exports.getPlagueDuration();
                break;
            case 'disaster':
                duration = exports.getDisasterDuration();
                break;
            case 'lack':
                duration = exports.getLackDuration();
                break;
            default :
                break;
        }

        return duration;
    };

    exports.getWarDuration = function() {
        var info = {
            "shiqi": 70,
            "qingtong": 60,
            "heitie": 50,
            "huoqi": 40,
            "gongye": 30,
            "xinxi": 20,
            "taikong": 10
        };

        var ageName = exports.getCurrentAgeName(exports.getStarAge())[1];

        return info[ageName];
    };

    exports.getPlagueDuration = function() {
        var info = {
            "shiqi": Math.pow(2, 2),
            "qingtong": Math.pow(3, 2),
            "heitie": Math.pow(5, 2),
            "huoqi": Math.pow(11, 2),
            "gongye": Math.pow(7, 2),
            "xinxi": Math.pow(5, 2),
            "taikong": Math.pow(3, 2)
        };

        var ageName = exports.getCurrentAgeName(exports.getStarAge())[1];

        return info[ageName];
    };

    exports.getDisasterDuration = function() {
        var randomNum = Probability.getIntRandom(1, 30);

        return randomNum;
    };

    exports.getLackDuration = function() {
        var randomNum = Probability.getIntRandom(1, 30);

        return randomNum;
    };

    /**
     * 获取当前时代名称
     * @param starAge
     */
    exports.getCurrentAgeName = function(starAge) {
        var age = exports.getStarAge();
        var ageInfo = Description.ageInfo;
        var ageName = '';

        if (age >= 0 && age < ageInfo.qingtong.age) {
            ageName = 'shiqi';
        } else if (age >= ageInfo.qingtong.age && age < ageInfo.heitie.age) {
            ageName = 'qingtong';
        } else if (age >= ageInfo.heitie.age && age < ageInfo.huoqi.age) {
            ageName = 'heitie';
        } else if (age >= ageInfo.huoqi.age && age < ageInfo.gongye.age) {
            ageName = 'huoqi';
        } else if (age >= ageInfo.gongye.age && age < ageInfo.xinxi.age) {
            ageName = 'gongye';
        } else if (age >= ageInfo.xinxi.age && age < ageInfo.taikong.age) {
            ageName = 'xinxi';
        } else if (age >= ageInfo.taikong.age) {
            ageName = 'taikong';
        }

        return [ageInfo[ageName]['name'], ageName];
    };

    exports.setPopulation = function() {
        population = Math.round(population + population * growth_rate);
    };

    exports.getPopulation = function() {
        return population;
    };

    exports.isDisasterHappend = function() {
        return Probability.isHappend(disaster_rate);
    };

    exports.whichDisasterHappend = function() {

        if (wating) {
            return ['', 0];
        }

        if (Probability.isHappend(disaster_rate)) {
            // 如果发生了灾难，发生的是哪一种？
            var war = exports.getWarProbability();                // 战争
            var plague = exports.getPlagueProbability();          // 瘟疫
            var disaster = exports.getDisasterProbability();      // 自然灾害
            var lack = exports.getLackProbability();              // 资源匮乏

            var id = Probability.whichHappend(war, plague, disaster, lack);

            exports.triggerEvent(id);

            var duration = exports.getEventDuration(id);
            var disaster = Description.starEvent[id];

            if (duration) {
                console.log('发生' + disaster + '，持续' + duration + '年');
                wating = true;
                watingDisasterPass(duration);
            }

            return [disaster, duration];
        } else {
            return ['', 0];
        }
    };

    function watingDisasterPass(duration) {
        clearTimeout(watingTimer);

        watingTimer = setTimeout(function() {
            wating = false;
            exports.resetGrowthRate();
        }, (duration / 10) * 1000);
    }



});
