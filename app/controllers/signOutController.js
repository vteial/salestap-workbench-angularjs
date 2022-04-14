function signOutController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'signOutController', cmpName = 'Sign Out', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    $log.debug(cmpId + ' finished...');
}
signOutController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('signOutController', signOutController);
