(function() {
    'use strict';
    angular
        .module('app.registrar')
        .factory('RegistrarService', RegistrarService);
    RegistrarService.$inject = ['dataservice','DataserviseProvider','UtilsFunctions', 'config','FileUploader'];
    /* @ngInject */
    function RegistrarService(dataservice,DataserviseProvider,UtilsFunctions, config,FileUploader) {
        var campos = "e.id_empresa, e.nome, e.cpf_cnpj, e.endereco, e.responsavel, e.data_cad, e.email, e.cel, e.status, e.tel1, e.tel2, e.slogan, e.cidade, e.id_galeria, e.fantasia, e.estado, g.imagem as logo";
        var left_join = {
            0:"galeria g on e.id_galeria = g.id_galeria",

        };
        var camposInvalidos = ['logo','plano','dias_lic'];
        var dataset = DataserviseProvider.getPrmWebService();
        var service = {
            load         : load,
            create       : create,
            update       : update,
            upload       : upload,
            verificarPermissao : verificarPermissao,
            mailGetResponse : mailGetResponse,
        };
        return service;
        ////////////////
        function startDataset() {           
            DataserviseProvider.setDataset(dataset,'modulo','empresas');
            DataserviseProvider.setDataset(dataset,'id_index_main','1');
            DataserviseProvider.setDataset(dataset,'valor_id_main','1');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_empresa');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'left_join',left_join);
        }

        function load(cpf_cnpj) {
            startDataset();
            var msgErro = 'Falha na Consulta da Empresa';
            var servico = 'consulta';
            var consulta = '';
            if (cpf_cnpj) {
                var consulta = " and e.cpf_cnpj = '"+cpf_cnpj+"'";
            } else {
                var consulta = " and e.id_empresa = "+DataserviseProvider.indexGeral.id_emp;
            }
            DataserviseProvider.setDataset(dataset,'modulo','empresas e');
            DataserviseProvider.setDataset(dataset,'id_tabela','e.id_empresa');
            DataserviseProvider.setDataset(dataset,'consulta',consulta);
            return dataservice.dadosWeb(dataset,servico,msgErro)
                .then(function (data) {
                    return data;
                 });
        }

        function create (data) {
            var msgErro = 'Falha na inclusão da Empresa.';
            var msgSucess = 'Empresa criada com sucesso!';
            var action = 'novo';
            data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'estrutura',data);
            return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
                .then(function (data){
                    return data;
                });
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização da Empresa.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';
            var nData = UtilsFunctions.copiarObjecto(data);
            nData = UtilsFunctions.removeCamposInvalidos(nData,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',nData.id_empresa);
	        DataserviseProvider.setDataset(dataset,'estrutura',nData);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
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

        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos;
            return UtilsFunctions.permissao(modulos,idMod);
        }

        function mailGetResponse(data) {
            var msgErro = 'Falha no mail getResponse';
            var action = 'getResponse';
            var mail = {
                url:'https://api.getresponse.com/v3/contacts',
                key:config.getResponseKey,
                request:'POST',
                body:data,
            };
            return dataservice.dadosWeb(mail,action,msgErro)
                .then(function (res) {
                    return res;
                });
        }
    }
})();