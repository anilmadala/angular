(function () {
    var a,b, config;

    a = angular.module('validator.rules', ['validator']);
    config = function ($validatorProvider) {
        $validatorProvider.register('required', {
            invoke: 'watch',
            validator: /^.+$/,
            error: 'This field is required.'
        });
        $validatorProvider.register('validatezipcode', {
            invoke: 'watch',
            validator: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
            error: 'This field is invalid.'
        });
        $validatorProvider.register('number', {
            invoke: 'watch',
            validator: /^[-+]?[0-9]*[\.]?[0-9]*$/,
            error: 'This field should be the number.'
        });
        $validatorProvider.register('email', {
            invoke: 'blur',
            validator: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            error: 'This field should be the email.'
        });
        $validatorProvider.register('minlength', {
            invoke: 'blur',
            validator: /^[\s\S]{0,8}$/,
            error: 'This field must have minlength of 8 characters.'
        });
        $validatorProvider.register('onwatch', {
            invoke: 'watch',
            validator: function (value, scope, element, attrs, $injector) {
                var valCondition = scope.watchvalidatorcondition;
                var blurCondition = scope.blurvalidatorcondition;
                var valSet = scope.watchvalidatorset;
                var uniqueid = scope.uniqueid;
                try {
                    if (eval(valCondition)) {
                        var testing = eval(valCondition);
                        //eval(valSet);
                    }
                    if (blurCondition == "zipcode") {
                        if (value.length > 5) {
                            var zipcodeFirst = value.slice(0, 5);
                            var zipcodeLast = value.slice(5, 9);
                            var alreadyExist = value.split('-');
                            if (!alreadyExist[1] && alreadyExist[1] != '') {
                                if (value.length > 5) {
                                    var zipcodeArray = zipcodeFirst + '-' + zipcodeLast;
                                    var execute = value + "='" + zipcodeArray + "'";
                                    scope.report.data['bginfo'][uniqueid] = zipcodeArray;
                                    scope.$parent.default[uniqueid] = zipcodeArray;
                                }
                            }
                            else {
                                scope.report.data['bginfo'][uniqueid] = value;
                                scope.$parent.default[uniqueid] = value;
                            }
                        }
                    }

                } catch (error) {

                }
                return true;
            },
            error: 'This field should be the url.'
        });
        $validatorProvider.register('onblur', {
            invoke: 'blur',
            validator: function (value, scope, element, attrs, $injector) {
                var valCondition = scope.blurvalidatorcondition;
                var uniqueid = scope.uniqueid;
                try {
                    
                } catch (error) {

                }
                return true;
            },
            error: 'This field should be the url.'
        });
        $validatorProvider.register('onchange', {
            invoke: 'watch',
            validator: function (value, scope, element, attrs, $injector) {
                var valCondition = scope.validatorcondition;
                try {
                    if (valCondition) {
                        var aa = eval(valCondition);
                    }
                } catch (error) {
                    
                }
                return true;
            },
            error: 'This field should be the url.'
        });
        return $validatorProvider.register('url', {
            invoke: 'blur',
            validator: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
            error: 'This field should be the url.'
        });

    };

    config.$inject = ['$validatorProvider'];

    a.config(config);

}).call(this);
