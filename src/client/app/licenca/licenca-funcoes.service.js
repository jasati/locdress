(function() {
    'use strict';
    angular
        .module('app.licenca')
        .service('LicencaFuncService', LicencaFuncService);
    LicencaFuncService.$inject = ['$state','$q','$uibModal','LicencasService','PlanosService','EmpresaService','UtilsFunctions','DataserviseProvider'];
    /* @ngInject */
    function LicencaFuncService($state,$q,$uibModal,LicencasService,PlanosService,EmpresaService,UtilsFunctions,DataserviseProvider) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
        	var vm = this;
	        vm.title = 'Licencas';
	        vm.licencas = [];
	        vm.planos = [];
	        vm.empresa = {};
	        vm.salvando = false;
	        vm.validade = DataserviseProvider.indexGeral.validade_licenca;

	        vm.convDate = function (date) {
	          var dt = new Date(date);
	          return dt;
	        }

	        vm.loadEmpresa = function () {
	        	vm.empresa = DataserviseProvider.userLogado.empresa;
	        }

	        vm.getLicenca = function () {
	            var data = {
	                valido:true,
	            };
	            LicencasService.read(data).then(function (resp) {
	                vm.licenca = resp.reg;
	            });
	        }

	        vm.getValidade = function () {
	        	LicencasService.readValidade().then(function (lic) {
	        		vm.validade = lic.reg[0].dias_restante;
	        		DataserviseProvider.indexGeral.validade_licenca = lic.reg[0].dias_restante;
	        	});
	        }

	        vm.salvar = function (empresa) {
	        	if (!vm.salvando) {
	        		vm.atualizaEmpresa(empresa);
	        	}
	        }

	        vm.atualizaEmpresa = function (empresa) {
	        	vm.salvando = true;
	        	EmpresaService.update(empresa).then(function (respEmp) {
	        		if (respEmp.status == 'ok') {
	        			vm.criarLicencaTeste();
	        		}
	        	});
	        }

	        vm.criarLicencaTeste = function() {
	        	UtilsFunctions.getDataServe().then(function (resp) {
		        	var licenca = {
		        		id_empresa:DataserviseProvider.indexGeral.id_emp,
		        		id_plano:1,//plano teste
		        		data_ativo:resp.data,
		        		valida:1,
		        	};
		        	LicencasService.create(licenca).then(function (respLic) {
		        		if (respLic.status == 'ok') {
		        			$state.go('shell.dashboard');
		        		}
		        		vm.salvando = false;
		        	});
	        	});
	        }

	        vm.getPlanos = function () {
	        	PlanosService.read().then(function (respPlano) {
	        		vm.planos = respPlano.reg;
	        	});
	        }

	        vm.novaLicenca = function() {
	            var modalInstance = $uibModal.open({
	              templateUrl: 'app/licenca/templates/licenca-paga-modal.html',
	              controller: controllModel,
	              controllerAs: 'vm',
	              size: 'lg',
	              backdrop:'static',
	              resolve: {
	                Data: function () {
	                  return vm;
	                }
	              }	              
	            });
	            controllModel.$inject = ['Data','$uibModalInstance','LicencaFuncService'];
	            function controllModel(Data,$uibModalInstance,LicencaFuncService){
	                var vm = this;
	                vm.icon = 'fa-certificate'

	                vm.modal = true;

	                vm.ok = ok;
	                vm.cancel = cancel;
	                vm.funcoes = Data;
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
	                vm.getValidade();
	            });
	        }
        }
    }
})();