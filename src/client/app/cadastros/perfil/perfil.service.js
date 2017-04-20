(function() {
    'use strict';
    angular
        .module('cad.perfil')
        .factory('PerfilService', PerfilService);
    PerfilService.$inject = ['$q','$uibModal','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function PerfilService($q,$uibModal,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = " id_perfil, id_empresa, nome";
        
        var perfils = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            perfils      : perfils,
            cadPerfil    : cadPerfil
        };
        return service;
        ////////////////
        function startDataset() { 
            var dataset = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','perfils');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_perfil');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            return dataset;
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do perfil';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.id_perfil !== undefined && prmConsulta.id_perfil !== "") {
                consulta += " and id_perfil = "+prmConsulta.id_perfil;
            }
            if (prmConsulta.nome !== undefined && prmConsulta.nome !== "") {
                consulta += " and nome LIKE '%"+prmConsulta.nome+"%'";
            }
            var dataset = startDataset();
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta === "") {perfils = data;}
                	return data;
           		 });
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do perfil.';
            var msgSucess = 'Inclusão do perfil realizada com sucesso!';
            var action = 'novo';
            if (!data.id_empresa) {
                data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            }
            var dataset = startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do perfil.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            var dataset = startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_perfil);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do perfil.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var dataset = startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_perfil);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }

        /////////////////////////////////////////////

        function cadPerfil() {
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/perfil/templates/perfil-cadastro.html',
              controller: 'PerfilModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Data: function () {
                  return perfils.reg;
                }
              }                          
            });
            return modalInstance.result.then(function (data) {
                return data;
            });
        }        
    }
})();