/*
SELECT 

rec.id_rec, 
rec.id_empresa, 
rec.id_loja, 
rec.id_reserva,
rec.id_cliente, 
rec.data_rec,  
rec.valor, 
rec.n_doc,
rec.obs,
rec.id_tp, 
c.nome_completo as cliente, 
c.id_cliente as id_cli_reserva, 
ca.nome_completo as clienteAvulso, 
l.nome as loja, 
tp.descricao as tipo_pagamento

FROM recebimentos rec 

INNER JOIN lojas l ON rec.id_loja = l.id_loja
INNER JOIN tipo_pgtos tp ON rec.id_tp = tp.id_tp
LEFT JOIN reservas r ON rec.id_reserva = r.id_reserva
LEFT JOIN clientes c ON r.id_cliente = c.id_cliente
LEFT JOIN clientes ca ON rec.id_cliente = ca.id_cliente
 */

(function() {
    'use strict';
    angular
        .module('sis.rec')
        .factory('RecService', RecService);
    RecService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function RecService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "rec.id_rec, rec.id_empresa, rec.id_loja, rec.id_reserva, rec.data_rec, rec.valor, "+
        " rec.n_doc, rec.obs, rec.id_tp, COALESCE(c.nome_completo,ca.nome_completo) as cliente, "+
        " COALESCE(rec.id_cliente,c.id_cliente) as id_cliente, COALESCE(c.cpf,ca.cpf) as cliente_cpf, "+
        "COALESCE(c.rg,ca.rg) as cliente_rg, l.nome as loja, tp.descricao as tipo_pagamento";
        var inner_join = {
            0:"lojas l ON rec.id_loja = l.id_loja",
            1:"tipo_pgtos tp ON rec.id_tp = tp.id_tp",
        };
        var left_join = {
            0:"reservas r ON rec.id_reserva = r.id_reserva",
            1:"clientes c ON r.id_cliente = c.id_cliente",
            2:"clientes ca ON rec.id_cliente = ca.id_cliente",
        };

        var camposInvalidos = [
            'cliente_rg',
            'cliente_cpf',
            'cliente',
            'loja',
            'tipo_pagamento',
        ];
        var orderBy = "rec.id_rec desc";
        var userLogado = DataserviseProvider.userLogado.usuario;
        var dadosEmp = DataserviseProvider.userLogado.empresa;
        var dadosLogin = DataserviseProvider.getUserLogado();
        var service = {
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            userLogado   : userLogado,
            dadosEmp     : dadosEmp,
            getPdf       : getPdf,
            verificarPermissao: verificarPermissao,
            getLojas     : getLojas,
            getLoja      : getLoja,
            dadosLogin   : dadosLogin,
            loadDataChart:loadDataChart,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','recebimentos');
            DataserviseProvider.setDataset(dts,'id_tabela','id_rec');
            DataserviseProvider.setDataset(dts,'campos',campos);
            DataserviseProvider.setDataset(dts,'left_join',left_join);
            DataserviseProvider.setDataset(dts,'inner_join',inner_join);     
            DataserviseProvider.setDataset(dts,'order by',orderBy);     
            return dts;
        }        


        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta dos Recebimentos';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.id_rec !== undefined && prmConsulta.id_rec !== "") {
                consulta += " and rec.id_rec = "+prmConsulta.id_rec;
            }
            if (prmConsulta.id_reserva !== undefined && prmConsulta.id_reserva !== "") {
                consulta += " and rec.id_reserva = "+prmConsulta.id_reserva;
            }
            if (prmConsulta.id_tp !== undefined && prmConsulta.id_tp !== "") {
                consulta += " and rec.id_tp = "+prmConsulta.id_tp;
            }            
            if (prmConsulta.origem !== undefined && prmConsulta.origem !== "") {
                if (prmConsulta.origem === 1) {
                    consulta += " and rec.id_reserva is not null ";
                } else {
                    consulta += " and rec.id_reserva is null ";
                }
            }
            if (dadosLogin.lojaAtual.id_loja !== undefined && dadosLogin.lojaAtual.id_loja !== "") {
                consulta += " and rec.id_loja = "+dadosLogin.lojaAtual.id_loja;
            }
            if (prmConsulta.id_cli_reserva !== undefined && prmConsulta.id_cli_reserva !== "") {
                consulta += " and c.id_cliente = "+prmConsulta.id_cli_reserva;
            }
            if (prmConsulta.id_cli_avulso !== undefined && prmConsulta.id_cli_avulso !== "") {
                consulta += " and rec.id_cliente = "+prmConsulta.id_cli_avulso;
            }
            if (prmConsulta.cliente !== undefined && prmConsulta.cliente !== "") {
                consulta += " and c.nome_completo LIKE '%"+prmConsulta.cliente
                +"%' or (ca.nome_completo LIKE '%"+prmConsulta.cliente+"%')";
            }

            if (prmConsulta.data_rec_ini !== undefined && prmConsulta.data_rec_ini !== null && prmConsulta.data_rec_fim !== undefined && prmConsulta.data_rec_fim !== null){
                consulta += " and rec.data_rec BETWEEN '"+UtilsFunctions.formatData(prmConsulta.data_rec_ini)+
                            "' and '"+UtilsFunctions.formatData(prmConsulta.data_rec_fim)+"'";
            } 
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'modulo','recebimentos rec');   
            DataserviseProvider.setDataset(dts,'id_tabela','rec.id_rec');                     
            DataserviseProvider.setDataset(dts,'id_index_main','rec.id_empresa');             
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            DataserviseProvider.setDataset(dts,'limit',prmLimit);          
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });            
        }

        function loadDataChart(prmConsulta) {
            var msgErro = 'Falha na Consulta do Gráfico';
            var servico = 'consulta';
            var cp = "DATE_FORMAT(rec.data_rec,'%d %b') as data, sum(rec.valor) as total_rec";
            var gr = "DATE_FORMAT(rec.data_rec,'%d %b')";
            var consulta = "";
            if (dadosLogin.lojaAtual.id_loja !== undefined && dadosLogin.lojaAtual.id_loja !== "") {
                consulta += " and rec.id_loja = "+dadosLogin.lojaAtual.id_loja;
            }            
            if (prmConsulta.dtini != undefined && prmConsulta.dtini != "" && prmConsulta.dtfim != undefined && prmConsulta.dtfim != ""){
                consulta += " and rec.data_rec BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dtini)
                            +"' and '"+UtilsFunctions.formatData(prmConsulta.dtfim)+"'";
            } else if (prmConsulta.dtini != "" && prmConsulta.dtfim == "") {
                consulta += " and rec.data_rec = '"+UtilsFunctions.formatData(prmConsulta.dtini)+"'";
            };
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'campos',cp);
            DataserviseProvider.setDataset(dts,'group by',gr);            
            DataserviseProvider.setDataset(dts,'modulo','recebimentos rec');
            DataserviseProvider.setDataset(dts,'id_tabela','rec.id_rec');
            DataserviseProvider.setDataset(dts,'id_index_main','rec.id_empresa');
            DataserviseProvider.setDataset(dts,'order by','rec.id_rec');
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do recebimento.';
            var msgSucess = 'Recebimento Salvo com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dtRec = new Date(data.data_rec);
            nData.data_rec = UtilsFunctions.formatData(dtRec);
            var dts = startDatasetDinamico();
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do recebimento.';
            var msgSucess = 'Atualização do recebimento com sucesso!';
            var action = 'editar';	
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dtRec = new Date(data.data_rec);
            nData.data_rec = UtilsFunctions.formatData(dtRec);
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_rec);
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do recebimento.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_rec);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }

        function getPdf(data) {
            var msgErro = 'Falha na geração do relatorio.';
            var msgSucess = 'Relatório gerado com sucesso!';
            var action = 'report';
            return dataservice.dadosWeb(data,action,msgErro,msgSucess)
                .then(function (result){
                    return result;
                });
        }

        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos;
            return UtilsFunctions.permissao(modulos,idMod);
        }

        function getLojas() {
            var lojas = DataserviseProvider.userLogado.lojas;
            return lojas;
        }

        function getLoja() {
            var loja = DataserviseProvider.userLogado.lojaAtual;
            return loja;
        }
    }
})();