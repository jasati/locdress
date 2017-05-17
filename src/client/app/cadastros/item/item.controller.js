(function () {
    'use strict';

    angular
        .module('cad.item')
        .controller('ItemController', ItemController);

    ItemController.$inject = ['$q', '$uibModal', 'logger', 'ItemService', 'routerHelper','CategoriaService','SubCategoriaService','DataserviseProvider','LicencaFuncService'];
    /* @ngInject */
    function ItemController($q, $uibModal, logger, ItemService, routerHelper,CategoriaService,SubCategoriaService,DataserviseProvider,LicencaFuncService) {
        var vm = this;

        vm.title = 'Cadastro de Trajes';
        vm.icon = 'fa-street-view';
        vm.subtitle = 'Cadastrar os trajes para locação.';        
        vm.itens = [];
        vm.categorias = [];
        vm.subcategorias = [];
        vm.lojas = ItemService.getLojas;
        vm.consulta = {descricao:"",status:1,codigo:"",id_categoria:"",id_subcategoria:"",avancado:false};
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.popover = {
          templateUrl: 'app/cadastros/item/templates/pesquisa.html',
          title: 'Pesquisa Avançada'
        }; 
        vm.validadeLic = DataserviseProvider.indexGeral.validade_licenca;
        vm.permissao = ItemService.verificarPermissao;
        vm.getItem = getItem;
        vm.getCategorias = getCategorias;
        vm.getSubCategorias = getSubCategorias;
        vm.editItem = editItem;
        vm.newItem = newItem;
        vm.deleteItem = deleteItem;
        vm.setPage = setPage;
        vm.pesquisaAvancada = pesquisaAvancada;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.cadCategoria = cadCategoria;
        vm.cadSubCategoria = cadSubCategoria;
        vm.pesquisa = pesquisa;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
            $q.all([vm.permissao(5)]).then(function(data){
              if (data) {
                var promises = [ItemService.startDataset(), getItem(),getCategorias(),getSubCategorias()];
                return $q.all(promises).then(function() {
                    logger.info('Janela Item Ativada');
                }); 
              } else {
                logger.warning('Acesso Negado!');
              }
            });
        }
        function novaLicenca() {
            var licenca = new LicencaFuncService.funcoes();
            licenca.novaLicenca();
        }        

        function getItem() {
            ItemService.read(vm.consulta,getLimite()).then(function(data){
              vm.itens = data.reg;
              vm.totalReg = data.qtde;              
            });            
        } 

        function getCategorias() {
            CategoriaService.read(vm.consulta).then(function(data){
              vm.categorias = data.reg;
            });            
        }    

        function getSubCategorias() {
            SubCategoriaService.read(vm.consulta).then(function(data){
              vm.subcategorias = data.reg;
            });            
        }  

        function pesquisaAvancada() {
          vm.consulta.avancado = true;
          getItem();
        }
        function limparPesqAvancada() {
          vm.consulta.status = 1;
          vm.consulta.codigo = "";
          vm.consulta.id_categoria = "";
          vm.consulta.id_subcategoria = "";
          // body...
        }

        function newItem() {
          if (vm.validadeLic > 0) {
            if (vm.permissao(6)) {
              var item = {};
              item.id_empresa = 0;
              item.id_loja = ItemService.getLoja.lojaAtual.id_loja;
              item.status = 1;
              var data = {
                item:item,
                categorias:vm.categorias,
                subcategorias:vm.subcategorias,
                lojas:vm.lojas,
                action:'new',
              };
              var modalInstance = $uibModal.open({
                templateUrl: 'app/cadastros/item/templates/item-cadastro.html',
                controller: 'ItemModalController',
                controllerAs: 'vm',
                size: '',
                backdrop:'static',
                resolve: {
                  Data: function () {
                    return data;
                  }
                }              
              });
              
              modalInstance.result.then(function (save) {
                getItem();
              });
            }
          } else {
            novaLicenca();
          }
        }   

        function editItem(index) {
          if (vm.validadeLic > 0) {
            if (vm.permissao(7)) {
            var data = {
              item:index,
              categorias:vm.categorias,
              subcategorias:vm.subcategorias,
              lojas:vm.lojas,
              action:'edit',
            };
              var modalInstance = $uibModal.open({
                templateUrl: 'app/cadastros/item/templates/item-cadastro.html',
                controller: 'ItemModalController',
                controllerAs: 'vm',
                size: '',
                backdrop:'static',
                resolve: {
                  Data: function () {
                    return data;
                  }
                }              
              });
              
              modalInstance.result.then(function (save) {
                getItem();
              });
            }
          } else {
            novaLicenca();
          }

        }


         function deleteItem(index) {
          if (vm.permissao(6)) {
            var data = {item:index};
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/item/templates/delete.html',
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

            controllModal.$inject = ['$uibModalInstance','Data']
            function controllModal($uibModalInstance,Data) {
              var vm = this;
              vm.item = Data.item;

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(item) {
                ItemService.deletar(item).then(function(data){
                  getItem();
                });
                $uibModalInstance.close(item);
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
          }
        }

         function pesquisa() {
          var data = {
            consulta:vm.consulta,
            categorias:vm.categorias,
            subcategorias:vm.subcategorias
          };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/item/templates/pesquisa.html',
              controllerAs: 'vm',
              controller: controllModal,
              size: '',
              backdrop:false,
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });

            controllModal.$inject = ['$uibModalInstance','Data']
            function controllModal($uibModalInstance,Data) {
              var vm = this;
              vm.consulta = Data.consulta;
              vm.categorias = Data.categorias;
              vm.subcategorias = Data.subcategorias;

              vm.ok = ok;
              vm.cancel = cancel;
              vm.limpar = limpar;

              function limpar (){
                limparPesqAvancada();
              }

              function ok() {
                getItem();
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
        }        

        function cadCategoria() {
          if (vm.permissao(8)) {
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/categorias/templates/categoria-cadastro.html',
              controller: 'CategoriaModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Categorias: function () {
                  return vm.categorias;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {
              getCategorias();
            });
          }
        }

        function cadSubCategoria() {
          if (vm.permissao(9)) {
            var data = {
              categorias : vm.categorias,
              subcategorias:vm.subcategorias
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/subcategorias/templates/subcategoria-cadastro.html',
              controller: 'SubCategoriaModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Data: function () {
                  return data;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {
              getSubCategorias();
            });
          }
        }


        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getItem();
        }

    }
})();
