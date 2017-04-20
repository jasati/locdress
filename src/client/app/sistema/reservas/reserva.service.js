/*
SELECT 
r.id_reserva,
r.id_empresa,
r.id_loja,
r.id_cliente,
r.data_reserva, 
r.data_retirada,
r.data_evento,
r.data_devolucao,
r.id_usu_rep_alug,
r.id_usu_rep_dev,
r.obs_devolucao,
r.obs,
r.status,
r.imp_contrato,
c.nome_completo as cliente,
c.cidade,
c.cel1,
c.cel2,
c.tel1,
c.endereco,
ua.nome as resp_alug,
ud.nome as resp_dev,
CASE WHEN rec.valor IS NULL then 0.00 ELSE rec.valor END as valor_entrada

FROM reservas r 
INNER JOIN clientes c ON r.id_cliente = c.id_cliente
INNER JOIN usuarios ua ON r.id_usu_rep_alug = ua.id_usuario
LEFT JOIN usuarios ud ON r.id_usu_rep_dev = ud.id_usuario
 */

(function() {
    'use strict';
    angular
        .module('sis.reserva')
        .factory('ReservaService', ReservaService);
    ReservaService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ReservaService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "r.id_reserva, r.id_empresa, r.id_loja, r.id_cliente, r.data_reserva, r.data_retirada,r.data_evento,"+
        " r.data_devolucao, r.id_usu_rep_alug, r.id_usu_rep_dev, r.obs_devolucao, r.obs,r.status, r.imp_contrato,r.id_usu_res_ret,r.ret_terceiro,"+
        " r.nome_terceiro_ret,r.tel_terceiro, r.id_rec_entrada, c.nome_completo as cliente, c.cidade,c.bairro, c.cel1, c.cel2, c.tel1, c.endereco,c.nome_pai,c.nome_mae,"+
        " c.estado_civil, CASE WHEN rec.valor IS NULL then 0.00 ELSE rec.valor END as valor_entrada, c.profissao,c.cpf,c.rg, ua.nome as resp_alug, ud.nome as resp_dev,(select sum(ri.valor) from reserva_itens ri where ri.id_reserva = r.id_reserva) as total,"+
        "(SELECT case when SUM(rec.valor) is null then 0.00 else SUM(rec.valor) end FROM recebimentos rec where rec.id_reserva = r.id_reserva) as total_rec";
        var inner_join = {
            0:"clientes c ON r.id_cliente = c.id_cliente",
            1:"usuarios ua ON r.id_usu_rep_alug = ua.id_usuario",
        };
        var left_join = {
            0:"usuarios ud ON r.id_usu_rep_dev = ud.id_usuario",
            1:"recebimentos rec ON r.id_rec_entrada = rec.id_rec",
        };

        var camposInvalidos = [
            'cliente',
            'cidade',
            'cel1',
            'cel2',
            'tel1',
            'endereco',
            'resp_alug',
            'resp_dev',
            'total',
            'total_rec',
            'estado_civil',
            'profissao',
            'cpf',
            'rg',
            'bairro',
            'nome_pai',
            'nome_mae',
            'valor_entrada',
        ];
        var orderBy = "r.id_reserva desc";
        var userLogado = DataserviseProvider.userLogado.usuario;
        var dadosEmp = DataserviseProvider.userLogado.empresa;
        var dadosLogin = DataserviseProvider.getUserLogado();
        var service = {
            load         : load,
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
            loadDataChart:loadDataChart,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','reservas');
            DataserviseProvider.setDataset(dts,'id_tabela','id_reserva');
            DataserviseProvider.setDataset(dts,'campos',campos);
            DataserviseProvider.setDataset(dts,'inner_join',inner_join);     
            DataserviseProvider.setDataset(dts,'left_join',left_join);     
            DataserviseProvider.setDataset(dts,'order by',orderBy);     
            return dts;
        }        

        function load(id) {
            var msgErro = 'Falha na Consulta da Reserva';
            var servico = 'consulta';
            var consulta = " and r.id_reserva = "+id;
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'modulo','reservas r');   
            DataserviseProvider.setDataset(dts,'id_tabela','r.id_reserva');                     
            DataserviseProvider.setDataset(dts,'id_index_main','r.id_empresa');             
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }


        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta das Reservas';
            var servico = 'consulta';
            var consulta = "";        	
            if (prmConsulta.id_reserva !== undefined && prmConsulta.id_reserva !== "") {
                consulta += " and r.id_reserva = "+prmConsulta.id_reserva;
            }
            if (dadosLogin.lojaAtual.id_loja !== undefined && dadosLogin.lojaAtual.id_loja !== "") {
                consulta += " and r.id_loja = "+dadosLogin.lojaAtual.id_loja;
            }
            if (prmConsulta.id_cliente !== undefined && prmConsulta.id_cliente !== "") {
                consulta += " and r.id_cliente = "+prmConsulta.id_cliente;
            }
            if (prmConsulta.cliente !== undefined && prmConsulta.cliente !== "") {
                consulta += " and c.nome_completo LIKE '%"+prmConsulta.cliente+"%'";
            }
            if (prmConsulta.resp_reserva !== undefined && prmConsulta.resp_reserva !== "") {
                consulta += " and u.resp_alug LIKE '%"+prmConsulta.resp_reserva+"%'";
            }
            if (prmConsulta.status !== undefined && prmConsulta.status !== "") {
                consulta += " and r.status = "+prmConsulta.status;
            }            
            if (prmConsulta.dt_res_ini !== undefined && prmConsulta.dt_res_ini !== null && prmConsulta.dt_res_fim !== undefined && prmConsulta.dt_res_fim !== null){
                consulta += " and r.data_reserva BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dt_res_ini,'00:00')+
                            "' and '"+UtilsFunctions.formatData(prmConsulta.dt_res_fim,'23:59')+"'";
            } 

            if (prmConsulta.dt_ret_ini !== undefined && prmConsulta.dt_ret_ini !== null && prmConsulta.dt_ret_fim !== undefined && prmConsulta.dt_ret_fim !== null){
                consulta += " and r.data_retirada BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dt_ret_ini)+
                            "' and '"+UtilsFunctions.formatData(prmConsulta.dt_ret_fim)+"'";
            }

            if (prmConsulta.dt_eve_ini !== undefined && prmConsulta.dt_eve_ini !== null && prmConsulta.dt_eve_fim !== undefined && prmConsulta.dt_eve_fim !== null){
                consulta += " and r.data_evento BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dt_eve_ini)+
                            "' and '"+UtilsFunctions.formatData(prmConsulta.dt_eve_fim)+"'";
            }
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'modulo','reservas r');   
            DataserviseProvider.setDataset(dts,'id_tabela','r.id_reserva');                     
            DataserviseProvider.setDataset(dts,'id_index_main','r.id_empresa');             
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
            var cp = "COUNT(r.id_reserva) as qt_res,DATE_FORMAT(r.data_reserva,'%d %b') as data";
            var gr = "DATE_FORMAT(r.data_reserva,'%d %b')";
            var consulta = "";
            if (dadosLogin.lojaAtual.id_loja !== undefined && dadosLogin.lojaAtual.id_loja !== "") {
                consulta += " and r.id_loja = "+dadosLogin.lojaAtual.id_loja;
            }            
            if (prmConsulta.dtini != undefined && prmConsulta.dtini != "" && prmConsulta.dtfim != undefined && prmConsulta.dtfim != ""){
                consulta += " and r.data_reserva BETWEEN '"+UtilsFunctions.formatData(prmConsulta.dtini,'00:00')
                            +"' and '"+UtilsFunctions.formatData(prmConsulta.dtfim,'23:59')+"'";
            } else if (prmConsulta.dtini != "" && prmConsulta.dtfim == "") {
                consulta += " and r.data_reserva = '"+UtilsFunctions.formatData(prmConsulta.dtini,'00:00')+"'";
            };
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'campos',cp);
            DataserviseProvider.setDataset(dts,'group by',gr);            
            DataserviseProvider.setDataset(dts,'modulo','reservas r');
            DataserviseProvider.setDataset(dts,'id_tabela','r.id_reserva');
            DataserviseProvider.setDataset(dts,'id_index_main','r.id_empresa');
            DataserviseProvider.setDataset(dts,'order by','r.id_reserva');
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }



        function create (data) {
            var msgErro = 'Falha na inclusão da Reserva.';
            var msgSucess = 'Reserva Salva com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dtRes = new Date(data.data_reserva);
            var dtRet = new Date(data.data_retirada);
            var dtEve = new Date(data.data_evento);
            var dtDev = new Date(data.data_devolucao);
            nData.data_reserva = UtilsFunctions.formatData(dtRes);
            nData.data_retirada = UtilsFunctions.formatData(dtRet);
            nData.data_evento = UtilsFunctions.formatData(dtEve);
            nData.data_devolucao = UtilsFunctions.formatData(dtDev);
            var dts = startDatasetDinamico();
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização da Reserva.';
            var msgSucess = 'Atualização da Reserva com sucesso!';
            var action = 'editar';	
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dtRes = new Date(data.data_reserva);
            var dtRet = new Date(data.data_retirada);
            var dtEve = new Date(data.data_evento);
            var dtDev = new Date(data.data_devolucao);
            nData.data_reserva = UtilsFunctions.formatData(dtRes);
            nData.data_retirada = UtilsFunctions.formatData(dtRet);
            nData.data_evento = UtilsFunctions.formatData(dtEve);
            nData.data_devolucao = UtilsFunctions.formatData(dtDev);            
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_reserva);
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão da Requisição.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_reserva);
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