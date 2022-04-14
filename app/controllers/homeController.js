function homeController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'homeController', cmpName = 'Home', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    $log.debug(cmpId + ' finished...');
}
homeController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('homeController', homeController);
