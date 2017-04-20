(function(){
    'use strict';

    angular
        .module('sis.reserva')
        .controller('ResModalController', ResModalController);
    ResModalController.$inject = ['config','$q','Data', '$uibModalInstance','logger', '$scope','$filter','$uibModal', 'ReservaService','UtilsFunctions','ClienteService','ResItensService', 'RecService','ModContratoService'];
    /* @ngInject */
    function ResModalController(config,$q,Data, $uibModalInstance,logger, $scope, $filter,$uibModal,ReservaService, UtilsFunctions, ClienteService,ResItensService, RecService,ModContratoService) {
        var vm = this;
        var action = Data.action;
        vm.title = 'Contrato para Reserva de Trajes';
        vm.icon = 'fa-calendar-check-o';
        vm.subtitle = 'Cadastro de contrato de reservas';
        vm.reserva = Data.reserva;
        vm.trajes = Data.reservaItens;
        vm.soma = UtilsFunctions.soma;
        vm.lojas = ReservaService.getLojas;
        vm.loja = ReservaService.getLoja();

        //*FUNÇÕES*//
        vm.ok = ok;
        vm.cancel = cancel;
        vm.getCliente = getCliente;
        vm.pathImg = config.urlImagem;
        vm.convDate = convDate;
        vm.newCliente = newCliente;
        vm.viewTrajes = viewTrajes;
        vm.salvar = salvar;
        vm.getTrages = getTrages;
        vm.regRec = regRec;
        vm.printContrato = printContrato;
        vm.printTermo = printTermo;
        vm.printAtestDev = printAtestDev;
        vm.regRec = regRec;

        //////////
        activate();

        function activate() {
            var promises = [preencherCampos()];
            return $q.all(promises).then(function() {

            });
        }

        function getTrages() {
            if (vm.reserva.id_reserva) {
                var prm = {
                    id_reserva:vm.reserva.id_reserva,
                }
                ResItensService.read(prm).then(function (res) {
                    vm.trajes = res.reg;
                });
            }
        }

        function getRec() {
            if (vm.reserva.id_reserva) {
                var prm = {
                    id_reserva:vm.reserva.id_reserva,
                }
                RecService.read(prm).then(function(result) {
                    vm.recebimentos = result.reg;
                });
            }
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function formatData() {
            var dtRes = $filter('date')(vm.reserva.data_reserva,'MM/dd/yyyy');
            var dtRet = $filter('date')(vm.reserva.data_retirada,'MM/dd/yyyy');
            var dtEve = $filter('date')(vm.reserva.data_evento,'MM/dd/yyyy');
            var dtEve = $filter('date')(vm.reserva.data_devolucao,'MM/dd/yyyy');
            vm.reserva.data_reserva = convDate(dtRes);
            vm.reserva.data_retirada = convDate(dtRet);
            vm.reserva.data_evento = convDate(dtEve);
            vm.reserva.data_devolucao = convDate(dtEve);
        }

        function getCliente(nome) {
            var consulta = {
                nome:nome,
            };
            return ClienteService.read(consulta).then(function (data) {
                return data.reg;
            });
        };        

        function preencherCampos() {
            switch (action){
                case 'create':
                    vm.reserva.id_loja = vm.loja.id_loja;
                    vm.reserva.id_usu_rep_alug = ReservaService.userLogado.id_usuario;
                    vm.reserva.resp_alug = ReservaService.userLogado.nome;
                    vm.reserva.data_reserva = new Date();
                    vm.reserva.imp_contrato = 0;
                    vm.reserva.status = 0;
                    vm.reserva.valor_entrada = 0;
                    angular.forEach(vm.trajes, function(value, key){
                        value.valor = value.valor_traje;
                    });
                break;
                case 'update':
                    formatData();
                    getTrages();
                    getRec();
                break;
                default:
                    logger.danger('Action not defined');
            }

        }

        function regRec(prm) {
            var dt = new Date();
            if (prm === 0) {//automatico
                if (!vm.reserva.id_rec_entrada) {
                    var rec = {
                        id_loja:vm.loja.id_loja,
                        id_reserva:vm.reserva.id_reserva,
                        data_rec:dt,
                        id_tp:1,//dinheiro
                        valor:vm.reserva.valor_entrada,
                        obs:'Recebimento da entrada do contrato nº '+vm.reserva.id_reserva,
                    }
                    RecService.create(rec).then(function(res){
                        if (res.status = 'ok') {
                            vm.reserva.id_rec_entrada = res.last_insert;
                            ReservaService.update(vm.reserva).then(function(res){
                                if (res.status = 'ok') {
                                    preencherCampos();
                                }
                            });
                        }
                    });
                } else {
                    var rec = {
                        data_rec:dt,
                        valor:vm.reserva.valor_entrada,
                        id_rec:vm.reserva.id_rec_entrada,
                    };
                    RecService.update(rec).then(function(res){
                        preencherCampos();
                    });
                }
            } else {//manual
                var rec = {
                    id_loja:vm.loja.id_loja,
                    id_reserva:vm.reserva.id_reserva,
                    cliente:vm.reserva.cliente,
                    data_rec:dt,
                }
                var data = {
                  action:'create',
                  recebimento:rec,
                };
                var modalRecebimento = $uibModal.open({
                  templateUrl: 'app/sistema/recebimentos/templates/recebimento-cadastro.html',
                  controller: 'RecModalController',
                  controllerAs: 'vm',
                  size: '',
                  backdrop:'static',
                  resolve: {
                    Data: function () {
                      return data;
                    }
                  }
                });
                modalRecebimento.result.then(function (res) {
                    getRec();
                });

            }
        }
        function salvar() {
            switch (action){
                case 'create':
                    ReservaService.create(vm.reserva).then(function (res) {
                        if (res.status === 'ok') {
                            vm.reserva.id_reserva = res.last_insert;
                            for (var i = 0; i < vm.trajes.length; i++) {
                                vm.trajes[i].id_reserva = vm.reserva.id_reserva;
                            }
                            ResItensService.create(vm.trajes).then(function () {
                                //recarregar os registros, para que todos os campos que os relatorios 
                                //sao dependentes, sejam preenchidos
                                var prm = {
                                    id_reserva:vm.reserva.id_reserva,
                                };
                                ReservaService.read(prm).then(function (res) {
                                    vm.reserva = res.reg[0];
                                    action = 'update';//agora ja esta criado
                                    preencherCampos();
                                });
                            });
                        }
                    });
                break;
                case 'update':
                    ReservaService.update(vm.reserva);
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

        function viewTrajes() {
            var data = {
                reserva:vm.reserva,
                trajes:vm.trajes,
                pathImg :vm.pathImg,
            }
            var modalTrajes = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/reserva-trajes.html',
              controller: 'ResItensModalController',
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

        function printContrato() {
            ModContratoService.load().then(function(cont){
                var contrato = cont.reg[0].contrato;
                var data = {
                    action:'contrato',
                    contrato:contrato,
                    reserva:vm.reserva,
                    trajes:vm.trajes,
                }
                var modalInstance = $uibModal.open({
                  templateUrl: 'app/sistema/reservas/templates/print.html',
                  controller: 'ResPrintModalController',
                  controllerAs: 'vm',
                  size: '',
                  backdrop:'static',
                  resolve: {
                    Data: function () {
                      return data;
                    }
                  }
                });                

            });

        }
        function printTermo() {
            var data = {
                action:'termo',
                reserva:vm.reserva,
                trajes:vm.trajes,
            }
            var modalInstance = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/print.html',
              controller: 'ResPrintModalController',
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

        function printAtestDev() {
            var data = {
                action:'devolucao',
                reserva:vm.reserva,
                trajes:vm.trajes,
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/sistema/reservas/templates/print.html',
                controller: 'ResPrintModalController',
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

        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();