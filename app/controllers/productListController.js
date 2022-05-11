function productListController($log, $rootScope, $scope, wydNotifyService, sessionService, wydFocusService) {
    var cmpId = 'productListController', cmpName = 'Products', vm = this;
    $rootScope.viewName = cmpName;
    $log.debug(cmpId + ' started...');

    vm.refresh = function() {
        sessionService.getProducts().then(function(res) {
            console.log(res);
            vm.items = res.data;
        });
    };

    vm.add = function() {
        vm.item = { unit: 1 };
    };

    vm.edit = function(item) {
        sessionService.getProduct(item.id).then(function(res) {
            console.log(res);
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
            console.log(res);
            if( res.status === 204) {
                vm.refresh();
                if(vm.item.id === item.id) vm.add();
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
        if (!vm.item.id) {
            sessionService.addProduct(vm.item).then(function(res) {
                console.log(res);
                if( res.status === 201) {
                    vm.refresh();
                    wydNotifyService.showSuccess('added successfully...');
                    vm.add();
                } else {
                    wydNotifyService.showError('add failed...');
                }
            });
        } else {
            sessionService.setProduct(vm.item).then(function(res) {
                console.log(res);
                if( res.status === 200) {
                    vm.refresh();
                    wydNotifyService.showSuccess('updated successfully...');
                    vm.add();
                } else {
                    wydNotifyService.showError('update failed...');
                }
            });
        }
    }

    //vm.refresh();
    vm.add();
    $log.debug(cmpId + ' finished...');
}
productListController.$inject = ['$log', '$rootScope', '$scope', 'wydNotifyService', 'sessionService', 'wydFocusService'];
appControllers.controller('productListController', productListController);

// http://localhost:9999/realms/workbench/protocol/openid-connect/auth?client_id=workbench-app&redirect_uri=https://www.keycloak.org/app/#url=http://localhost:9999&realm=workbench&client=workbench-app&state=2fb94028-4eac-446b-bd5b-5e9dea92e82d&response_mode=fragment&response_type=code&scope=openid&nonce=61970d96-e34e-4de1-af78-a3940ada0491