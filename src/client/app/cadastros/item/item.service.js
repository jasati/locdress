(function() {
    'use strict';
    angular
        .module('cad.item')
        .factory('ItemService', ItemService);
    ItemService.$inject = ['$q','$uibModal','dataservice','DataserviseProvider','UtilsFunctions', 'FileUploader','config'];
    /* @ngInject */
    function ItemService($q,$uibModal,dataservice,DataserviseProvider,UtilsFunctions, FileUploader, config) {
        var campos = " i.id_item, i.id_empresa, i.id_categoria, i.id_subcategoria, i.descricao,"+
        "i.status, i.ref, i.valor, i.per_desc, i.id_galeria, i.id_loja,"+
        "c.descricao as categoria, sc.descricao as subcategoria, g.imagem" ;

        var inner_join = {0 :"categoria c on i.id_categoria = c.id_categoria",
                          1 :"subcategoria sc on i.id_subcategoria = sc.id_subcat",
            };
        var left_join = {
            0:"galeria g on i.id_galeria = g.id_galeria"
        };

        var camposInvalidos = ['categoria','subcategoria','imagem'];    	
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
            upload       : upload,
            getLoja      : getLoja,
            zoomImg      : zoomImg,
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','itens');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_item');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'inner_join',inner_join);       
            DataserviseProvider.setDataset(dataset,'left_join',left_join);       
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do traje';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.codigo !== "" && prmConsulta.codigo !== undefined) {
                consulta += " and i.id_item = "+prmConsulta.codigo;
            }
            if (getLoja.lojaAtual.id_loja !== undefined && getLoja.lojaAtual.id_loja !== "") {
                consulta += " and i.id_loja =  "+getLoja.lojaAtual.id_loja;
            }            
            if (prmConsulta.ref !== "" && prmConsulta.ref !== undefined) {
                consulta += " and i.ref LIKE '%"+prmConsulta.ref+"%'";
            }            
            if (prmConsulta.descricao !== "" && prmConsulta.descricao !== undefined) {
                consulta += " and i.descricao LIKE '%"+prmConsulta.descricao+"%'";
            }
            if (prmConsulta.id_categoria !== "" && prmConsulta.id_categoria !== undefined) {
                consulta += " and i.id_categoria = "+prmConsulta.id_categoria;
            }
            if (prmConsulta.id_subcategoria !== "" && prmConsulta.id_subcategoria !== undefined) {
                consulta += " and i.id_subcategoria = "+prmConsulta.id_subcategoria;
            }
            if (prmConsulta.status !== "" && prmConsulta.status !== undefined){
                consulta += " and i.status = "+prmConsulta.status;
            }

            DataserviseProvider.setDataset(dataset,'modulo','itens i');
            DataserviseProvider.setDataset(dataset,'id_tabela','i.id_item');                     
            DataserviseProvider.setDataset(dataset,'id_index_main','i.id_empresa');            
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta === "") {itens = data;}
                	return data;
           		});            
        }
        function cache() {
            return itens;
        }
        function create (data) {
            var msgErro = 'Falha na inclusão do traje.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do traje.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';
            var nData = UtilsFunctions.copiarObjecto(data);
	        nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',nData.id_item);
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do traje.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_item);
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
                url:config.urlWebService+'upload/'+DataserviseProvider.indexGeral.id_emp+',true,'+config.dbase+',0',
                autoUpload:true,
                removeAfterUpload:true,
                withCredentials:false,
            });
            return Uploader;
        }

        function getLojas() {
            var lojas = DataserviseProvider.userLogado.lojas;
            return lojas;
        }
        function zoomImg(i) {
            var data = {
              item:i,
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/item/templates/zoom-img.html',
              controller: 'ZoomImgController',
              controllerAs: 'vm',
              size: '',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
        }
    }
})();