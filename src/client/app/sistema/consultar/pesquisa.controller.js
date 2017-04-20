(function() {
    'use strict';
    angular
        .module('sis.consulta')
        .controller('PesquisaController', PesquisaController);
    PesquisaController.$inject = ['Data','$uibModalInstance','logger','$scope'];
    /* @ngInject */
    function PesquisaController(Data, $uibModalInstance,logger,$scope) {
        var vm = this;
        vm.title = 'Pesquisa';
        vm.consulta = Data;
        $scope.consulta = Data;
        vm.ok = ok;
        vm.cancel = cancel;
        activate();

        ////////////////
        function activate() {
        }


        function ok() {
            $uibModalInstance.close(vm.consulta);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }

    }
})();