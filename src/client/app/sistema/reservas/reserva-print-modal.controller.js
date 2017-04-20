(function(){
    'use strict';

    angular
        .module('sis.reserva')
        .controller('ResPrintModalController', ResPrintModalController);
    ResPrintModalController.$inject = ['$q','Data', '$uibModalInstance','logger', '$scope','$filter', '$uibModal','config','ResReport','ReservaService'];
    /* @ngInject */
    function ResPrintModalController($q,Data, $uibModalInstance,logger, $scope, $filter, $uibModal,config,ResReport,ReservaService) {
        var vm = this;
        var action = Data.action;
        vm.title = 'Relatório de '+action;
        vm.icon = 'fa-print';
        vm.reserva = Data.reserva;
        vm.trajes = Data.trajes;
        vm.pdf = '';
        vm.pdfName = '';
        vm.deletePdf = deletePdf;
        vm.refreshPdf = refreshPdf;


        activate();

        function activate() {
            var promises = [];
            var page = '';
            var numero = 0;
            switch (action){
                case 'contrato':
                    promises = [ResReport.tplContrato( Data.contrato)];
                    page = 'R';
                    numero = vm.reserva.id_reserva;
                    break;
                case 'termo':
                    promises = [ResReport.tplTermo(vm.reserva,vm.trajes)];
                    page = 'R';
                    numero = vm.reserva.id_reserva;
                    break;
                case 'devolucao':
                    promises = [ResReport.tplDevolucao(vm.reserva,vm.trajes)];
                    page = 'R';
                    numero = vm.reserva.id_reserva;

            }
            $q.all(promises).then(function(html){
                createPdf(html[0],page,numero);
            });
        }


        function createPdf(html,page,numero) {
            var data = {
                prm:'C',
                html:html,
                nomePrefix:action+ReservaService.userLogado.id_usuario+'_',
                numero:numero,
                page:page//R retrato L Landscape
            };
            ReservaService.getPdf(data).then(function(result){
                vm.pdfName = result.report_name;
                vm.pdf = config.report+result.report_name;
            });

        }

        function deletePdf() {
            var data = {
                prm:'D',
                nomePrefix:action+ReservaService.userLogado.id_usuario+'_'
            };
            ReservaService.getPdf(data).then(function(result){
                if (result.status == 'ok') {
                    ok();
                }
            });
        }

        function refreshPdf() {
            var container = document.getElementById('pdf');
            var content = container.innerHTML;

            container.innerHTML = content;
        }

        function ok() {
            $uibModalInstance.close(vm.reserva);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();