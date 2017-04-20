(function() {
    'use strict';
    angular
        .module('app.licenca')
        .service('LicencaFuncService', LicencaFuncService);
    LicencaFuncService.$inject = ['$state','$q','LicencasService','PlanosService','EmpresaService','UtilsFunctions','DataserviseProvider'];
    /* @ngInject */
    function LicencaFuncService($state,$q,LicencasService,PlanosService,EmpresaService,UtilsFunctions,DataserviseProvider) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
        	var vm = this;
	        vm.title = 'Licencas';
	        vm.licencas = [];
	        vm.planos = [];
	        vm.empresa = {};
	        vm.salvando = false;

	        vm.convDate = function (date) {
	          var dt = new Date(date);
	          return dt;
	        }

	        vm.loadEmpresa = function () {
	        	vm.empresa = DataserviseProvider.userLogado.empresa;
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
        }
    }
})();