function homeController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'homeController', cmpName = 'Home', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    vm.keycloak = sessionService.keycloak;
    vm.userProfile = sessionService.userProfile;

    $log.debug(cmpId + ' finished...');
}
homeController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('homeController', homeController);
