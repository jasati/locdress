(function() {
    'use strict';

    angular
        .module('cad.cliente')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.cliente',
                config: {
                    url: 'cliente',
                    templateUrl: 'app/cadastros/cliente/templates/cliente.html',
                    controller: 'ClienteController',
                    controllerAs: 'vm',
                    title: 'cliente',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-group orange"></i> Cadastrar Clientes',
                        perm:13
                    }                    
                }
            }
        ];
    }
})();
