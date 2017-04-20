(function(){
    'use strict';

    angular
        .module('sis.consulta')
        .controller('PeriodoController', PeriodoController);
    PeriodoController.$inject = ['$uibModalInstance', '$scope', 'logger'];
    /* @ngInject */
    function PeriodoController($uibModalInstance, $scope, logger) {
        var vm = this;
        vm.title = 'Infome o Período da Reserva';
        vm.caledario = {
            dtRetirada:'',
            dtEvento:'',
            dtDevolucao:'',
        };
        vm.icon = "fa-calendar";

        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() {
            dataPadrao();
        }

        function dataPadrao() {
            var dataIni = new Date();
            var dataFim = new Date();
            dataFim.setDate(dataIni.getDate() + 5);
            vm.caledario.dtRetirada = dataIni;
            vm.caledario.dtDevolucao = dataFim;
        }

        function validarData() {
            var ret = true;
            if (!vm.caledario.dtRetirada) {
                ret = false;
            }
            if (!vm.caledario.dtDevolucao) {
                ret = false
            }
            if (vm.caledario.dtRetirada > vm.caledario.dtDevolucao) {
                ret = false;
            }
            return ret;
        }

        function ok() {
            if (validarData()) {
                $uibModalInstance.close(vm.caledario);
            } else {
                logger.warning('A data informada é inválida');
            }
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();