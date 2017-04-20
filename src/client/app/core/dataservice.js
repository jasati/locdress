(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$q', 'logger', 'config'];
    /* @ngInject */
  
    function dataservice($http, $q, logger, config) {
        var service = {
            dadosWeb: dadosWeb,
        };

        return service;

        function dadosWeb(prmWebService, servico, msgErro, msgSucess) {
            prmWebService.db = config.dbase;
            var req = {
                    url    : config.urlWebService+servico,
                    method : 'POST',
                    data   :  prmWebService,
                    withCredentials: false,
                    headers: {
                       'Authorization': 'Basic bashe64usename:password',
                    },
                };

            return $http(req)
                .then(success)
                .catch(fail);

            function success(response) {
                if (response.data.status) {
                    if (response.data.status == "ok") {
                        if ( msgSucess !== null) {
                            logger.success(msgSucess);
                        }                        
                    } else {
                        logger.error(msgErro+' Erro: '+response.data.msg);
                    }
                }
                return response.data;
            }

            function fail(error) {
                if (error.status == -1) {
                    logger.error(msgErro+' Erro : Falha na conexão com o servidor, verifique sua conexão.');
                } else {
                    logger.error(msgErro+' Erro : '+error.statusText);
                }
                return $q.reject(msgErro);
            }                

            
        }

    }
})();
