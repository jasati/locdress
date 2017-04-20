(function () {
    'use strict';

    angular
        .module('sis.consulta')
        .controller('ConsultaController', ConsultaController);

    ConsultaController.$inject = ['Data','$document', 'config', '$q','$filter', '$uibModal', '$uibModalInstance', 'logger', 'ConsultaService', 'routerHelper','UtilsFunctions','$aside','ResItensService', 'CategoriaService', 'SubCategoriaService','ItemService'];
    /* @ngInject */
    function ConsultaController(Data,$document, config, $q,$filter, $uibModal, $uibModalInstance, logger, ConsultaService, routerHelper,UtilsFunctions,$aside,ResItensService, CategoriaService,SubCategoriaService,ItemService) {
      var vm = this;
      vm.action = Data.action;
      vm.title = 'Consulta de Trajes';
      vm.icon = 'fa-search';
      vm.subtitle = 'Consultar Trajes Disponíveis para Locação.';
      vm.trajes = [];
      vm.categorias = [];
      vm.subcategorias = [];
      vm.trajes_selecionados = [];
      vm.infoTjRes = [];
      vm.id_usuario = ConsultaService.userLogado.id_usuario;
      vm.pathImg = config.urlImagem;
      vm.consulta = {};
      vm.popover = {
        templateUrl: 'app/sistema/consultar/templates/pesquisa.html',
        title: 'Pesquisa Avançada',
        open:false
      }; 
      vm.ok = ok;
      vm.cancel = cancel;
      vm.getTrajes = getTrajes;
      vm.getCategorias = getCategorias;
      vm.getSubCategorias = getSubCategorias;
      vm.setPage = setPage;
      vm.pesquisaAvancada = pesquisaAvancada;
      vm.limparPesqAvancada = limparPesqAvancada;
      vm.soma = UtilsFunctions.soma;
      vm.permissao = ConsultaService.verificarPermissao;
      vm.convDate = convDate;
      vm.keypress = keypress;
      vm.viewTrajesSel = viewTrajesSel;
      vm.check = check;
      vm.getInfoTraje = getInfoTraje;
      vm.showUnidades = showUnidades;
      vm.getDataPeriodo = getDataPeriodo;

      vm.totalRegPag = 15;//quantidade de registro por pagina
      vm.nPagina = 1;//numero da pagina
      vm.inicio = 0;
      vm.pesquisa = pesquisa;
      vm.zoomImg = ItemService.zoomImg;
      vm.popover = {
        templateUrl: 'app/sistema/consultar/templates/popover-info-item.html',
        title: '',
        open:false,
      };

      vm.popoverIndc = {
        templateUrl: 'popoverIndc.html',
        title: 'Seus trajes estão aqui!',
        open:false,
        again:true,
      };
      activate();

      function activate() {
        $q.all([vm.permissao(14)]).then(function(data) {
          if (data) {
            var promises = [getDataPeriodo(),getCategorias(),getSubCategorias()];
            return $q.all(promises);
          } else {
            logger.warning('Acesso Negado!');
          }
        });
      }

      function convDate (date) {
        var dt = new Date(date);
        return dt;
      }


      function pesquisa() {
        var data = {
          consulta:vm.consulta,
          categorias:vm.categorias,
          subcategorias:vm.subcategorias,
        };

        var asideInstance = $aside.open({
          templateUrl: 'app/sistema/consultar/templates/pesquisa.html',
          placement: 'left',
          controllerAs: 'vm',
          controller:controllModel,
          size: 'sm',
          resolve: {
            Data: function () {
              return data;
            }
          }
        }).result.then(function(res){
          getTrajes();
        });

        controllModel.$inject = ['Data', '$uibModalInstance'];
        function controllModel(Data, $uibModalInstance){
          var vm = this;
          vm.consulta = Data.consulta;
          vm.categorias = Data.categorias;
          vm.subcategorias = Data.subcategorias;

          vm.limpar = function(){
            limparPesqAvancada();
          }
          vm.ok = function(e){
            $uibModalInstance.close();
          };
          vm.cancel = function (e) {
            $uibModalInstance.dismiss();
          };
        };
      }

      function keypress(evt) {
        if (evt.keyCode === 13) {
          getTrajes();
        }
      }

      function getTrajes() {
          ConsultaService.read(vm.consulta,getLimite()).then(function(data){
            vm.trajes = data.reg;
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
      function getInfoTraje(t) {
        var data = {
          id_item:t.id_item,
          reservados:true,
        };
        vm.popover.title = t.descricao;
        ResItensService.read(data).then(function(data){
          vm.infoTjRes = data.reg;
        });            
      }       

      function pesquisaAvancada() {
        vm.consulta.avancado = true;
        getTrajes();
      }

      function getDataPeriodo() {
        if (Data.action === 'create') {
          var modalInstance = $uibModal.open({
            templateUrl: 'app/sistema/consultar/templates/periodo.html',
            controller: 'PeriodoController',
            controllerAs: 'vm',
            size: 'sm',
            backdrop:'static',
            keyboard:false,
          });

          modalInstance.result.then(function (res) {
            vm.consulta.dtRet = res.dtRetirada;
            vm.consulta.dtDev = res.dtDevolucao;
            vm.reserva = {
              data_retirada:res.dtRetirada,
              data_evento:res.dtEvento,
              data_devolucao:res.dtDevolucao,
            };
            getTrajes();
            vm.trajes_selecionados = [];
          });

          modalInstance.closed.then(function (argument) {
            if (vm.consulta.dtRet == null || vm.consulta.dtRet == undefined) {
              cancel();
            }
          });
        } else {
            vm.consulta.dtRet = Data.dtRetirada;
            vm.consulta.dtDev = Data.dtDevolucao;
            getTrajes();
        }
      }



      function viewTrajesSel() {
        var data = {
          trajes:vm.trajes_selecionados,
          pathImg:vm.pathImg,
        };
        var asideInstance = $aside.open({
          templateUrl: 'app/sistema/consultar/templates/trajes-sel.html',
          controllerAs: 'vm',
          placement: 'right',
          size: '',
          resolve: {
            Data: function () {
              return data;
            }
          },
          controller: controllModel
        });
        controllModel.$inject = ['Data', '$uibModalInstance','ItemService','UtilsFunctions'];
        function controllModel(Data, $uibModalInstance,ItemService,UtilsFunctions) {
            var vm = this;
            vm.trajes = Data.trajes;
            vm.pathImg = Data.pathImg;

            vm.soma = UtilsFunctions.soma;
            vm.rem = rem;
            vm.zoomImg  = ItemService.zoomImg;
            vm.ok = ok;
            vm.cancel = cancel;
            vm.validarDesc = validarDesc;

            function validarDesc(traje,valor) {
                if (valor < traje.valor_min.toFixed(2)) {
                    return "O valor máximo de desconto é "+traje.valor_min.toFixed(2);
                };
            }

            function  rem(t) {
              remTraje(t);
            };

            function ok(e){
              $uibModalInstance.close();
            };
            function cancel(e) {
              $uibModalInstance.dismiss();
            };
        }
        asideInstance.result.then(function () {
          ok();
        });
      }

      function showUnidades(traje) {
        if (vm.action==='create') {
          var data = {
            traje:traje,
            consulta:vm.consulta,
            pathImg:vm.pathImg,
            action:vm.action,
          };
          var unidadesInstance = $uibModal.open({
            templateUrl: 'app/sistema/consultar/templates/traje-unidades.html',
            controllerAs: 'vm',
            size: '',
            resolve: {
              Data: function () {
                return data;
              }
            },
            controller: controllModel
          });
          controllModel.$inject = ['$filter','Data', '$uibModalInstance','ConsultaService','ItemService'];
          function controllModel($filter,Data, $uibModalInstance, ConsultaService,ItemService) {
              var vm = this;
              vm.action = Data.action;
              vm.traje = Data.traje;
              vm.pathImg = Data.pathImg;

              vm.zoomImg  = ItemService.zoomImg;
              vm.ok = ok;
              vm.cancel = cancel;
              vm.showDataCompra = showDataCompra;

              //////////
              activate();

              function activate() {
                var promises = [getUnidades()];
                return $q.all(promises);
              }

              function showDataCompra(u) {
                if (u.data_compra) {
                  return 'Esse traje foi adquirido em '+$filter('date')(u.data_compra,'dd/MM/yyyy');
                } else {
                  return 'Data em que foi adquirido não foi informado.';
                }
              }

              function getUnidades() {
                var consulta = {
                  id_item:vm.traje.id_item,
                  dtDev:Data.consulta.dtDev,
                  dtRet:Data.consulta.dtRet,
                };
                ConsultaService.readAtrb(consulta).then(function (unids) {
                  vm.unidades = unids.reg;
                });
              }

              function ok(u){
                if (vm.action == 'create') {
                  addTraje(u);
                  $uibModalInstance.close();
                }
              }

              function cancel(e) {
                $uibModalInstance.dismiss();
              }

          }
          unidadesInstance.result.then(function () {
            if (vm.popoverIndc.again) {
              vm.popoverIndc.open = true;
            }
          });
        }
      }

      function check(t,i) {
        if (t.check) {
          remTraje(t,i);
        } else {
          addTraje(t);
        }
      }

      function addTraje(t) {
        var jaIns = false;
        if ((t.qt - t.qt_reservado)>0) {
            for (var i = 0; i < vm.trajes_selecionados.length; i++) {
              if (vm.trajes_selecionados[i].id_ia === t.id_ia){
                jaIns = true;
                break;
              }
            }
          if (!jaIns) {
            vm.trajes_selecionados.push(t);
          } else {
            logger.warning('Esse traje já foi inserido!');
          }          
        }

      }

      function remTraje(t) {
        for (var i = 0; i < vm.trajes_selecionados.length; i++) {
          if(vm.trajes_selecionados[i].id_ia === t.id_ia){
            vm.trajes_selecionados.splice(i,1);
            break;
          }
        }
      }        

      function limparPesqAvancada() {
        vm.consulta = {
          id_item:"",
          id_loja:"",
          descricao:"",
          ref:"",
          id_subcategoria:"",
          id_categoria:"",
          avancado:false
        };
        getTrajes();
      }

      function getLimite() {
          vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
          return vm.inicio +','+vm.totalRegPag;
      }
      function setPage () {
          getRes();
      }

      function ok() {
          var data = {
            reserva:vm.reserva,
            reservaItens:vm.trajes_selecionados,
          };
          $uibModalInstance.close(data);
      }
      function cancel(){
        $uibModalInstance.dismiss('cancel');
      }


    }
})();
