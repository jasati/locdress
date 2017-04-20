(function() {
    'use strict';
    angular
        .module('app.registrar')
        .controller('RegistrarController', RegistrarController);
    RegistrarController.$inject = ['RegistrarFuncService'];
    /* @ngInject */
    function RegistrarController(RegistrarFuncService) {
    	var vm = this;
        vm.funcoes = new RegistrarFuncService.funcoes();
    }
})();