function messageController($log, $rootScope, $scope, $location) {
    var cmpId = 'messageController', cmpName = 'Message', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + '...');

    vm.params = $location.search();
    console.log(vm.params);
    if (vm.params.errorMessage) {
        vm.hasErrorMessage = true;
    }
    else {
        vm.hasErrorMessage = false;
    }
    $log.debug(cmpId + ' finished...');
}

messageController.$inject = ['$log', '$rootScope', '$scope', '$location'];
appControllers.controller('messageController', messageController);

function notFoundController($log, $rootScope, $scope, $location) {
    var cmpId = 'notFoundController', cmpName = 'Not Found', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + '...');

    vm.params = $location.search();
    console.log(vm.params);
    $log.debug(cmpId + ' finished...');
}

notFoundController.$inject = ['$log', '$rootScope', '$scope', '$location'];
appControllers.controller('notFoundController', notFoundController);
