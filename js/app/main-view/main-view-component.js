'use strict';

const mainViewTemplate = require('./template/main-view.html');

const mainView = {
    controller: function (dataService, limitsService, $window) {
        const empty = {
            empty: true,
            name: '---------',
            portion: '---',
            carbohyd: '---',
            prot: '---',
            fat: '---',
            kall: '---'
        };

        this.base = {};
        this.viewData = {
            limitsData: limitsService.limitsData
        };



        dataService.getFoodBase()
            .then((data) => this.base.foods = data);

        if ($window.localStorage.saveData) {
            let data = JSON.parse($window.localStorage.saveData);
            this.viewData.dayTimes = data.daysData;
            this.viewData.resultFinal = data.resultFinal;
        } else {
            dataService.getDayTimesData()
                .then((data) => this.viewData.dayTimes = data.data);

            this.viewData.resultFinal = {
                carbohyd: 0,
                prot: 0,
                fat: 0,
                kall: 0
            }
        }


        this.compare = function(key) {
            if (!this.viewData.limitsData.limits) return;
            if (this.viewData.limitsData.limits["Итог"][key] < this.viewData.resultFinal[key]) return true;
        };


        this.addFood = function(dayTimeId, food) {
            let collection = this.viewData.dayTimes[dayTimeId].foods;
            if (collection[0].empty) collection.splice(0, 1);

            collection.push(food);
            this.calcResult(dayTimeId, food, true);

            if ($window.localStorage._lastSaveId) $window.localStorage.removeItem('_lastSaveId');
        };

        this.removeFood = function(dayTimeId, food) {
            let collection = this.viewData.dayTimes[dayTimeId].foods;
            let index = collection.indexOf(food);
            collection.splice(index, 1);

            if (collection.length === 0) collection.push(empty);
            this.calcResult(dayTimeId, food, false);
            if ($window.localStorage._lastSaveId) $window.localStorage.removeItem('_lastSaveId');
        };

        this.toggleDayTime = function(id) {
            this.viewData.dayTimes[id].show = !this.viewData.dayTimes[id].show
        };


        this.calcResult = function (dayTimeId, food, bool) {
            let result = this.viewData.dayTimes[dayTimeId].result;
            if (bool) {
                for (let key in result) {
                    result[key] += food[key];
                    this.viewData.resultFinal[key] += food[key];
                }
            } else {
                for (let key in result) {
                    result[key] -= food[key];
                    this.viewData.resultFinal[key] -= food[key];
                }
            }
        }
    },
    template: mainViewTemplate
};

module.exports = mainView;