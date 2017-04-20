/*
SELECT 
ri.id_ri,
ri.id_reserva,
ri.id_ia,
ri.valor,
ri.desc,
ri.inc_post_contrato,
ri.ajustar,
ri.ajustes,
i.descricao,
i.per_desc,
i.valor as valor_item,
ia.cor,
ia.tam,
ia.custo,
ia.data_compra,
g.imagem,
r.id_empresa,
r.data_reserva,
r.data_retirada,
r.data_evento,
r.data_devolucao,
r.id_loja,
r.id_cliente,
r.status

FROM reserva_itens ri
INNER JOIN reservas r ON ri.id_reserva = r.id_reserva
INNER JOIN item_atrb ia ON ri.id_ia = ia.id_ia
INNER JOIN itens i ON ia.id_item = i.id_item
left JOIN galeria g ON ia.id_galeria = g.id_galeria
 */

(function() {
    'use strict';
    angular
        .module('sis.reserva')
        .factory('ResItensService', ResItensService);
    ResItensService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ResItensService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "ri.id_ri, ri.id_reserva, ri.id_ia, ri.valor, ri.desc, ri.inc_post_contrato, ri.ajustar,"+
        " ri.ajustes, i.descricao,i.ref, i.per_desc, i.valor as valor_traje, ia.cor, ia.tam, ia.custo, ia.data_compra,"+
        " g.imagem, r.id_empresa, r.data_reserva, r.data_retirada, r.data_evento, r.data_devolucao, r.id_loja,"+
        " r.id_cliente, r.status, i.valor - ((i.per_desc * i.valor)/100) as valor_min";
        var inner_join = {
            0:"item_atrb ia ON ri.id_ia = ia.id_ia",
            1:"itens i ON ia.id_item = i.id_item",
            2:"reservas r ON ri.id_reserva = r.id_reserva",
        };
        var left_join = {
            0:"galeria g ON ia.id_galeria = g.id_galeria",
        }

        var camposInvalidos = [
            'descricao', 
            'per_desc', 
            'valor_traje', 
            'cor', 
            'tam', 
            'custo',
            'data_compra',
            'imagem',
            'id_empresa',
            'data_reserva',
            'data_retirada',
            'data_evento',
            'data_devolucao',
            'id_loja',
            'id_cliente',
            'status',
            'qt',
            'qt_reservado',
            'edit',
            'valor_min',
            'ref',
        ];
        var userLogado = DataserviseProvider.userLogado.usuario;
        var dadosLogin = DataserviseProvider.getUserLogado();
        var service = {
            load         : load,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            userLogado   : userLogado,
            novoTraje     : novoTraje
        };
        return service;
        ////////////////

        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);            
            DataserviseProvider.setDataset(dts,'modulo','reserva_itens');   
            DataserviseProvider.setDataset(dts,'id_tabela','id_ri');                     
            DataserviseProvider.setDataset(dts,'campos',campos);
            DataserviseProvider.setDataset(dts,'inner_join',inner_join);
            DataserviseProvider.setDataset(dts,'left_join',left_join);
            return dts;
        }

        function novoTraje(id_reserva,value) {
            var traje = {
                id_ri:null,
                id_reserva:id_reserva,
                id_ia:value.id_ia,
                valor:value.valor_traje,
                per_desc:value.per_desc,
                valor_min:value.valor_min,
                descricao:value.descricao,
                cor:value.cor,
                tam:value.tam,
                imagem:value.imagem,

            };
            return traje;
        }

        function load (id_ri) {
            var msgErro = 'Falha na Consulta do Traje da Reserva';
            var servico = 'consulta';
            var consulta = ' and id_ri = '+id_ri;
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);    
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (itens) {
                    return itens.reg[0];
                 });
        }        

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta dos Trajes da Reserva';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.id_ri !== undefined && prmConsulta.id_ri !== "") {
                consulta += " and ri.id_ri = "+prmConsulta.id_ri;
            }

            if (dadosLogin.lojaAtual.id_loja !== undefined && dadosLogin.lojaAtual.id_loja !== "") {
                consulta += " and r.id_loja = "+dadosLogin.lojaAtual.id_loja;
            }

            if (prmConsulta.id_item !== undefined && prmConsulta.id_item !== "") {
                consulta += " and i.id_item = "+prmConsulta.id_item;
            }
            if (prmConsulta.reservados) {
                consulta += " and r.data_devolucao >= CURRENT_DATE() ";
            }
            if (prmConsulta.serAjustado) {
                if (prmConsulta.dataSerAjust !== null) {
                    consulta += " and ri.ajustar = 1 and r.data_retirada = '"+UtilsFunctions.formatData(prmConsulta.dataSerAjust)+"'";
                } else {
                    consulta += " and ri.ajustar = 1 and r.data_retirada = CURRENT_DATE()+1";
                }
            }
            if (prmConsulta.serRetirado) {
                if (prmConsulta.dataSerRet !== null) {
                    consulta += " and r.data_retirada = '"+UtilsFunctions.formatData(prmConsulta.dataSerRet)+"'";
                } else {
                    consulta += " and r.data_retirada = CURRENT_DATE() ";
                }
            }
            if (prmConsulta.naoDevolvido) {
                consulta += " and r.status = 1 and r.data_devolucao < CURRENT_DATE() ";
            }

            if (prmConsulta.id_reserva !== undefined && prmConsulta.id_reserva !== "") {
                consulta += " and ri.id_reserva = "+prmConsulta.id_reserva;
            }

            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'id_index_main','r.id_empresa');
            DataserviseProvider.setDataset(dts,'modulo','reserva_itens ri');
            DataserviseProvider.setDataset(dts,'id_tabela','ri.id_ri');
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            DataserviseProvider.setDataset(dts,'limit',prmLimit);
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (trajes) {
                	return trajes;
           		 });
        }

        function create (data_c) {
            var msgErro = 'Falha na inclusão dos Trajes.';
            var msgSucess = 'Trajes Salvos com sucesso!';
            var action = 'novo';
            var nData = UtilsFunctions.copiarObjecto(data_c);
            for (var i = 0; i < nData.length; i++) {
                nData[i] = UtilsFunctions.removeCamposInvalidos(nData[i],camposInvalidos);
            }
            var dts = startDatasetDinamico();
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (data_c_r){
	        		return data_c_r;
	        	});
        } 

        function update (data_u) {
            var msgErro = 'Falha na Atualização do Traje';
            var msgSucess = 'Atualização do Traje com sucesso!';
            var action = 'editar';
            var dts = startDatasetDinamico();
            var nData = UtilsFunctions.copiarObjecto(data_u);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_ri);
	        DataserviseProvider.setDataset(dts,'estrutura',nData);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (data_u_r){
	        		return data_u_r;
	        	});
        }         

        function deletar (data_d) {
            var msgErro = 'Falha na exclusão do Item da Requisição.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',data_d.id_ri);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (data_d_r){
	        		return data_d_r;
	        	});
        }
    }
})();