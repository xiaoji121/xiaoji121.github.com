/**
 * Created by dongming on 14-9-19.
 */

/**
 * Created by dongming on 14-9-19.
 * 计时器
 */

define(function(require, exports, module) {

    var PopulationStrategy = require('./ps');
    var Timer = require('./timer');

    var $population = $('#population');
    var $star_age = $('#star_age');
    var $era = $('#era');
    var $population_rate = $('#population_rate');
    var $is_disaster = $('#is_disaster');
    var $disaster_duration = $('#disaster_duration');

    Timer.start();

    (function run() {
        setTimeout(function() {
            $population.text(PopulationStrategy.getPopulation());
            console.log(PopulationStrategy.getPopulation());
            $star_age.text(PopulationStrategy.getStarAge());
            $era.text(PopulationStrategy.getCurrentAgeName()[0]);

            var disaster = PopulationStrategy.whichDisasterHappend();
            $population_rate.text(PopulationStrategy.getPopulationGrowthRate());

            $is_disaster.text('');
            $is_disaster.text(disaster[0]);
            $disaster_duration.text('');
            $disaster_duration.text(disaster[1]);
            PopulationStrategy.setPopulation();

            run();
        }, 1000);
    })();

    console.log('祝小伙伴儿们马到成功！');

});
