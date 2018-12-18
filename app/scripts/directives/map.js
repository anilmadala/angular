angular.module('ratefastApp')
.directive('gtMap', function (StatesList) {

    return {
        restrict: 'EAC',
        scope: {
            statesActive: '='
        },
        require: '^ngModel',
        link: function (scope, element, attrs) {
            var chart = null;
            var colorData = new Object();
            var stateData;
            var query = {
                status: 'active'
            }

            scope.states = StatesList.query(query, function (states) {
                scope.states = states;

                for (var i = 0; i < scope.states.length; i++) {
                    colorData[scope.states[i].state] = scope.states[i].color;
                }

                if (!chart) {

                    $(element).width('auto')
                    $(element).height(400)
                    chart = $(element).vectorMap({
                        map: 'us_aea_en',
                        onRegionClick: function (element, code, region) {
                            
                            if (code in colorData) {
                                var map = chart.vectorMap('get', 'mapObject');
                                scope.$parent.selectedState = { 'state': map.getRegionName(code), 'statecode': code, 'amaGuide': '4' };
                                scope.$apply();
                            }
                            else {
                                alert('Coming soon!');
                            }
                        },
                        series: {
                            regions: [{
                                //values: scope.datamap,
                                //scale: ['#000000', '#CDDEFA'],
                                attribute: 'fill'
                            }],

                        }
                    })
                    chart.vectorMap('get', 'mapObject').series.regions[0].setValues(colorData);
                } else {
                    chart.vectorMap('get', 'mapObject').series.regions[0].setValues(colorData)
                    chart.vectorMap('get', 'mapObject').series.regions[0].setNormalizeFunction('polynomial')
                    chart.vectorMap('get', 'mapObject').series.regions[0].setScale(['#C8EEFF', '#0071A4'])
                    //console.log(chart.vectorMap('get', 'mapObject'))
                }

            });

        }
    };
});