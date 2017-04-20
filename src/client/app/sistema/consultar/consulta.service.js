/*

SELECT 

i.descricao,
i.per_desc,
i.valor,
ia.qt,
ia.cor,
ia.tam,
ia.custo,
ia.data_compra,
g.imagem,
(
    SELECT count(ri.id_ri) FROM reserva_itens ri
    INNER JOIN reservas r ON ri.id_reserva = r.id_reserva
    WHERE r.data_devolucao >= CURRENT_DATE()
    AND ri.id_ia = ia.id_ia
    AND r.data_retirada BETWEEN '2016-10-15' AND '2016-10-25'
    OR r.data_devolucao BETWEEN '2016-10-15' AND '2016-10-25' 
) as qt_reservado


FROM item_atrb ia
INNER JOIN itens i ON ia.id_item = i.id_item
LEFT JOIN galeria g ON ia.id_galeria = g.id_galeria

WHERE ia.status = 1

 */

(function() {
    'use strict';
    angular
        .module('sis.consulta')
        .factory('ConsultaService', ConsultaService);
    ConsultaService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ConsultaService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var campos = "i.id_item, i.id_empresa, i.id_categoria, i.id_subcategoria, i.descricao, "+
            "i.ref, i.valor, i.per_desc, i.id_loja, i.id_galeria, i.status, g.imagem, s.descricao as subcategoria";
        var inner_join = {
            0:"subcategoria s on i.id_subcategoria = s.id_subcat",
        };
        var left_join = {
            0:"galeria g on i.id_galeria = g.id_galeria",
        };
        var inner_joinAtrb  = {
            0:"itens i ON ia.id_item = i.id_item",
        };        
        var left_joinAtrb = {
            0:"galeria g on ia.id_galeria = g.id_galeria",
        };        
        var camposInvalidos = [
            '',
        ];
        var orderBy = "descricao";
        var userLogado = DataserviseProvider.userLogado.usuario;
        var dadosEmp = DataserviseProvider.userLogado.empresa;
        var getLoja = DataserviseProvider.getUserLogado();
        var consulta = [];
        var service = {
            read         : read,
            userLogado   : userLogado,
            dadosEmp     : dadosEmp,
            readAtrb     : readAtrb,
            verificarPermissao : verificarPermissao,
        };
        return service;
        ////////////////
        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','i.id_empresa');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','itens i');
            DataserviseProvider.setDataset(dts,'id_tabela','i.id_item');
            DataserviseProvider.setDataset(dts,'inner_join',inner_join);
            DataserviseProvider.setDataset(dts,'left_join',left_join);
            DataserviseProvider.setDataset(dts,'order by',orderBy);     
            return dts;
        }

        function dataSetAtrb() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','ia.id_item');
            DataserviseProvider.setDataset(dts,'modulo','item_atrb ia');
            DataserviseProvider.setDataset(dts,'id_tabela','ia.id_ia');
            DataserviseProvider.setDataset(dts,'inner_join',inner_joinAtrb);            
            DataserviseProvider.setDataset(dts,'left_join',left_joinAtrb);
            return dts;
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta dos Trajes';
            var servico = 'consulta';
            var consulta = " and i.status = 1 ";
            var cp = campos;

            if (prmConsulta.id_item !== undefined && prmConsulta.id_item !== "") {
                consulta += " and i.id_item = "+prmConsulta.id_item;
            }
            if (getLoja.lojaAtual.id_loja !== undefined && getLoja.lojaAtual.id_loja !== "") {
                consulta += " and i.id_loja = "+getLoja.lojaAtual.id_loja;
            }
            if (prmConsulta.id_categoria !== undefined && prmConsulta.id_categoria !== "") {
                consulta += " and i.id_categoria = "+prmConsulta.id_categoria;
            }
            if (prmConsulta.id_subcategoria !== undefined && prmConsulta.id_subcategoria !== "") {
                consulta += " and i.id_subcategoria = "+prmConsulta.id_subcategoria;
            }
            if (prmConsulta.descricao !== undefined && prmConsulta.descricao !== "") {
                consulta += " and i.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }
            if (prmConsulta.ref !== undefined && prmConsulta.ref !== "") {
                consulta += " and i.ref LIKE '%"+prmConsulta.ref+"%'";
            }

            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'campos',cp);
            DataserviseProvider.setDataset(dts,'consulta',consulta);   
            DataserviseProvider.setDataset(dts,'limit',prmLimit);          
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });

        }

        function readAtrb(prmConsulta) {
            var msgErro = 'Falha na Consulta das unidades';
            var servico = 'consulta';
            var consulta = " and ia.status = 1 ";
            var dataRet = UtilsFunctions.formatData(prmConsulta.dtRet);
            var dataDev = UtilsFunctions.formatData(prmConsulta.dtDev);
            var cp = getCamposAtrb(dataRet,dataDev);
            if (prmConsulta.id_item !== undefined && prmConsulta.id_item !== "") {
                consulta += " and ia.id_item = "+prmConsulta.id_item;
            }
            var dts = dataSetAtrb();
            DataserviseProvider.setDataset(dts,'valor_id_main',prmConsulta.id_item);            
            DataserviseProvider.setDataset(dts,'campos',cp);
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            return dataservice.dadosWeb(dts,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }

        function getCamposAtrb(dataRet, dataDev) {
            var camposAtrb = "ia.id_ia, i.descricao, i.per_desc, i.valor as valor_traje, ia.qt, ia.cor, ia.tam, ia.custo, ia.data_compra,g.imagem,"+
            "i.valor - ((i.per_desc * i.valor)/100) as valor_min, ( SELECT count(ri.id_ri) FROM reserva_itens ri INNER JOIN reservas r ON ri.id_reserva = r.id_reserva"+
            " WHERE r.data_devolucao >= CURRENT_DATE() AND ri.id_ia = ia.id_ia AND (r.data_retirada BETWEEN '"+dataRet+
            "' AND '"+dataDev+"' OR r.data_devolucao BETWEEN '"+dataRet+"' AND '"+dataDev+"') ) as qt_reservado";
            return camposAtrb
        }

        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos;
            return UtilsFunctions.permissao(modulos,idMod);
        }


    }
})();