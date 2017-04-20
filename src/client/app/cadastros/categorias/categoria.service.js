(function() {
    'use strict';
    angular
        .module('cad.categoria')
        .factory('CategoriaService', CategoriaService);
    CategoriaService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function CategoriaService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = " id_categoria, id_empresa, descricao";
        var dataset = DataserviseProvider.getPrmWebService();
        var categorias = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            categorias    : categorias
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','categoria');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_categoria');
            DataserviseProvider.setDataset(dataset,'campos',campos);
        }

        function read (prmConsulta,prmLimit) {
            startDataset();
            var msgErro = 'Falha na Consulta da categoría';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.id_categoria !== undefined && prmConsulta.id_categoria !== "") {
                consulta += " and id_categoria = "+prmConsulta.id_categoria;
            }
            if (prmConsulta.descricao !== undefined && prmConsulta.descricao !== "") {
                consulta += " and descricao LIKE '%"+prmConsulta.descricao+"%'";
            }

            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta === "") {categorias = data;}
                	return data;
           		 });            
        }

        function cache() {
            return categorias;
        }

        function create (data) {
            var msgErro = 'Falha na inclusão da categoría.';
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
            var msgErro = 'Falha na Atualização da categoría.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_categoria);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão da categoría.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_categoria);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();