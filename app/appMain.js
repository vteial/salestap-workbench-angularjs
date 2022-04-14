function appService($log, $http, $q, $rootScope, wydNotifyService) {
    var basePath = 'http://localhost:8080/api', service = {};

    function initContext() {
        service.context = { userId : null };
        service.context.appName = 'Workbench AngularJS';
        service.context.appDescription = 'Workbench AngularJS';
    }

    function addOrUpdateCacheX(propName, objectx) {
        //var objectsLst = service[propName]
        var objectsMap = service[propName + 'Map'];
        var object = objectsMap[objectx.id];
        if (object) {
            _.assign(object, objectx);
        } else {
            //objectsLst.push(objectx);
            objectsMap[objectx.id] = objectx;
        }
    }

    function addOrUpdateCacheY(propName, objectx) {
        var objectsLst = service[propName];
        var objectsMap = service[propName + 'Map'];
        var object = objectsMap[objectx.id];
        if (object) {
            _.assign(object, objectx);
        } else {
            objectsLst.push(objectx);
            objectsMap[objectx.id] = objectx;
        }
    }

    function processItems(items) {}

    service.getProducts = function () {
        var path = basePath + '/products';
        var deferred = $q.defer();
        $http.get(path).then(function (response) {
            deferred.resolve(response);
        }, function () {
            deferred.reject("unable to get products...");
        });
        return deferred.promise;
    };

    service.addProduct = function(item) {
        var path = basePath + '/products';
        var deferred = $q.defer();
        $http.post(path, item).then(function (response) {
            deferred.resolve(response);
        }, function () {
            deferred.reject("unable to create product...");
        });
        return deferred.promise;
    };

    service.getProduct = function(itemId) {
        var path = basePath + '/products/' + itemId;
        var deferred = $q.defer();
        $http.get(path).then(function (response) {
            deferred.resolve(response);
        }, function () {
            deferred.reject("unable to get product...");
        });
        return deferred.promise;
    };

    service.setProduct = function(item) {
        var path = basePath + '/products/' + item.id ;
        var deferred = $q.defer();
        $http.put(path, item).then(function (response) {
            deferred.resolve(response);
        }, function () {
            deferred.reject("unable to get products...");
        });
        return deferred.promise;
    };

    service.removeProduct = function(itemId) {
        var path = basePath + '/products/' + itemId;
        var deferred = $q.defer();
        $http['delete'](path).then(function (response) {
            deferred.resolve(response);
        }, function () {
            deferred.reject("unable to delete product...");
        });
        return deferred.promise;
    };

    initContext();

    return service;
}
appServices.factory('sessionService', appService);

function rootController($log, $rootScope, $scope, sessionService, $window, $location) {
    var cmpId = 'rootController', cmpName = '-';
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + '...');

    if (window.location.hostname.indexOf('localhost') > -1) {
        $rootScope.appEnv = 'local';
    }

    $scope.lodash = _; $scope.isCollapsed = true;

    var sessionS = sessionService;
    $scope.sessionS = sessionS;

    $scope.historyBack = function () {
        $window.history.back();
    };

    $scope.toggleMenu = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
    };
}
appControllers.controller('rootController', rootController);

function homeController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'homeController', cmpName = 'Home', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    vm.refresh = function() {
        sessionService.getProducts().then(function(res) {
            console.log(res);
            vm.items = res.data;
        });
    };

    vm.add = function() {
        vm.item = { id : 0, unit: 1 };
    };

    vm.edit = function(item) {
        sessionService.getProduct(item.id).then(function(res) {
            if( res.status === 200) {
                vm.item = res.data;
                // wydNotifyService.showSuccess('fetched successfully...');
            } else {
                wydNotifyService.showError('fetch failed...');
            }
        });
    };

    vm.remove = function(item) {
        sessionService.removeProduct(item.id).then(function(res) {
            if( res.status === 200) {
                vm.items = res.data;
                wydNotifyService.showSuccess('removed successfully...');
            } else {
                wydNotifyService.showError('remove failed...');
            }
        });
    };

    vm.save = function() {
        if (!$scope.form0.$valid) {
            var error = $scope.form0.itemCode.$error;
            if (Object.keys(error).length > 0) {
                wydNotifyService.showError('Provide Code');
                wydFocusService('itemCode');
                return;
            }
            error = $scope.form0.itemName.$error;
            if (Object.keys(error).length > 0) {
                wydNotifyService.showError('Provide Name');
                wydFocusService('itemName');
                return;
            }
            error = $scope.form0.itemUnit.$error;
            if (Object.keys(error).length > 0) {
                wydNotifyService.showError('Provide Unit');
                wydFocusService('itemUnit');
                return;
            }
            error = $scope.form0.itemRate.$error;
            if (Object.keys(error).length > 0) {
                wydNotifyService.showError('Provide Rate');
                wydFocusService('itemRate');
                return;
            }
            return;
        }
        console.log(vm.item);
        if (vm.item.id === 0) {
            sessionService.addProduct(vm.item).then(function(res) {
                console.log(res);
                if( res.status === 200) {
                    vm.items = res.data;
                    wydNotifyService.showSuccess('added successfully...');
                } else {
                    wydNotifyService.showError('add failed...');
                }
            });
        } else {
            sessionService.setProduct(vm.item).then(function(res) {
                console.log(res);
                if( res.status === 204) {
                    vm.refresh();
                    wydNotifyService.showSuccess('updated successfully...');
                } else {
                    wydNotifyService.showError('update failed...');
                }
            });
        }
    }

    vm.refresh();
    vm.add();
    $log.debug(cmpId + ' finished...');
}
homeController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('homeController', homeController);

var dependents = ['ngRoute', 'ngSanitize', 'ngMessages'];
dependents.push('ngStorage');
dependents.push('ngclipboard');
dependents.push('green.inputmask4angular');
dependents.push('blockUI');
dependents.push('ngNotify');
//dependents.push('ui.bootstrap');
//dependents.push('ngFileUpload');
//dependents.push('infinite-scroll');
dependents.push('app.filters');
dependents.push('app.directives');
dependents.push('app.services');
dependents.push('app.controllers');
var app = angular.module('app', dependents), lodash = _, jquery = $;

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('generalHttpInterceptor');
});

function appConfig($routeProvider, $locationProvider, ) {
    $routeProvider.when('/', {
        redirectTo: '/home'
    });
    $routeProvider.when('/home', {
        templateUrl: 'app/views/homeTemplate.html',
        controller: 'homeController as vm'
    });
    $routeProvider.when('/message', {
        templateUrl: 'app/zgeneral/messageTemplate.html',
        controller: 'messageController as vm'
    });
    $routeProvider.when('/not-found', {
        templateUrl: 'app/zgeneral/notFoundTemplate.html',
        controller: 'notFoundController as vm'
    });
    $routeProvider.otherwise({
        redirectTo: '/not-found'
    });
}
app.config(appConfig);

function appInit($rootScope, $location, $sessionStorage) {
    console.log('initialization started...');
    console.log('initialization finished...');
}
app.run(['$rootScope', '$location', '$sessionStorage', appInit]);
