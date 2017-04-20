(function(){
    'use strict';

    angular
        .module('sis.reserva')
        .controller('ResItensModalController', ResItensModalController);
    ResItensModalController.$inject = ['$q','Data', '$uibModalInstance','logger', '$scope','$filter', '$uibModal', 'ResItensService','UtilsFunctions','ItemService'];
    /* @ngInject */
    function ResItensModalController($q,Data, $uibModalInstance,logger, $scope, $filter, $uibModal, ResItensService,UtilsFunctions,ItemService) {
        var vm = this;
        vm.title = 'Trajes da Reserva';
        vm.icon = 'fa-street-view';
        vm.subtitle = 'Trajes Reservado';

        vm.reserva = Data.reserva;
        vm.trajes = Data.trajes;
        vm.pathImg = Data.pathImg;
        vm.zoomImg  = ItemService.zoomImg;

        vm.ok = ok;
        vm.cancel = cancel;
        vm.soma = UtilsFunctions.soma;
        vm.addItem = addItem;
        vm.remItem = remItem;
        vm.validarDesc = validarDesc;
        vm.salvar = salvar;
        vm.ajustes = ajustes;

        //////////
        //activate();

        function activate() {
            var promises = [];
            return $q.all(promises).then(function() {
            });
        }

        function validarDesc(traje,valor) {
            if (valor < traje.valor_min.toFixed(2)) {
                return "O valor máximo de desconto é "+traje.valor_min.toFixed(2);
            };

        }

        function remItem(traje) {
            vm.trajes.splice(traje,1);
            if (traje.id_ri) {
                ResItensService.deletar(traje);
            }
        }

        function addItem() {
            var data = {
                dtRetirada:vm.reserva.data_retirada,
                dtDevolucao:vm.reserva.data_devolucao,
                action:'update',
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/sistema/consultar/templates/consulta.html',
              controller: 'ConsultaController',
              controllerAs: 'vm',
              size: 'lg',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });

            modalInstance.result.then(function (data) {
                angular.forEach(data.reservaItens, function(value, key){
                    vm.trajes.push(ResItensService.novoTraje(vm.reserva.id_reserva,value));
                });
            });
        }

        function ajustes(traje) {
            var data = {
                traje : traje,
            }
            var modalAjustes = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/traje-ajustes.html',
              controller: controllModal,
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }              
            });
            controllModal.$inject = ['$uibModalInstance','Data'];
            function controllModal($uibModalInstance,Data) {
              var vm = this;
              vm.traje = Data.traje;
              vm.title = 'Realizar Ajustes';
              vm.icon = 'fa-scissors';
              vm.remAjustes = remAjustes;
              vm.ok = ok;
              vm.cancel = cancel;

              function remAjustes() {
                  vm.traje.ajustar = 0;
                  vm.traje.ajustes = '';
                  vm.traje.edit = true;
                  $uibModalInstance.close();
              }

              function ok() {
                vm.traje.ajustar = 1;
                vm.traje.edit = true;
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }
        }

        function salvar(trajes) {
            var DtTemp = UtilsFunctions.copiarObjecto(trajes);
            var newItens = [];
            if (vm.reserva.id_reserva) {//se existir o id da requisição entrar no processo
                angular.forEach(DtTemp, function(value, key){
                    if (value.id_ri) {//se existir o id do item vai ser atualização
                        if (value.edit) {
                            ResItensService.update(value).then(function(r){
                                if (r.status == "ok") {
                                    //logger
                                }
                            });
                        }
                    } else {//criar novo
                        value.id_reserva = vm.reserva.id_reserva;
                        newItens.push(value);
                    }
                });
                //Salvando itens
                if (newItens.length > 0) {
                    ResItensService.create(newItens);
                }
            }
        }


        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }

    }
})();