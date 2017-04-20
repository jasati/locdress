(function() {
    'use strict';
    angular
        .module('cad.cliente')
        .factory('ClienteService', ClienteService);
    ClienteService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions','config'];
    /* @ngInject */
    function ClienteService($q,dataservice,DataserviseProvider,UtilsFunctions, config) {
        var campos = "" ;

        var inner_join = {0 :"",
            };
        var left_join = {
            0:""
        };

        var camposInvalidos = [];    	
        var dataset = DataserviseProvider.getPrmWebService();
        var getLoja = DataserviseProvider.getUserLogado();
        var itens = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            verificarPermissao : verificarPermissao,
            getLojas     : getLojas,
            getLoja      : getLoja,
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','clientes');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_cliente');
            DataserviseProvider.setDataset(dataset,'json','text');
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do traje';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.codigo !== undefined && prmConsulta.codigo !== "") {
                consulta += " and id_cliente = "+prmConsulta.codigo;
            }
            if (getLoja.lojaAtual.id_loja !== undefined && getLoja.lojaAtual.id_loja !== "") {
                consulta += " and id_loja =  "+getLoja.lojaAtual.id_loja;
            }
            if (prmConsulta.rg !== undefined && prmConsulta.rg !== "") {
                consulta += " and rg LIKE '"+prmConsulta.rg+"%'";
            }
            if (prmConsulta.cpf !== undefined && prmConsulta.cpf !== "") {
                consulta += " and cpf LIKE '"+prmConsulta.cpf+"%'";
            }                        
            if (prmConsulta.nome !== "" && prmConsulta.nome !== undefined) {
                consulta += " and nome_completo LIKE '%"+prmConsulta.nome+"%'";
            }
            if (prmConsulta.apelido !== undefined && prmConsulta.apelido !== "" ) {
                consulta += " and nome_reduzido LIKE '%"+prmConsulta.apelido+"%'";
            }
            startDataset();
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                	return data;
           		});            
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do cliente.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dt = new Date(data.data_nascimento);
            nData.data_nascimento = UtilsFunctions.formatData(dt);            
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do cliente.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dt = new Date(data.data_nascimento);
            nData.data_nascimento = UtilsFunctions.formatData(dt);            
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',nData.id_cliente);
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do cliente.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_cliente);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
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
    }
})();