'use strict';

module.exports = function($http, $window) {
    function getFoodBase() {
        return $http.get('./JSONdata/food.json').then((data) => {
            var base = {}, keys = [];
            data.data.forEach((obj) => {
                for (let key in obj) {
                    if (key === 'name') continue;
                    base[key] = obj[key];
                }
            });
            Object.keys(base).forEach((key) => keys.push({foodName: key}));
            base.keys = keys;
            return base;
        })
    }

    function getFoodObjects() {
        return $http.get('./JSONdata/food.json')
    }

    function getDayTimesData() {
        return $http.get('./JSONdata/day-times-data.json')
    }

    function getLimitsData(diet, phase) {
        let path = './JSONdata/limits-data/' + diet + '-phase' + phase + '.json';
        return $http.get(path);
    }

    if ($window.localStorage.saveData && !confirm('Загрузить сохранения?')) {
        if (confirm('Удалить имеющиеся сохранения?')) {
            $window.localStorage.removeItem('saveData');
            $window.localStorage.removeItem('savedLimits');
        }
    }

    return {
        getFoodBase: getFoodBase,
        getFoodObjects: getFoodObjects,
        getDayTimesData: getDayTimesData,
        getLimitsData: getLimitsData
    };
};