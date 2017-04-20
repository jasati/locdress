(function() {
    'use strict';
    angular
        .module('cad.unidade')
        .factory('UnidadeService', UnidadeService);
    UnidadeService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function UnidadeService(dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "id_unidade,id_empresa,descricao, sigla";
        var dataset = DataserviseProvider.getPrmWebService();
        var unidades = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','unidade_medidas');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_unidade');
            DataserviseProvider.setDataset(dataset,'campos',campos);
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta da Unidade de Medida';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.descricao !== "") {
                consulta += " and descricao LIKE '%"+prmConsulta.descricao+"%'";
            }            

            if (prmConsulta.sigla !== "") {
                consulta += " and sigla LIKE '%"+prmConsulta.sigla+"%'";
            }
            startDataset();
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta==="") {unidades = data;}
                	return data;
           		 });            
        }

        function create (data) {
            var msgErro = 'Falha na inclusão da Unidade de Medida.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;   
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização da Unidade de Medida.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_unidade);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão da Unidade de Medida.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_unidade);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();