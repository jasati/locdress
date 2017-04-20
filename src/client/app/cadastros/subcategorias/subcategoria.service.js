(function() {
    'use strict';
    angular
        .module('cad.subcategoria')
        .factory('SubCategoriaService', SubCategoriaService);
    SubCategoriaService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function SubCategoriaService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "sc.id_subcat, sc.id_empresa, sc.id_categoria, sc.descricao, c.descricao as categoria";
        var inner_join = {0:"categoria c on sc.id_categoria = c.id_categoria"};
        var camposInvalidos = ['categoria'];
        var dataset = DataserviseProvider.getPrmWebService();
        var orderBy = "sc.id_subcat desc";
        var subcategoria = [];
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
            DataserviseProvider.setDataset(dataset,'modulo','subcategoria');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_subcat');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'order by',orderBy);
            DataserviseProvider.setDataset(dataset,'inner_join',inner_join);     
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta da SubCategoría';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.id_categoria !== undefined && prmConsulta.id_categoria !== "") {
                consulta += " and c.id_categoria = "+prmConsulta.id_categoria;
            }
            if (prmConsulta.descricao !== undefined && prmConsulta.descricao !== "") {
                consulta += " and sc.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }

            startDataset();
            DataserviseProvider.setDataset(dataset,'modulo','subcategoria sc');   
            DataserviseProvider.setDataset(dataset,'id_tabela','sc.id_subcat');                     
            DataserviseProvider.setDataset(dataset,'id_index_main','sc.id_empresa');             
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta==="") {subcategoria = data;}
                	return data;
           		 });            
        }
        function cache() {
            return subcategoria;
        }        

        function create (data) {
            var msgErro = 'Falha na inclusão da SubCategoría.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos); 	
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização da SubCategoría.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',nData.id_subcat);
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão da SubCategoría.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_subcat);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();