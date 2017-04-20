
(function() {
    'use strict';
    angular
        .module('app.licenca')
        .factory('LicencasService', LicencasService);
    LicencasService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function LicencasService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "el.id_licenca, el.id_empresa, el.id_plano, el.data_ativo, el.valida, p.descricao as plano, p.dias_lic, p.vitalicio,"+
            "CASE WHEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) >= 0 THEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) ELSE 0 END AS qt_dias";
        var inner_join = {
            0:"plano p ON el.id_plano = p.id_plano",
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
            readValidade : readValidade,
            create : create,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','emp_licencas');
            DataserviseProvider.setDataset(dts,'id_tabela','id_licenca');
            DataserviseProvider.setDataset(dts,'campos',campos);
            DataserviseProvider.setDataset(dts,'inner_join',inner_join);
            return dts;
        }


        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta das licenças';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.valido) {
                consulta =+ " and CASE WHEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) >= 0 THEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) ELSE 0 END >= 0"
            }
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'id_index_main','el.id_empresa');            
            DataserviseProvider.setDataset(dts,'modulo','emp_licencas el');
            DataserviseProvider.setDataset(dts,'id_tabela','el.id_licenca');            
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            DataserviseProvider.setDataset(dts,'limit',prmLimit);
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });
        }

        function readValidade () {
            var msgErro = 'Falha na Consulta da licença';
            var servico = 'consulta';
            var cp = 'el.id_empresa,p.vitalicio, SUM(CASE WHEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) >= 0 THEN (p.dias_lic - (CURRENT_DATE() - el.data_ativo)) ELSE 0 END) AS dias_restante';
            var consulta = " and el.valida = 1";
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'id_index_main','el.id_empresa');            
            DataserviseProvider.setDataset(dts,'modulo','emp_licencas el');
            DataserviseProvider.setDataset(dts,'id_tabela','el.id_licenca');                        
            DataserviseProvider.setDataset(dts,'campos',cp);
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }

        function create (data) {
            var msgErro = 'Falha na inclusão da licença.';
            var msgSucess = 'Inclusão da licença realizada com sucesso!';
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