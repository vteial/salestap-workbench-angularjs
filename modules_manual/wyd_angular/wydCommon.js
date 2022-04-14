appDirectives.directive('wydCapitalize', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var transform = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var outputValue = _.capitalize(inputValue);
                if (outputValue !== inputValue) {
                    modelCtrl.$setViewValue(outputValue);
                    modelCtrl.$render();
                }
                return outputValue;
            }
            modelCtrl.$parsers.push(transform);
            transform($parse(attrs.ngModel)(scope));
        }
    };
});

appDirectives.directive('wydUpperCase', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var transform = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var outputValue = inputValue.toUpperCase();
                if (outputValue !== inputValue) {
                    modelCtrl.$setViewValue(outputValue);
                    modelCtrl.$render();
                }
                return outputValue;
            }
            modelCtrl.$parsers.push(transform);
            transform($parse(attrs.ngModel)(scope));
        }
    };
});

appDirectives.directive('wydLowerCase', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var transform = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var outputValue = inputValue.toLowerCase();
                if (outputValue !== inputValue) {
                    modelCtrl.$setViewValue(outputValue);
                    modelCtrl.$render();
                }
                return outputValue;
            }
            modelCtrl.$parsers.push(transform);
            transform($parse(attrs.ngModel)(scope));
        }
    };
});

appDirectives.directive('wydFocusOn', function () {
    return function (scope, elem, attr) {
        return scope.$on('wydFocusOn', function (e, name) {
            if (name === attr.wydFocusOn) {
                return elem[0].focus();
            }
        });
    };
});

function wydFocusService($rootScope, $timeout) {
    return function (name) {
        return $timeout(function () {
            return $rootScope.$broadcast('wydFocusOn', name);
        });
    };
}
appServices.factory('wydFocusService', ['$rootScope', '$timeout', wydFocusService]);

appDirectives.directive('historyBack', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                $window.history.back();
            });
        }
    };
}]);

/*
 <img wyd-holder="holder.js/200x200/text:?">
 <img wyd-holder data-src="holder.js/200x200/text:?">
 */
appDirectives.directive('wydHolder', [
    function () {
        return {
            link: function (scope, element, attrs) {
                if (attrs.holder) {
                    attrs.$set('data-src', attrs.holder);
                }
                Holder.run({images: element[0]});
            }
        };
    }
]);

appDirectives.directive('wydClipboard', function () {
    return {
        restrict: 'A',
        scope: {
            ngclipboardSuccess: '&',
            ngclipboardError: '&'
        },
        link: function (scope, element) {
            var clipboard = new Clipboard(element[0]);

            clipboard.on('success', function (e) {
                scope.ngclipboardSuccess({
                    e: e
                });
            });

            clipboard.on('error', function (e) {
                scope.ngclipboardError({
                    e: e
                });
            });
        }
    };
});

function generalHttpInterceptor($log, $rootScope, $q, $window) {
    return {
        'request': function (config) {
            $rootScope.isProgress = true;
            var val = $rootScope.xUserId || 'null';
            //$log.info('xUserId = ' + val);
            config.headers['X-Token'] = val;
            // val = $rootScope.apiKey || 'null';
            // $log.info('apiKey = ' + val);
            // config.headers['api_key'] = val;
            return config;
        },

        'requestError': function (rejection) {
            $rootScope.isProgress = false;
            $log.error(rejection);
            return rejection;
        },

        'response': function (response) {
            $rootScope.isProgress = false;
            return response;
        },

        'responseError': function (rejection) {
            $rootScope.isProgress = false;
            $log.error(rejection);
            if (rejection.status === 419) {
                $rootScope.$emit('session:invalid', 'Invalid session...');
            }
            return rejection;
        }
    };
}
appServices.factory('generalHttpInterceptor', generalHttpInterceptor);
