function appService($log, $http, $q, $rootScope, wydNotifyService) {
    var basePath = 'http://localhost:8080/api', service = {};

    function initContext() {
        service.context = { userId : null };
        service.context.appName = 'Workbench AngularJS';
        service.context.appDescription = 'Workbench AngularJS';
        service.keycloak = new Keycloak({
           url: 'http://localhost:9999/auth/',
           realm: 'salestap',
           clientId: 'salestap-app',
       });
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

    service.signIn = function() {
        service.keycloak.login();
    }

    service.signOut = function() {
        service.keycloak.logout();
    }

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

function rootController($log, $rootScope, $scope, $location, sessionService, $window, $location) {
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

    $scope.goTo = function(path) {
        $location.path(path);
    }

    $scope.signOut = sessionService.signOut;

    sessionService.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    }).then(function(authenticated) {
        console.log('isAuthenticated : ' + (authenticated ? 'authenticated' : 'not authenticated'));
        if(!authenticated) sessionService.signIn();
        else {
            sessionService.keycloak.loadUserProfile();
        }
    }).catch(function(exp) {
        console.log(exp);
        console.log('Keycloak failed to initialize...');
    });
}
appControllers.controller('rootController', rootController);

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
    $routeProvider.when('/products', {
        templateUrl: 'app/views/productListTemplate.html',
        controller: 'productListController as vm'
    });
    $routeProvider.when('/sign-in', {
        templateUrl: 'app/views/signInTemplate.html',
        controller: 'signInController as vm'
    });
    $routeProvider.when('/sign-up', {
        templateUrl: 'app/views/signOutTemplate.html',
        controller: 'signOutController as vm'
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
    console.log(window.location.href);
    console.log('initialization finished...');
}
app.run(['$rootScope', '$location', '$sessionStorage', appInit]);
