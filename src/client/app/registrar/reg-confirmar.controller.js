(function() {
    'use strict';
    angular
        .module('app.registrar')
        .controller('ConfirmRegController', ConfirmRegController);
    ConfirmRegController.$inject = ['$stateParams','RegistrarFuncService'];
    /* @ngInject */
    function ConfirmRegController($stateParams,RegistrarFuncService) {
    	var vm = this;
        vm.funcoes = new RegistrarFuncService.funcoes();

        activate();

        function activate() {
            if ($stateParams.confirm != undefined && $stateParams.idemp != undefined) {
                vm.funcoes.confirmarCadastro($stateParams.confirm,$stateParams.idemp);
            }
        }
    }
})();