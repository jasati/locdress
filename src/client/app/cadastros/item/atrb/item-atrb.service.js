(function() {
    'use strict';
    angular
        .module('cad.itemAtrb')
        .factory('ItemAtrbService', ItemAtrbService);
    ItemAtrbService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions', 'FileUploader','config'];
    /* @ngInject */
    function ItemAtrbService($q,dataservice,DataserviseProvider,UtilsFunctions, FileUploader, config) {
        var campos = "ia.id_ia, ia.id_item, ia.qt, ia.tam, ia.cor, ia.id_galeria, ia.custo, ia.data_compra,ia.status,g.imagem" ;

        var inner_join = {0 :"",

            };
        var left_join = {
            0:"galeria g on ia.id_galeria = g.id_galeria"
        };

        var camposInvalidos = ['imagem'];    	
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
            upload       : upload,
            getLoja      : getLoja,
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'modulo','item_atrb');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_ia');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'left_join',left_join);       
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta dos atributos do traje';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.id_item !== "" && prmConsulta.id_item !== undefined) {
                consulta += " and ia.id_item = "+prmConsulta.id_item;
            }
            startDataset();
            DataserviseProvider.setDataset(dataset,'modulo','item_atrb ia');
            DataserviseProvider.setDataset(dataset,'id_tabela','ia.id_ia');
            DataserviseProvider.setDataset(dataset,'id_index_main','ia.id_item');
            DataserviseProvider.setDataset(dataset,'valor_id_main',prmConsulta.id_item);
            DataserviseProvider.setDataset(dataset,'consulta',consulta);
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                	return data;
           		});
        }

        function create (data) {
            var msgErro = 'Falha na inclusão do atributo.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dt = new Date(data.data_compra);
            nData.data_compra = UtilsFunctions.formatData(dt);            
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do atributo.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            var dt = new Date(data.data_compra);
            nData.data_compra = UtilsFunctions.formatData(dt);             
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',nData.id_ia);
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do atributo.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_ia);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos;
            return UtilsFunctions.permissao(modulos,idMod);
        }

        function upload() {
            startDataset();
            dataset.db = config.dbase;
            var Uploader = new FileUploader({
                url:config.urlWebService+'upload/'+DataserviseProvider.indexGeral.id_emp+',true,'+config.dbase,
                autoUpload:true,
                removeAfterUpload:true,
                withCredentials:false,
            });
            return Uploader;
        }

    }
})();