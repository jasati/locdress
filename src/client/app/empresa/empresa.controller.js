(function () {
    'use strict';

    angular
        .module('app.empresa')
        .controller('EmpresaController', EmpresaController);

    EmpresaController.$inject = ['$q', 'logger', 'EmpresaService', 'routerHelper','LojasService','ModContratoService','$uibModal','config','LicencasService'];
    /* @ngInject */
    function EmpresaController($q, logger, EmpresaService, routerHelper, LojasService,ModContratoService,$uibModal,config,LicencasService) {
        var vm = this;

        vm.title = 'Configurações';
        vm.icon = 'fa-cog';
        vm.subtitle = 'Cadastro e Parâmetrização do sistema';
        vm.empresa = [];
        vm.lojas = [];
        vm.modContrato = "";
        vm.outro = 'teste';
        vm.uploader = EmpresaService.upload();
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function(i /*{File|FileLikeObject}*/, options) {
                var type = '|' + i.type.slice(i.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        vm.permissao = EmpresaService.verificarPermissao;
        vm.pathImg = config.urlImagem;
        vm.getEmpresa = getEmpresa;
        vm.editEmpresa = editEmpresa;
        vm.newLoja = newLoja;
        vm.editModContrato = editModContrato;
        vm.editLoja = editLoja;
        vm.novaLicenca = novaLicenca;

        activate();

        function activate() {
            var promises = [getEmpresa(),getLojas(),getModContrato(),getLicenca()];
            return $q.all(promises).then(function() {
                logger.info('Janela Configurações Ativada');
            });            
            
        }

        function getEmpresa() {
            EmpresaService.load().then(function(data){
              vm.empresa = data.reg[0];            
            });            
        } 

        function getLojas(){
            LojasService.read('').then(function(lojas){
                vm.lojas = lojas.reg;
            });
        }
        vm.uploader.onSuccessItem = function(item, response, status, headers) {
            if (response.status === 'ok') {
                vm.empresa.id_galeria = response.last_insert;
                vm.empresa.logo = response.imagem;
            } else {
                logger.error(response.msg);
            }
        };        

        function getModContrato() {
            ModContratoService.load().then(function(cont){
                vm.modContrato = cont.reg[0].contrato;
            });
        }

        function getLicenca() {
            var data = {
                valido:true,
            };
            LicencasService.read(data).then(function (resp) {
                vm.licenca = resp.reg;
            });
        }

        function novaLicenca() {
            var modalInstance = $uibModal.open({
              templateUrl: 'app/licenca/templates/licenca-paga-modal.html',
              controller: controllModel,
              controllerAs: 'vm',              
              size: 'lg',
              backdrop:true,
            });
            controllModel.$inject = ['$uibModalInstance','LicencaFuncService'];
            function controllModel($uibModalInstance,LicencaFuncService){
                var vm = this;
                vm.icon = 'fa-shopping-cart'

                vm.modal = true;

                vm.ok = ok;
                vm.cancel = cancel;
                vm.funcoes = new LicencaFuncService.funcoes();
                activate();

                function activate() {
                    var promises = [
                        vm.funcoes.loadEmpresa(),
                        vm.funcoes.getPlanos(),
                    ]
                    $q.all(promises);
                }

                function ok(loja){
                    $uibModalInstance.close();
                };

                function cancel(){
                    $uibModalInstance.dismiss();
                };
            }
            modalInstance.result.then(function () {
                getLicenca();
            });
        }

        function newLoja() {
            var modalInstance = $uibModal.open({
              templateUrl: 'app/empresa/templates/cadastro-loja.html',
              controller: controllModel,
              controllerAs: 'vm',
              size: '',
              backdrop:true
            });
            controllModel.$inject = ['$uibModalInstance'];
            function controllModel($uibModalInstance){
                var vm = this;

                vm.ok = ok;
                vm.cancel = cancel;

                function ok(loja){
                    $uibModalInstance.close();
                    LojasService.create(loja).then(function(){
                        getLojas();
                    });
                };

                function cancel(){
                    $uibModalInstance.dismiss();
                };
            }
        }

        function editLoja(l) {
            var data = {
                loja:l,
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/empresa/templates/cadastro-loja.html',
              controller: controllModel,
              controllerAs: 'vm',              
              size: '',
              backdrop:true,
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
            controllModel.$inject = ['Data','$uibModalInstance'];
            function controllModel(Data,$uibModalInstance){
                var vm = this;

                vm.loja = Data.loja;
                vm.ok = ok;
                vm.cancel = cancel;

                function ok(loja){
                    $uibModalInstance.close();
                    LojasService.update(loja).then(function(){
                        getLojas();
                    });
                };

                function cancel(){
                    $uibModalInstance.dismiss();
                };
              }
        }

        function editEmpresa() {
          EmpresaService.update(vm.empresa).then(function(data){

          });
        }

        function editModContrato(modelo) {
            var mod = {
                id_empresa:vm.empresa.id_empresa,
                contrato:modelo,
            };
            ModContratoService.update(mod).then(function(data){

            });
        }
    }
})();
