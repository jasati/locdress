(function() {
    'use strict';
    angular
        .module('cad.perfil')
        .factory('ModPerfilService', ModPerfilService);
    ModPerfilService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ModPerfilService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "pm.id_pm, pm.id_modulo, pm.id_perfil, m.nome as modulo";
        var inner_join = {0:"modulos m on pm.id_modulo = m.id_modulo"};
        var camposInvalidos = ['nome','select','id_mg','check'];
        var dataset = DataserviseProvider.getPrmWebService();
        var modPerfils = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
        };
        return service;
        ////////////////
        function startDataset() {
            DataserviseProvider.setDataset(dataset,'id_index_main','1');
            DataserviseProvider.setDataset(dataset,'valor_id_main','1');
            DataserviseProvider.setDataset(dataset,'modulo','perfil_modulos');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_pm');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'inner_join',inner_join);
        }

        function read (prmConsulta,prmLimit) {
            startDataset();
            var msgErro = 'Falha na Consulta dos modulos do perfil';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.id_perfil !== undefined && prmConsulta.id_perfil !== "") {
                consulta += " and pm.id_perfil = "+prmConsulta.id_perfil;
            }
            if (prmConsulta.descricao !== undefined && prmConsulta.descricao !== "") {
                consulta += " and m.modulo LIKE '%"+prmConsulta.descricao+"%'";
            }
            DataserviseProvider.setDataset(dataset,'modulo','perfil_modulos pm');
            DataserviseProvider.setDataset(dataset,'id_tabela','pm.id_pm');
            DataserviseProvider.setDataset(dataset,'consulta',consulta);
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta === "") {modPerfils = data;}
                	return data;
           		 });            
        }

        function cache() {
            return modPerfils;
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do modulos do perfil.';
            var msgSucess = 'Inclusão do modulos do perfil realizada com sucesso!';
            var action = 'novo';
            for (var i = 0; i < data.length; i++) {
                data[i] = UtilsFunctions.removeCamposInvalidos(data[i],camposInvalidos);
            }
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do modulos do perfil.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            for (var i = 0; i < data.length; i++) {
                data[i] = UtilsFunctions.removeCamposInvalidos(data[i],camposInvalidos);
            }
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_pm);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do modulos do perfil.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_pm);
            DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
    }
})();