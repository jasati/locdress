(function(){
    'use strict';

    angular
        .module('cad.item')
        .controller('ItemModalController', ItemModalController);
    ItemModalController.$inject = ['$q', 'Data', 'config', 'logger', '$uibModalInstance', '$scope', '$uibModal', 'ItemService', 'ItemAtrbService'];
    /* @ngInject */
    function ItemModalController($q, Data, config, logger, $uibModalInstance, $scope, $uibModal, ItemService, ItemAtrbService) {
        var vm = this;
        var action = Data.action;
        vm.uploader = ItemService.upload();
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function(i /*{File|FileLikeObject}*/, options) {
                var type = '|' + i.type.slice(i.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        vm.totalRegPag = 8;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        vm.title = 'Cadastrar Traje';
        vm.icon = 'fa-street-view';        
        vm.item = Data.item;
        vm.getLojas = Data.lojas;
        vm.categorias = Data.categorias;
        vm.subcategorias = Data.subcategorias;
        vm.atrbs = [];
        vm.pathImg = config.urlImagem;
        vm.zoomImg = zoomImg;
        vm.getTrajeCad = getTrajeCad;
        vm.getAtrbs = getAtrbs;
        vm.novoAtrb = novoAtrb;
        vm.editAtrb = editAtrb;
        vm.deleteAtrb = deleteAtrb;
        vm.salvar = salvar;
        vm.aterarAction = aterarAction;

        vm.ok = ok;
        vm.cancel = cancel;

        activite();

        function activite() {
            var promises = [getAtrbs()];
            return $q.all(promises).then(function() {
                vm.lojas = vm.getLojas();
            });
        }

        function zoomImg(i) {
            var data = {
                item:i,
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'app/cadastros/item/templates/zoom-img.html',
                controller: 'ZoomImgController',
                controllerAs: 'vm',
                size: '',
                resolve: {
                    Data: function () {
                      return data;
                    }
                }
            });
        }

        function newItem(item) {
          ItemService.create(item).then(function(data){
            if (data.status === "ok") {
                vm.item.id_item = data.last_insert;
            }
          });
        }

        function editItem(item) {
          ItemService.update(item);
        }

        function salvar(item) {
            switch (action){
                case 'new': 
                    newItem(item);
                    break;
                case 'edit':
                    editItem(item);
                    break;
            }
        }

        function aterarAction(newAction) {
            action = newAction;
        }
        vm.uploader.onSuccessItem = function(item, response, status, headers) {
            if (response.status === 'ok') {
                vm.item.id_galeria = response.last_insert;
                vm.item.imagem = response.imagem;
            } else {
                logger.error(response.msg);
            }
        };

        function getTrajeCad(traje) {
            var consulta = {
                descricao:traje,
            };
            return ItemService.read(consulta,getLimite()).then(function (data) {
                return data.reg;
            });
        };

        function getAtrbs() {
            if (vm.item.id_item) {
                var cons ={
                    id_item : vm.item.id_item,
                };
                ItemAtrbService.read(cons).then(function(data){
                  vm.atrbs = data.reg;
                });
            }
        }

        function novoAtrb() {
            var data = {
                atrb:{
                    id_item:vm.item.id_item,
                },
                action:'new',
                descricao:vm.item.descricao,
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'app/cadastros/item/atrb/templates/atrb.html',
                controller: 'ItemAtrbController',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    Data: function () {
                      return data;
                    }
                }
            });

            modalInstance.result.then(function(atrb) {
                getAtrbs();
            });
        }

        function editAtrb(atrb) {
            var data = {
                atrb:atrb,
                action:'edit',
                descricao:vm.item.descricao,
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'app/cadastros/item/atrb/templates/atrb.html',
                controller: 'ItemAtrbController',
                controllerAs: 'vm',
                size: 'sm',
                resolve: {
                    Data: function () {
                      return data;
                    }
                }
            });

            modalInstance.result.then(function(atrb) {
                getAtrbs();
            });
        }

         function deleteAtrb(atrb) {
            var data = {data:atrb};
            var modalInstance = $uibModal.open({
              templateUrl: 'app/blocks/utils/templates/msg.html',
              controllerAs: 'vm',
              controller: controllModal,
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
              vm.data = Data.data;
              vm.corTitle = 'bred';
              vm.title = 'Confirmar a Exclusão';
              vm.subtitle = 'Confirma a exclusão do atributo do ';
              vm.destacar = 'traje '+vm.data.tam;
              vm.corBtnClose = 'btn-danger';
              vm.corBtnCancel = 'btn-primary';
              vm.txtBtnClose = 'Confirmar';
              vm.txtBtnCancel = 'Cancelar';

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(item) {
                ItemAtrbService.deletar(atrb).then(function(data){
                  if (data.status === "ok") {
                    getAtrbs();
                  }
                });
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
        }        

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }

        function ok(data) {
            $uibModalInstance.close(data);
        };
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        };
    }
})();