(function() {
    'use strict';
    angular
        .module('app.registrar')
        .controller('RegistrarController', RegistrarController);
    RegistrarController.$inject = ['RegistrarFuncService','$stateParams'];
    /* @ngInject */
    function RegistrarController(RegistrarFuncService,$stateParams) {
    	var vm = this;
    	vm.registro = {
    		email : $stateParams.email
    	};
        vm.funcoes = new RegistrarFuncService.funcoes();
    }
})();