function signInController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'signInController', cmpName = 'Sign In', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    $log.debug(cmpId + ' finished...');
}
signInController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('signInController', signInController);
