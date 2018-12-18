'use strict';

angular.module('ratefastApp')
    .controller('AddanotherbiologicalsiblingCtrl', function ($scope, $rootScope) {

        $scope.labelAddanother = $scope.label;
        $scope.tinymceOptions = {
            resize: false,
            menubar: false,
            plugins: '',
            browser_spellcheck: true,
            contextmenu: false,
            toolbar: "bold italic underline"
        };
        if ($scope.report.data[$rootScope.currentsectionId]) {
            if ($scope.report.data[$rootScope.currentsectionId][$scope.uniqueid]) {
                $scope.todos = $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid];
            }
        }
        else {
            $scope.todos = new Array();
        }

        $scope.addTodos = function () {
            if (!$scope.todos) {
                $scope.todos = new Array();
            }
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
            var confi = confirm("Are you sure you want to delete this section?");
            if (confi) {
                $scope.report.data[$rootScope.currentsectionId][$scope.uniqueid].splice(length - index, 1);
            }
        }
        
    });