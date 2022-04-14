
appDirectives.directive('inputMaskNumber', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$validators.number = function (modelValue, viewValue) {
                //console.log('mv : ' + modelValue + ' vv : ' +viewValue);
                if (modelCtrl.$isEmpty(modelValue)) {
                    return true;
                }
                if (viewValue.indexOf('_') === -1) {
                    return true;
                }
                return false;
            };
        }
    };
});

appDirectives.directive('inputPhoneNumber', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$validators.number = function (modelValue, viewValue) {
                //console.log('mv : ' + modelValue + ' vv : ' +viewValue);
                if (modelCtrl.$isEmpty(modelValue)) {
                    return true;
                }
                var val = viewValue.replace(new RegExp('_', 'g'), ' ').trim();
                if (val.length > 8) {
                    return true;
                }
                return false;
            };
        }
    };
});

appDirectives.directive('inputMaskDate', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$validators.date = function (modelValue, viewValue) {
                //console.log('mv : ' + modelValue + ' vv : ' +viewValue);
                if (modelCtrl.$isEmpty(modelValue)) {
                    return true;
                }
                if (viewValue.length == 8) {
                    return true;
                }
                return false;
            };
        }
    };
});

appDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
