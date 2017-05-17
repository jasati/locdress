(function () {
    'use strict';

    angular
        .module('cad.cliente')
        .controller('ClienteController', ClienteController);

    ClienteController.$inject = ['$q', '$uibModal', 'logger', 'ClienteService', 'routerHelper','LicencaFuncService','DataserviseProvider'];
    /* @ngInject */
    function ClienteController($q, $uibModal, logger, ClienteService, routerHelper,LicencaFuncService,DataserviseProvider) {
        var vm = this;

        vm.title = 'Cadastro de Clientes';
        vm.icon = 'fa-group';
        vm.subtitle = 'Cadastrar os Clientes.';        
        vm.clientes = [];
        vm.lojas = ClienteService.getLojas;
        vm.consulta = {nome:"",codigo:"",apelido:"",id_loja:"",avancado:false};
        vm.validadeLic = DataserviseProvider.indexGeral.validade_licenca;

        vm.permissao = ClienteService.verificarPermissao;
        vm.getCliente = getCliente;
        vm.editCliente = editCliente;
        vm.newCliente = newCliente;
        vm.deleteCliente = deleteCliente;
        vm.setPage = setPage;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.pesquisa = pesquisa;
        vm.convDate = convDate;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();
        function novaLicenca() {
            var licenca = new LicencaFuncService.funcoes();
            licenca.novaLicenca();
        }

        function activate() {
          $q.all([vm.permissao(5)]).then(function(data){
            if (data) {
              var promises = [getCliente()];
              return $q.all(promises).then(function() {
                  logger.info('Janela Cliente Ativada');
              }); 
            } else {
              logger.warning('Acesso Negado!');
            }
          });
        }

        function getCliente() {
            ClienteService.read(vm.consulta,getLimite()).then(function(data){
              vm.clientes = data.reg;
              vm.totalReg = data.qtde;
            });
        }

        function limparPesqAvancada() {
          vm.consulta.codigo = "";
          vm.consulta.nome = "";
          vm.consulta.apelido = "";
          // body...
        }

        function newCliente() {
          if (vm.validadeLic > 0) {
            if (vm.permissao(6)) {
              var cliente = {};
              cliente.id_empresa = 0;
              cliente.id_loja = ClienteService.getLoja.lojaAtual.id_loja;
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
              
              modalInstance.result.then(function (save) {
                getCliente();
              });
            }
          } else {
            novaLicenca();
          }

        }   

        function editCliente(index) {
          if (vm.validadeLic > 0) {
            if (vm.permissao(7)) {
              var data = {
                cliente:index,
                lojas:vm.lojas,
                action:'update',
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

              modalInstance.result.then(function (save) {
                  getCliente();
              });
            }
          } else {
            novaLicenca();
          }

        }


         function deleteCliente(index) {
          if (vm.permissao(6)) {
            var data = {cliente:index};
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/cliente/templates/delete.html',
              controllerAs: 'vm',
              controller: controllModel,
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
            controllModel.$inject = ['$uibModalInstance','Data']
            function controllModel($uibModalInstance,Data) {
              var vm = this;
              vm.cliente = Data.cliente;

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(cliente) {
                ClienteService.deletar(cliente).then(function(data){
                  getCliente();
                });
                $uibModalInstance.close(cliente);
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
          };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/cliente/templates/pesquisa.html',
              controllerAs: 'vm',
              controller: controllModel,
              size: '',
              backdrop:false,
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });

            controllModel.$inject = ['$uibModalInstance','Data']
            function controllModel($uibModalInstance,Data) {
              var vm = this;
              vm.consulta = Data.consulta;

              vm.ok = ok;
              vm.cancel = cancel;
              vm.limpar = limpar;

              function limpar (){
                limparPesqAvancada();
              }

              function ok() {
                getCliente();
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getCliente();
        }

    }
})();
