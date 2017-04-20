(function() {
    'use strict';
    angular
        .module('app.core')
        .provider('DataserviseProvider', DataserviseProvider);
    DataserviseProvider.$inject = ['$locationProvider','$stateProvider'];
    /* @ngInject */
    function DataserviseProvider($locationProvider,$stateProvider) {
        this.$get = webService;

        function webService() {

            var indexGeral = {
                id_usuario : '',
                id_emp : '',
                validade_licenca:''
            };
            var userLogado = {
                usuario:'',
                modulos:'',
                empresa:'',
                lojaAtual:'',
                lojas:''
            };

            var service = {
                getPrmWebService    : getPrmWebService,
                indexGeral          : indexGeral,
                setDataset          : setDataset,
                userLogado          : userLogado,
                getUserLogado       : getUserLogado,
            }; 

            return service;
            /////////////
            function getUserLogado() {
                var user = userLogado;
                return user;
            }

            function getPrmWebService(){
                var prmWebService = {
                    "db":"",
                    "modulo":"",
                    "id_index_main":"",
                    "valor_id_main":"",
                    "id_tabela":"",
                    "valor_id":"",
                    "estrutura":{"":""},
                    "campos":"",
                    "inner_join":"",
                    "left_join":"",
                    "order by":"",
                    "group by":"",
                    "consulta":"",
                    "limit":"",
                    "nomeImg":""

                } ;                
                return prmWebService;
            }

            function setDataset (dataset,index,value) {
                dataset[index]=value;
            }

            function clearPrmWebServise () {
                prmWebService.modulo="";
                prmWebService.id_index_main="";
                prmWebService.valor_id_main="";
                prmWebService.id_tabela="";
                prmWebService.valor_id="";
                prmWebService.estrutura={"":""};
                prmWebService.consulta="";
                prmWebService.limit="";
                prmWebService.campos="";
                prmWebService.inner_join="";
                prmWebService.left_join="";
                prmWebService.consulta="";
                prmWebService.limit="";
                prmWebService.nomeImg="";
            } 


        }
    }
})();