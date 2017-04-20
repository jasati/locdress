(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('StartController', StartController);

    StartController.$inject = ['$stateParams','$state','$rootScope', '$timeout', 'config', 'logger', '$cookies','DataserviseProvider','LoginFuncService'];
    /* @ngInject */
    function StartController($stateParams,$state,$rootScope, $timeout, config, logger, $cookies,DataserviseProvider,LoginFuncService) {
        var vm = this;
        vm.busyMessage = 'Teste';
        $rootScope.showSplash = true;
        activate();

        function activate() {
            hideSplash();
            if ($stateParams.register) {
                $state.go('registrar');
            } else if ($stateParams.confirm) {
                $state.go('confirmareg',{confirm:$stateParams.confirm,idemp:$stateParams.idemp});
            } else {
                var login = new LoginFuncService.funcoes();
                login.fazerLogin();
            }
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }
       

    }
})();
