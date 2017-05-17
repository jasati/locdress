(function () {
    'use strict';

    angular
        .module('sis.rec')
        .controller('RecController', RecController);

    RecController.$inject = ['$q', '$uibModal', 'logger', 'RecService', 'routerHelper', 'UtilsFunctions','DataserviseProvider','LicencaFuncService'];
    /* @ngInject */
    function RecController($q, $uibModal, logger, RecService, routerHelper, UtilsFunctions,DataserviseProvider,LicencaFuncService) {
        var vm = this;

        vm.title = 'Receber Valores';
        vm.icon = 'fa-money';
        vm.subtitle = 'Recebimentos vinculados e avulsos.';        
        vm.recebimentos = [];
        vm.lojas = RecService.getLojas;
        vm.consulta = {
          cliente:"",
          id_reserva:"",
          n_doc:"",
          data_rec_ini:null,
          data_rec_fim:null,
          avancado:false
        };
        vm.validadeLic = DataserviseProvider.indexGeral.validade_licenca;
        vm.permissao = RecService.verificarPermissao;
        vm.soma = UtilsFunctions.soma;
        vm.getRec = getRec;
        vm.editRec = editRec;
        vm.newRec = newRec;
        vm.deleteRec = deleteRec;
        vm.setPage = setPage;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.pesquisa = pesquisa;
        vm.convDate = convDate;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
          $q.all([vm.permissao(5)]).then(function(data){
            if (data) {
              var promises = [dataPadrao(),getRec()];
              return $q.all(promises).then(function() {
                  logger.info('Janela Recebimentos Ativada');
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

        function getRec() {
            RecService.read(vm.consulta,getLimite()).then(function(data){
              vm.recebimentos = data.reg;
              vm.totalReg = data.qtde;
            });
        }

        function dataPadrao() {
          var dataIni = new Date();
          var dataFim = new Date();
          dataIni.setDate(1);
          vm.consulta.data_rec_ini = dataIni;
          vm.consulta.data_rec_fim = dataFim;
        }

        function limparPesqAvancada() {
          vm.consulta = {
            cliente:"",
            id_reserva:"",
            n_doc:"",
            origem:"",
            id_tp:"",
          };
          dataPadrao();
        }

        function newRec() {
          if (vm.validadeLic > 0) {
            if (vm.permissao(6)) {
              var dt = new Date();
              var rec = {
                id_empresa: 0,
                id_loja: RecService.dadosLogin.lojaAtual.id_loja,
                data_rec: dt,
              }
              var data = {
                recebimento:rec,
                action:'create',
              };
              var modalInstance = $uibModal.open({
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
              
              modalInstance.result.then(function (save) {
                getRec();
              });
            }
          } else {
            novaLicenca();
          }

        }   

        function editRec(index) {
          if (vm.validadeLic > 0) {
            if (vm.permissao(7)) {
              var data = {
                recebimento:index,
                action:'update',
              };
              var modalInstance = $uibModal.open({
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
              modalInstance.result.then(function (save) {
                  getRec();
              });
            }
          } else {
            novaLicenca();
          }

        }

        function deleteRec(index) {
          if (vm.permissao(6)) {
            var data = {
              data:index,
            };
            var modalReserva = $uibModal.open({
              templateUrl: 'app/blocks/utils/templates/msg.html',
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
              vm.data = Data.data;
              vm.corTitle = 'bred';
              vm.title = 'Confirmar a Exclusão';
              vm.subtitle = 'Confirma a exclusão do recebimento';
              vm.destacar = '';
              vm.corBtnClose = 'btn-danger';
              vm.corBtnCancel = 'btn-primary';
              vm.txtBtnClose = 'Confirmar';
              vm.txtBtnCancel = 'Cancelar';

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(del) {
                RecService.deletar(del).then(function(data){
                  if (data.status === "ok") {
                    getRec();
                  }
                });
                $uibModalInstance.close();
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
            var modalPesquisa = $uibModal.open({
              templateUrl: 'app/sistema/recebimentos/templates/pesquisa.html',
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

            controllModel.$inject = ['$uibModalInstance','Data','TipoPgtoService']
            function controllModel($uibModalInstance,Data,TipoPgtoService) {
              var vm = this;
              vm.consulta = Data.consulta;
              vm.origem = [
                {id:1,desc:'Vinculado'},
                {id:2,desc:'Avulso'},
              ];

              vm.ok = ok;
              vm.cancel = cancel;
              vm.limpar = limpar;
              getTipoPgto();

              function getTipoPgto() {
                  TipoPgtoService.read().then(function (result) {
                      vm.tipopgtos = result.reg;
                  });
              }

              function limpar (){
                limparPesqAvancada();
              }

              function ok() {
                getRec();
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
