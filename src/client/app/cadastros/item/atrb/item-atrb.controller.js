(function () {
    'use strict';

    angular
        .module('cad.itemAtrb')
        .controller('ItemAtrbController', ItemAtrbController);

    ItemAtrbController.$inject = ['Data','config','$q','$filter', '$uibModal','$uibModalInstance', 'logger', 'ItemAtrbService','ItemService', 'routerHelper','GaleriaService'];
    /* @ngInject */
    function ItemAtrbController(Data,config,$q,$filter, $uibModal, $uibModalInstance, logger, ItemAtrbService,ItemService, routerHelper,GaleriaService) {
        var vm = this;
        vm.uploader = ItemService.upload();
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function(i /*{File|FileLikeObject}*/, options) {
                var type = '|' + i.type.slice(i.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        vm.descricao = Data.descricao;
        vm.action = Data.action;
        vm.pathImg = config.urlImagem;
        vm.title = 'Cadastrar Unidade';
        vm.icon = 'fa-plus';
        vm.subtitle = '';
        vm.atrb = Data.atrb;
        vm.permissao = ItemAtrbService.verificarPermissao;
        vm.editAtrb = editAtrb;
        vm.newAtrb = newAtrb;
        vm.zoomImg = zoomImg;
        vm.addImagem = addImagem;
        vm.salvar = salvar;
        vm.cancel = cancel;
        vm.ok = ok;

        activate();

        function activate() {
            $q.all([vm.permissao(5)]).then(function(data){
              if (data) {
                var promises = [setData()];
                return $q.all(promises)
              } else {
                logger.warning('Acesso Negado!');
              }
            });
        }
        function setData() {
            var dt = $filter('date')(vm.atrb.data_compra,'MM/dd/yyyy');
            vm.atrb.data_compra = convDate(dt);
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function newAtrb(atrb) {
          if (vm.permissao(6)) {
            ItemAtrbService.create(atrb).then(function(data){
              if (data.status==="ok") {
                ok();
              }
            });
          }
        }   

        function editAtrb(atrb) {
          if (vm.permissao(7)) {
            ItemAtrbService.update(atrb).then(function(data){
              if (data.status === "ok") {
                ok();
              }
            });
          }
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
        vm.uploader.onSuccessItem = function(item, response, status, headers) {
            if (response.status === 'ok') {
                vm.atrb.id_galeria = response.last_insert;
                vm.atrb.imagem = response.imagem;
            } else {
                logger.error(response.msg);
            }
        };

        function addImagem() {
            GaleriaService.showGaleria().then(function (data) {
                vm.atrb.id_galeria = data.id_galeria;
                vm.atrb.imagem = data.imagem;
            });
        }        

        function salvar(data) {
          if (vm.action === 'new') {
              newAtrb(data);
          } else {
              editAtrb(data);
          }
        }

        function ok() {
          $uibModalInstance.close();
        }

        function cancel() {
          $uibModalInstance.dismiss('cancel');
        }        

    }
})();
