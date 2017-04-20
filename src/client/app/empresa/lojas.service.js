
(function() {
    'use strict';
    angular
        .module('app.empresa')
        .factory('LojasService', LojasService);
    LojasService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function LojasService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "";
        var inner_join = {
            0:"",
        };
        var left_join = {
            0:"",
        };

        var camposInvalidos = [
            '', 
        ];
        var orderBy = "";
        var service = {
            load         : load,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','lojas');
            DataserviseProvider.setDataset(dts,'id_tabela','id_loja');
            return dts;
        }        

        function load(id) {
            var msgErro = 'Falha na Consulta da loja';
            var servico = 'consulta';
            var consulta = " and id_loja = "+id;
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }


        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta das lojas';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.nome !== undefined && prmConsulta.nome !== "") {
                consulta += " and nome LIKE '%"+prmConsulta.nome+"%'";
            }
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            DataserviseProvider.setDataset(dts,'limit',prmLimit);          
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });
        }


        function create (data) {
            var msgErro = 'Falha na inclusão da loja.';
            var msgSucess = 'Inclusão da Loja realizada com sucesso!';
            var action = 'novo';
            if (!data.id_empresa) {
                data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            }
            var dts = startDatasetDinamico();
	        DataserviseProvider.setDataset(dts,'estrutura',data);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização da loja.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',data.id_loja);
	        DataserviseProvider.setDataset(dts,'estrutura',data);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão da loja.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',data.loja);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }

    }
})();