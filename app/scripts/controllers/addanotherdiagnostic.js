angular.module('ratefastApp')
    .controller('XrayCervicalAddAnotherCtrl', function ($scope, $rootScope, $sessionStorage) {

        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };

        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('XrayThoracicAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }


        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayLumbarAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }


        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayShoulderLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayElbowLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }


        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('XrayWristLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('XrayThumbLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.dateOptions = {
                changeMonth: true,
                changeYear: true,
                dateFormat: "mm/dd/yy",
                showAnim: "clip",
                maxDate: new Date(),
                minDate: "01/01/1910"
            };
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayFingerAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayPelvisHipLeftRightAddAnotherCtrl', function ($scope, $rootScope, $modal) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }
        if (!$scope.popuptext) {
            $scope.popuptext = '';
        }
        $scope.setpopup = function (popupText) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/popupcontent.html',
                controller: 'popupButtonXrayCtrlclose',
                resolve: {
                    text: function () {
                        return popupText;
                    }
                }
            });
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('XrayKneeLeftRightAddAnotherCtrl', function ($scope, $rootScope, $modal) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.setpopup = function (popupText) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/popupcontent.html',
                controller: 'popupButtonXrayCtrlclose',
                resolve: {
                    text: function () {
                        return popupText;
                    }
                }
            });
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('XrayAnkleFootLeftRightAddAnotherCtrl', function ($scope, $rootScope, $modal) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.setpopup = function (popupText) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/popupcontent.html',
                controller: 'popupButtonXrayCtrlclose',
                resolve: {
                    text: function () {
                        return popupText;
                    }
                }
            });
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

        /*
        $scope.hideAll = function (values) {
            angular.forEach(values, function (value, key) {
                if (value) {
                    eval(value);
                }
            });
        }
        */

    })
    .controller('XrayToeLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriCervicalAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }


        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('MriThoracicAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
           
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('MriLumbarAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
           
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('MriShoulderAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
           
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('MriElbowLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriWristLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriFingerAllAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriPelvisHipLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriKneeLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriAnkleFootLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('MriToeLeftRightAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {

            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }
    })
    .controller('CtscanCervicalAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }


        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('CtscanThoracicAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('CtscanLumbarAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('CtscanShoulderAddAnotherCtrl', function ($scope, $rootScope) {
        debugger;
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }

        debugger;
        $scope.addControl = function () {
            debugger;
            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {
            debugger;
            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, modelvalue, mod, isNormal) {
            debugger;
            if (modelvalue == false && !isNormal) {
                if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                    angular.forEach(values, function (value, key) {
                        if (value) {
                            eval(value);
                        }
                    });
                } else {
                    eval(mod + '= true');
                }
            } else if (modelvalue == true && isNormal == true) {
                // is first time
                for (var i = 0; i < values.length; i++) {
                    debugger;
                    var ck = values[i].split('=')[0].trim();
                    var ck1 = eval(ck);
                    if (eval(values[i].split('=')[0].trim())) {
                        if (confirm('Unselecting this item will result in losing selections below it. Do you want to proceed?')) {
                            angular.forEach(values, function (value, key) {
                                debugger;
                                if (value) {
                                    eval(value);
                                }
                            });
                        } else {
                            eval(mod + '= false');
                        }
                        break;
                    }
                }

            } else {
                angular.forEach(values, function (value, key) {
                    if (value) {
                        eval(value);
                    }
                });
            }
        }

    })
    .controller('SkinPathologyAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }


        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            //var arrlength = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].length;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);

            }
        }

        $scope.hideAll = function (values, confirm) {

            angular.forEach(values, function (value, key) {
                if (value) {
                    eval(value);
                }
            });
        }

    })
    .controller('SkinOfficeBasedAddAnotherCtrl', function ($scope, $rootScope) {
        $scope.dateOptions = {
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/yy",
            showAnim: "clip",
            maxDate: new Date(),
            minDate: "01/01/1910"
        };
        if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
            $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
        } else {
            $scope.todos = new Array();
        }


        $scope.addControl = function () {

            $scope.todos.push({});
            $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid] = $scope.todos;
        }

        $scope.clearbodypart = function (index, length) {

            var confi = confirm("If you reset this row, you will lose all selections you have made for this body part.");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid][length - index] = {};
            }
        }
        $scope.deletebodypart = function (index, length) {
            debugger;
            var confi = confirm("If you delete this test, then you will lose all selections you have made. Proceed?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }

        $scope.hideAll = function (values, confirm) {

            angular.forEach(values, function (value, key) {
                if (value) {
                    eval(value);
                }
            });
        }

    });