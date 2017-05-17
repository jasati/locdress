(function () {
    'use strict';

    angular
        .module('sis.reserva')
        .controller('ReservaController', ReservaController);

    ReservaController.$inject = ['$q','$filter', '$uibModal', 'logger', 'ReservaService', 'routerHelper','UtilsFunctions', 'ResItensService','DataserviseProvider','LicencaFuncService'];
    /* @ngInject */
    function ReservaController($q,$filter, $uibModal, logger, ReservaService, routerHelper,UtilsFunctions, ResItensService,DataserviseProvider,LicencaFuncService) {
        var vm = this;
        vm.title = 'Reservas de Trajes';
        vm.icon = 'fa-calendar-check-o';
        vm.subtitle = 'Inicie o processo de locação de trajes aqui.';
        vm.reservas = [];
        vm.validadeLic = DataserviseProvider.indexGeral.validade_licenca;
        vm.id_usuario = ReservaService.userLogado.id_usuario;
        vm.consulta = {
          id_reserva:"",
          id_cliente:"",
          cliente:"",
          resp_reserva:"",
          dt_res_ini:null,
          dt_res_fim:null,
          dt_ret_ini:null,
          dt_ret_fim:null,
          dt_eve_ini:null,
          dt_eve_fim:null,
          status:"",
          avancado:false
        };
        vm.popover = {
          templateUrl: 'app/sistema/reservas/templates/pesquisa.html',
          title: 'Pesquisa Avançada',
          open:false
        }; 

        vm.getRes = getRes;
        vm.consultaTrajes = consultaTrajes;
        vm.editRes = editRes;
        vm.newRes = newRes;
        vm.deleteRes = deleteRes;
        vm.setPage = setPage;
        vm.pesquisaAvancada = pesquisaAvancada;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.getTrajes = getTrajes;
        vm.soma = UtilsFunctions.soma;
        vm.permissao = ReservaService.verificarPermissao;
        vm.convDate = convDate;
        vm.retTrajesRes = retTrajesRes;
        vm.devTrajes = devTrajes;
        vm.pesquisa = pesquisa;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
          $q.all([vm.permissao(14)]).then(function(data) {
            if (data) {
              var promises = [dataPadrao(),getRes()];
              return $q.all(promises).then(function() {
                  logger.info('Janela Reservas Ativada');
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

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getTrajes(idReserva) {
          var itens = [];
          return ResItensService.read(idReserva).then(function(i) {
            itens = i.reg;
            return itens;
          });
        }

        function dataPadrao() {
          var dataIni = new Date();
          var dataFim = new Date();
          dataIni.setDate(1);
          vm.consulta.dt_res_ini = dataIni;
          vm.consulta.dt_res_fim = dataFim;
        }

        function getRes() {
            ReservaService.read(vm.consulta,getLimite()).then(function(data){
              vm.reservas = data.reg;
              vm.totalReg = data.qtde; 
            });            
        } 

        function pesquisaAvancada() {
          vm.consulta.avancado = true;
          getRes();
        }

        function limparPesqAvancada() {
          vm.consulta = {
            id_reserva:"",
            id_cliente:"",
            cliente:"",
            resp_reserva:"",
            dt_res_ini:null,
            dt_res_fim:null,
            dt_ret_ini:null,
            dt_ret_fim:null,
            dt_eve_ini:null,
            dt_eve_fim:null,
            status:"",
            avancado:false
          };
          dataPadrao();
        }


        function newRes() {
          if (vm.validadeLic > 0) {
            var data = {
              action:'create',
            }
            var modalConsulta = $uibModal.open({
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
            modalConsulta.result.then(function (res) {
              var data = {
                reserva:res.reserva,
                reservaItens:res.reservaItens,
                action:'create',
              };
              var novaReserva = $uibModal.open({
                templateUrl:'app/sistema/reservas/templates/reserva-cadastro.html',
                controller:'ResModalController',
                controllerAs:'vm',
                size:'',
                backdrop:'static',
                resolve: {
                  Data: function () {
                    return data;
                  }
                }
              });
              novaReserva.result.then(function () {
                getRes();
              });

            });
          } else {
            novaLicenca();
          }

        } 

        function consultaTrajes() {
          var data = {
            action:'consulta',
          }
          var modalConsulta = $uibModal.open({
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
        }


        function editRes(index) {
          if (vm.validadeLic > 0) {
            var data = {
                reserva:index,
                action:'update',            
            };
            var modalReserva = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/reserva-cadastro.html',
              controller: 'ResModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
            
            modalReserva.result.then(function (save) {
              getRes();
            });
          } else {
            novaLicenca();
          }


        }


         function deleteRes(index) {
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
              vm.subtitle = 'Confirma a exclusão da reserva do Cliente : ';
              vm.destacar = vm.data.cliente;
              vm.corBtnClose = 'btn-danger';
              vm.corBtnCancel = 'btn-primary';
              vm.txtBtnClose = 'Confirmar';
              vm.txtBtnCancel = 'Cancelar';

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(del) {
                ReservaService.deletar(del).then(function(data){
                  if (data.status === "ok") {
                    getRes();
                  }
                });
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }
        }

        function retTrajesRes(reserva) {
          if (vm.validadeLic > 0) {
            var data = {
              reserva:reserva,
            };
            var modalRetirar = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/reserva-retirar.html',
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
            controllModal.$inject = ['$uibModalInstance','Data','UsuarioService','ResItensService','config','ItemService'];
            function controllModal($uibModalInstance,Data,UsuarioService,ResItensService,config,ItemService) {
              var vm = this;
              vm.title = 'Retirar Trajes Reservado';
              vm.icon = 'fa-upload';              
              vm.reserva = Data.reserva;
              vm.pathImg = config.urlImagem;
              vm.zoomImg  = ItemService.zoomImg;
              vm.ok = ok;
              vm.cancel = cancel;
              vm.receber = receber;


              activate();

              function activate() {
                  var promises = [getUsuarios(),getTrages()];
                  return $q.all(promises);
              }

              function getUsuarios() {
                UsuarioService.read().then(function(result) {
                  vm.usuarios = result.reg;
                });
              }

                function receber() {
                  var dt = new Date();
                  var rec = {
                      id_loja:vm.reserva.id_loja,
                      id_reserva:vm.reserva.id_reserva,
                      cliente:vm.reserva.cliente,
                      data_rec:dt,
                  };
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
                  modalRecebimento.result.then(function (rec) {
                    vm.reserva.total_rec+=rec.valor;
                  });
                }            

              function getTrages() {
                var prm = {
                    id_reserva:vm.reserva.id_reserva,
                }
                ResItensService.read(prm).then(function (res) {
                    vm.trajes = res.reg;
                });
              }

              function ok() {
                vm.reserva.status = 1;//retirado
                ReservaService.update(vm.reserva).then(function(data){
                  if (data.status === "ok") {
                    $uibModalInstance.close();
                  }
                });
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }            
            }
          } else {
            novaLicenca();
          }

        }

        function devTrajes(reserva) {
          if (vm.validadeLic > 0) {
            var data = {
              reserva:reserva,
            };
            var modalDevolver = $uibModal.open({
              templateUrl: 'app/sistema/reservas/templates/reserva-devolucao.html',
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
            controllModal.$inject = ['$uibModalInstance','$uibModal','Data','UsuarioService','ResItensService','config','ItemService'];
            function controllModal($uibModalInstance,$uibModal,Data,UsuarioService,ResItensService,config,ItemService) {
              var vm = this;
              vm.title = 'Devolução de Trajes';
              vm.icon = 'fa-download';              
              vm.reserva = Data.reserva;
              vm.pathImg = config.urlImagem;
              vm.zoomImg  = ItemService.zoomImg;

              vm.ok = ok;
              vm.cancel = cancel;
              vm.salvar = salvar;
              vm.receber = receber;
              vm.printAtestDev = printAtestDev;
              vm.addNomeUser = addNomeUser;

              activate();

              function activate() {
                  var promises = [getUsuarios(),getTrages()];
                  return $q.all(promises);
              }

              function getUsuarios() {
                UsuarioService.read().then(function(result) {
                  vm.usuarios = result.reg;
                });
              }

              function addNomeUser(user) {
                vm.reserva.resp_dev = user.nome;
                vm.reserva.id_usu_rep_dev = user.id_usuario;
              }

              function getTrages() {
                var prm = {
                    id_reserva:vm.reserva.id_reserva,
                }
                ResItensService.read(prm).then(function (res) {
                    vm.trajes = res.reg;
                });
              }

              function receber() {
                var dt = new Date();
                var rec = {
                    id_loja:vm.reserva.id_loja,
                    id_reserva:vm.reserva.id_reserva,
                    cliente:vm.reserva.cliente,
                    data_rec:dt,
                };
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
                modalRecebimento.result.then(function (rec) {
                  vm.reserva.total_rec+=rec.valor;
                });
              }

              function salvar() {
                vm.reserva.status = 2;//devolvido
                ReservaService.update(vm.reserva).then(function(data){
                  if (data.status === "ok") {
                    vm.salvo = true;
                  }
                });
              }

              function printAtestDev() {
                  var data = {
                      action:'devolucao',
                      reserva:vm.reserva,
                      trajes:vm.trajes,
                  }
                  var modalAtestado = $uibModal.open({
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

              function ok() {
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }
          } else{
            novaLicenca();
          }
        }


        function pesquisa() {
          var data = {
            consulta:vm.consulta,
          };
          var modalPesquisa = $uibModal.open({
            templateUrl: 'app/sistema/reservas/templates/pesquisa.html',
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
            vm.status = [
                    {id:0,desc:"Reservado"},
                    {id:1,desc:"Retirado"},
                    {id:2,desc:"Devolvido"},
            ];
            vm.ok = ok;
            vm.cancel = cancel;
            vm.limpar = limpar;

            function limpar (){
              limparPesqAvancada();
            }

            function ok() {
              getRes();
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
        function setPage () {
            getRes();
        }

    }
})();
