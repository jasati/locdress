(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['config','$state','$q', '$uibModal', 'dataservice', 'DataserviseProvider', 'logger','EmpresaService', 'ReservaService','RecService','ResItensService','LicencasService','LicencaFuncService'];
    /* @ngInject */
    function DashboardController(config,$state,$q,$uibModal, dataservice, DataserviseProvider, logger,EmpresaService, ReservaService,RecService,ResItensService,LicencasService,LicencaFuncService) {
        var vm = this;
        vm.news = {
            title: 'Base Sistema',
            description: 'Base Inicial para criação de Sistemas'
        };
        var dataset = DataserviseProvider.getPrmWebService();
        vm.icon = {
          reserva:'fa-bar-chart',
          recebimento:'fa-line-chart',
        };
        vm.messageCount = 0;
        vm.empresa = [];
        vm.title = 'Dashboard';
        vm.periodoChart = ['hora','dia','semana','mes','ano'];
        vm.opitionChartColor = ['#99e699', '#FF5252'];
        vm.qtTrajesAjustar = 0;
        vm.qtTrajesRet = 0;
        vm.qtTrajesNoDev = 0;

        vm.getDadosChart = getDadosChart;
        vm.getTrajes = getTrajes;

        vm.chart = {
          dataIni:'',
          dataFim:'',
          dataGr:'',
          periodo:'hora',
        };

        vm.chartCx = {
          dataIni:'',
          dataFim:'',
        };
        vm.chartIm = {
          dataIni:'',
          dataFim:'',
        };

        activate();

        function activate() {
          verificarLicenca();
        }

        function verificarLicenca() {
          LicencasService.readValidade().then(function (lic) {
            if (lic.qtde > 0 ) {
              if (lic.reg[0].valida == 1 || lic.reg[0].vitalicio == 1) {
                DataserviseProvider.indexGeral.validade_licenca = 1;
                var promises = [
                  getEmpresa(),
                  dataPadrao(),
                  getDadosChart(),
                  getTrajes('aAjust',false),
                  getTrajes('aRet',false),
                  getTrajes('noDev',false)
                ];
                return $q.all(promises).then(function() {
                    logger.success(config.appTitle + ' Carregado! \n Versão '+config.versao);
                });

              } else {
                DataserviseProvider.indexGeral.validade_licenca = 0;
                var licenca = new LicencaFuncService.funcoes();
                licenca.novaLicenca();
              }
            } else {
                $state.go('licenca_teste');
            }

          });
        }


        function getEmpresa() {
            EmpresaService.load().then(function (data) {
                vm.empresa = data.reg[0];
            });
        }

        function dataPadrao () {
          var dtIni = new Date();
          var dtFim = new Date();
          dtIni.setDate(1);
          vm.chart.dataIni = dtIni;
          vm.chart.dataFim = dtFim;
          vm.chartCx.dataIni = dtIni;
          vm.chartCx.dataFim = dtFim;
          vm.chartIm.dataIni = dtIni;
          vm.chartIm.dataFim = dtFim;
        }

        function getDadosChart() {
          vm.chartReservas = {
            data : [],
            labels : [],
            series : ['Qtde. de Reservas'],
          }; 
          vm.chartRec = {
            data : [],
            labels : [],
            series : ['Total de Recebimentos'],
          };          
          var prm = {
            dtini:vm.chart.dataIni,
            dtfim:vm.chart.dataFim,
          };
          ReservaService.loadDataChart(prm).then(function(res) {
            //inserido as datas das reservas encontradas
            angular.forEach(res.reg, function(value, key){
              if (!existe(value.data,vm.chartReservas.labels)) {
                vm.chartReservas.labels.push(value.data);
              }
            });

            //inserir os dados vinculado a cada label
            for (var l = 0; l < vm.chartReservas.labels.length; l++) {
              var qt = 0;
              for (var i = 0; i < res.reg.length; i++) {
                if (res.reg[i].data === vm.chartReservas.labels[l]) {
                  qt = res.reg[i].qt_res
                  break;
                }
              }
              addIndex(vm.chartReservas.data,0,qt);
            }
          });

          RecService.loadDataChart(prm).then(function(rec) {
            //inserindo as datas dos recebimentos encontrados
            angular.forEach(rec.reg, function(value, key){
              if (!existe(value.data,vm.chartRec.labels)) {
                vm.chartRec.labels.push(value.data);
              }
            });

            //inserir os dados vinculado a cada label
            for (var l = 0; l < vm.chartRec.labels.length; l++) {
              var valor = 0;
              for (var x = 0; x < rec.reg.length; x++) {
                if (rec.reg[x].data === vm.chartRec.labels[l]) {
                  valor = rec.reg[x].total_rec;
                  break;
                }
              }
              addIndex(vm.chartRec.data,0,valor);
            }

          });          
        }

        function existe(index,array) {
          var x = false;
          for (var i = 0; i < array.length; i++) {
            if (array[i] == index) {
              return true;
            }
          }
          return x;
        }
        function addIndex(array,index,valor) {
          if (!array[index]) {
            array[index] = [valor];
          } else {
            array[index].push(valor);
          }
          return array[index];
        }

        function getTrajes(info,showForm) {
          var dt = new Date();
          switch (info){
            case 'aAjust':
              dt.setDate(dt.getDate()+1);
              var prm = {
                serAjustado:true,
                dataSerAjust:dt,
              };
              ResItensService.read(prm).then(function(t) {
                if (showForm) {
                  showTrajes(t.reg,dt,'Trajes Para ser Ajustados','fa-cut','bred');
                } else {
                  vm.qtTrajesAjustar = t.qtde;
                }
              });
              break;
            case 'aRet':
              var prm = {
                serRetirado:true,
                dataSerRet:dt,
              };
              ResItensService.read(prm).then(function(t) {
                if (showForm) {
                  showTrajes(t.reg,dt,'Trajes a ser Retirados','fa-upload','borange');
                } else {
                  vm.qtTrajesRet = t.qtde;
                }
              });
              break;
            case 'noDev':
              var prm = {
                naoDevolvido:true,
              };
              ResItensService.read(prm).then(function(t) {
                if (showForm) {
                  showTrajes(t.reg,dt,'Trajes Não Devolvidos','fa-download','bviolet');
                } else {
                  vm.qtTrajesNoDev = t.qtde;
                }
              });
              break;
          }
        }

        function showTrajes(trajes,dt,title,icon,cor) {
          var data = {
            trajes:trajes,
            data:dt,
            title:title,
            icon:icon,
            cor:cor,
          };
          var modalRetirar = $uibModal.open({
            templateUrl: 'app/sistema/reservas/templates/form-lista-trajes.html',
            controller: controllModal,
            controllerAs: 'vm',
            size: '',
            backdrop:false,
            resolve: {
              Data: function () {
                return data;
              }
            }
          });
          controllModal.$inject = ['$uibModalInstance','Data','config','ItemService','$filter'];
          function controllModal($uibModalInstance,Data,config,ItemService,$filter) {
            var vm = this;
            vm.title = Data.title;
            vm.icon = Data.icon;
            vm.pathImg = config.urlImagem;
            vm.zoomImg  = ItemService.zoomImg;
            vm.calendar = Data.data;
            vm.trajes = Data.trajes;
            vm.color = Data.cor;
            vm.popover = {
              templateUrl: 'app/sistema/reservas/templates/popover-reserva.html',
              title: 'Informações Sobre o Contrato',
            };

            vm.cancel = cancel;
            vm.convDate = convDate;
            vm.openReserva = openReserva;

            function openReserva(index) {
              cancel();
              var prm = {
                  id_reserva:index.id_reserva,
              };
              ReservaService.read(prm).then(function (res) {
                var data = {
                    reserva:res.reg[0],
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
              });
            }

            function convDate (date) {
              var dt = new Date(date);
              return dt;
            }
            function cancel() {
              $uibModalInstance.dismiss('cancel');
            }            
          }
        }

    }
})();
