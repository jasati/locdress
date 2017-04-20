(function() {
    'use strict';
    angular
        .module('cad.modulos')
        .factory('ModulosService', ModulosService);
    ModulosService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ModulosService(dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "id_modulo,nome,id_mg";
        var dataset = DataserviseProvider.getPrmWebService();
        var datasetMgr = DataserviseProvider.getPrmWebService();
        var modulos = [];
        var service = {
            startDataset : startDataset,
            readMgr      : readMgr,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','1');
            DataserviseProvider.setDataset(dataset,'valor_id_main','1');
            DataserviseProvider.setDataset(dataset,'modulo','modulos');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_modulo');
            DataserviseProvider.setDataset(dataset,'campos',campos);
        }
        function startDatasetMgr() {          
            DataserviseProvider.setDataset(datasetMgr,'id_index_main','1');
            DataserviseProvider.setDataset(datasetMgr,'valor_id_main','1');
            DataserviseProvider.setDataset(datasetMgr,'modulo','modulos_grupo');
            DataserviseProvider.setDataset(datasetMgr,'id_tabela','id_modulo');
        }

        function readMgr () {
            var msgErro = 'Falha na Consulta da Unidade dos modulos do sistema';
            var servico = 'consulta';
            var consulta = "";
            startDatasetMgr();
            return dataservice.dadosWeb(datasetMgr,servico,msgErro)
                .then(function (data) {
                    return data;
                 });            
        }        

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta da Unidade dos modulos do sistema';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.descricao !== "") {
                consulta += " and nome LIKE '%"+prmConsulta.descricao+"%'";
            }
            if (prmConsulta.id_mg !== "") {
                consulta += " and  id_mg = "+prmConsulta.id_mg;
            }                        

            startDataset();
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta==="") {modulos = data;}
                	return data;
           		 });            
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do modulo.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do modulo.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_modulo);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do modulo.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_modulo);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();