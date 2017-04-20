
(function() {
    'use strict';
    angular
        .module('app.empresa')
        .factory('ModContratoService', ModContratoService);
    ModContratoService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ModContratoService($q,dataservice,DataserviseProvider,UtilsFunctions) {
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
            create       : create,
            update       : update,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','modelo_contrato');
            DataserviseProvider.setDataset(dts,'id_tabela','id_empresa');
            return dts;
        }        

        function load() {
            var msgErro = 'Falha na Consulta da loja';
            var servico = 'consulta';
            var consulta = " and id_empresa = "+DataserviseProvider.indexGeral.id_emp;
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do Modelo de Contrato.';
            var msgSucess = 'Modelo de contrato configurado com sucesso!';
            var action = 'novo';
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'estrutura',data);
            return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
                .then(function (result){
                    return result;
                });
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do Modelo de Contrato.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',data.id_empresa);
	        DataserviseProvider.setDataset(dts,'estrutura',data);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }

    }
})();