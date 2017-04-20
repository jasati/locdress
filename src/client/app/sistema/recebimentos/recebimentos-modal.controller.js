(function(){
    'use strict';

    angular
        .module('sis.rec')
        .controller('RecModalController', RecModalController);
    RecModalController.$inject = ['config','$q','Data', '$uibModalInstance','logger', '$scope','$filter','$uibModal', 'RecService','UtilsFunctions','ClienteService','TipoPgtoService'];
    /* @ngInject */
    function RecModalController(config,$q,Data, $uibModalInstance,logger, $scope, $filter,$uibModal,RecService, UtilsFunctions, ClienteService,TipoPgtoService) {
        var vm = this;
        var action = Data.action;
        vm.title = 'Registro de Recebimentos';
        vm.icon = 'fa-money';
        vm.subtitle = '';
        vm.recebimento = Data.recebimento;
        vm.reserva = Data.reserva;
        vm.soma = UtilsFunctions.soma;
        vm.lojas = RecService.getLojas;
        vm.loja = RecService.getLoja();
        vm.recibo = recibo;

        //*FUNÇÕES*//
        vm.ok = ok;
        vm.cancel = cancel;
        vm.convDate = convDate;
        vm.salvar = salvar;
        vm.getCliente = getCliente;
        vm.newCliente = newCliente;

        //////////
        activate();

        function activate() {
            var promises = [preencherCampos(),getTipoPgto()];
            return $q.all(promises).then(function() {

            });
        }
        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function preencherCampos() {
            switch (action){
                case 'create':

                break;
                case 'update':
                    formatData();
                break;
                default:
                    logger.danger('Action not defined');
            }

        }

        function formatData() {
            vm.recebimento.data_rec = convDate(vm.recebimento.data_rec);
        }

        function getCliente(nome) {
            var consulta = {
                nome:nome,
            };
            return ClienteService.read(consulta).then(function (data) {
                return data.reg;
            });
        };

        function getTipoPgto() {
            TipoPgtoService.read().then(function (result) {
                vm.tipopgtos = result.reg;
            });
        }


        function salvar() {
            switch (action){
                case 'create':
                    RecService.create(vm.recebimento).then(function (res) {
                        if (res.status === 'ok') {
                            var data = {
                                id_rec:res.last_insert,
                            }
                            RecService.read(data).then(function (rec) {
                                vm.recebimento = rec.reg[0];
                                formatData();
                            });
                        }
                    });
                break;
                case 'update':
                    RecService.update(vm.recebimento);
                break;
            }
        }

        function newCliente() {

            var cliente = {};
            cliente.id_empresa = 0;
            cliente.id_loja = vm.loja.id_loja;
            var data = {
              cliente:cliente,
              lojas:vm.lojas,
              action:'create',
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/cliente/templates/cliente-cadastro.html',
              controller: 'ClienteModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
        }

        function recibo() {
            var data = {
                action:'recibo',
                recebimento:vm.recebimento,
            }
            var modalInstance = $uibModal.open({
              templateUrl: 'app/sistema/recebimentos/templates/print.html',
              controller: 'RecPrintModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
        }


        function ok() {
            $uibModalInstance.close(vm.recebimento);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();