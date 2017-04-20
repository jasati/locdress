(function() {
    'use strict';
    angular
        .module('app.licenca')
        .controller('LicencaController', LicencaController);
    LicencaController.$inject = ['$q','LicencaFuncService'];
    /* @ngInject */
    function LicencaController($q,LicencaFuncService) {
        var vm = this;

        vm.funcoes = new LicencaFuncService.funcoes();
        activate();

        function activate() {
            var promises = [
                vm.funcoes.loadEmpresa(),
                vm.funcoes.getPlanos(),
            ]
            $q.all(promises);
        }

    }
})();