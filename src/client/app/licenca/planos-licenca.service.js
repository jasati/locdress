
(function() {
    'use strict';
    angular
        .module('app.licenca')
        .factory('PlanosService', PlanosService);
    PlanosService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function PlanosService($q,dataservice,DataserviseProvider,UtilsFunctions) {
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
            read         : read,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','1');
            DataserviseProvider.setDataset(dts,'valor_id_main','1');
            DataserviseProvider.setDataset(dts,'modulo','plano');
            DataserviseProvider.setDataset(dts,'id_tabela','id_plano');
            return dts;
        }


        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do plano';
            var servico = 'consulta';
            var consulta = "";
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            DataserviseProvider.setDataset(dts,'limit',prmLimit);
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });
        }

    }
})();