(function() {
    'use strict';
    angular
        .module('sis.rec')
        .controller('RecPrintModalController', RecPrintModalController);
    RecPrintModalController.$inject = ['$q','Data','$uibModalInstance','RecReport','RecService','config'];
    /* @ngInject */
    function RecPrintModalController($q,Data,$uibModalInstance,RecReport,RecService,config) {
        var vm = this;
        var action = Data.action;
        vm.title = 'Comprovante de Recebimento';
        vm.icon = 'fa-print';
        vm.recebimento = Data.recebimento;

        //*FUNÇÕES*//
        vm.ok = ok;
        vm.cancel = cancel;
        vm.deletePdf = deletePdf;
        vm.refreshPdf = refreshPdf;
        activate();
        ////////////////
        function activate() {
            var promises = [];
            var page = '';
            var numero = 0;
            if (Data.action === 'recibo') {
                promises = [RecReport.tplRecibo(vm.recebimento)];
                page = 'R';//retrato ou L landscape
                numero = vm.recebimento.id_rec;
            }
            $q.all(promises).then(function(html){
                createPdf(html[0],page,numero);
            });
        }


        function createPdf(html,page,numero) {
            var data = {
                prm:'C',
                html:html,
                nomePrefix:'recibo'+RecService.userLogado.id_usuario+'_',
                numero:numero,
                page:page//R retrato L Landscape
            };
            RecService.getPdf(data).then(function(result){
                vm.pdfName = result.report_name;
                vm.pdf = config.report+result.report_name;
            });

        }

        function deletePdf() {
            var data = {
                prm:'D',
                nomePrefix:'recibo'+RecService.userLogado.id_usuario+'_'
            };
            RecService.getPdf(data).then(function(result){
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

        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }        
    }
})();