/*

 */

(function() {
    'use strict';
    angular
        .module('sis.rec')
        .factory('TipoPgtoService', TipoPgtoService);
    TipoPgtoService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function TipoPgtoService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var service = {
            read         : read,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','1');
            DataserviseProvider.setDataset(dts,'valor_id_main',1);
            DataserviseProvider.setDataset(dts,'modulo','tipo_pgtos');
            DataserviseProvider.setDataset(dts,'id_tabela','id_tp');
            return dts;
        }        


        function read () {
            var msgErro = 'Falha na Consulta dos Tipos de Pagamento';
            var servico = 'consulta';

            var dts = startDatasetDinamico();
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });            
        }

    }
})();