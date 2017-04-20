(function() {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$q','LoginFuncService'];
    /* @ngInject */
    function LoginController($q,LoginFuncService) {
    	var vm = this;
        vm.login = new LoginFuncService.funcoes();;

        activate();

        function activate() {
            var promises = [vm.login.setConsulta()];
            $q.all(promises);
        }

    }
})();