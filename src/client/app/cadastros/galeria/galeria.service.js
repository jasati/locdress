(function() {
    'use strict';
    angular
        .module('app.galeria')
        .factory('GaleriaService', GaleriaService);
    GaleriaService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions','FileUploader','config','$uibModal'];
    /* @ngInject */
    function GaleriaService(dataservice,DataserviseProvider,UtilsFunctions,FileUploader,config,$uibModal) {

        var orderBy = "id_galeria desc";
        var service = {
            read: read,
            deletar : deletar,
            remImagem : remImagem,
            upload : upload,
            showGaleria : showGaleria,
        };
        return service;
        ////////////////

        function startDatasetDinamico() {
            var dts = DataserviseProvider.getPrmWebService();
            DataserviseProvider.setDataset(dts,'id_index_main','id_emp');
            DataserviseProvider.setDataset(dts,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dts,'modulo','galeria');
            DataserviseProvider.setDataset(dts,'id_tabela','id_galeria');
            DataserviseProvider.setDataset(dts,'order by',orderBy);
            return dts;
        }

        function read(prmConsulta,prmLimit) {
            var msgErro = 'Descupe! houve uma falha no carregamento das imagens.';
            var servico = 'consulta';
            var consulta = " and doc = 0 ";
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'consulta',consulta);
            DataserviseProvider.setDataset(dts,'limit',prmLimit);
            return dataservice.dadosWeb(dts,servico,msgErro)
            	.then(function (data) {
                	return data;
           		 });
        }

        function deletar (data) {
            var msgErro = 'Falha na exclusão da imagem.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
            var nData = UtilsFunctions.copiarObjecto(data);
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'valor_id',nData.id_galeria);
	        return dataservice.dadosWeb(dts,action,msgErro,msgSucess)
	        	.then(function (result){
	        		return result;
	        	});
        }

        function showGaleria() {
            var data = {};
            var modalGaleria = $uibModal.open({
              templateUrl: 'app/cadastros/galeria/templates/galeria.html',
              controller: 'GaleriaModalController',
              controllerAs: 'vm',
              size: 'lg',
              backdrop:'static',
              keyboard:false,
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });
            return modalGaleria.result.then(function (data) {
                return data;
            });
        }

        function remImagem(img) {
            var msgErro = 'Falha na exclusão da imagem.';
            var action = 'deleteimg';
            var dts = startDatasetDinamico();
            DataserviseProvider.setDataset(dts,'nomeImg',img.imagem);
            return dataservice.dadosWeb(dts,action,msgErro)
                .then(function (result){
                    return result;
                });
        }

        function upload() {
            var dts = startDatasetDinamico();
            dts.db = config.dbase;
            var Uploader = new FileUploader({
                url:config.urlWebService+'upload/'+DataserviseProvider.indexGeral.id_emp+',true,'+config.dbase+',0',
                autoUpload:true,
                removeAfterUpload:true,
                withCredentials:false,
            });
            return Uploader;
        }        
    }
})();