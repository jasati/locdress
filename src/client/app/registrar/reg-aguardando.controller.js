(function() {
    'use strict';
    angular
        .module('app.registrar')
        .controller('AguardandoConfController', AguardandoConfController);
    AguardandoConfController.$inject = ['RegistrarFuncService'];
    /* @ngInject */
    function AguardandoConfController(RegistrarFuncService) {
    	var vm = this;
        vm.funcoes = new RegistrarFuncService.funcoes();
    }
})();