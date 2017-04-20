(function() {
    'use strict';

    angular
        .module('app.novaempresa')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'novaemp',
                config: {
                    url: '/novaemp?actv',
                    templateUrl: 'app/cadastros/novaempresa/templates/nova-empresa-wizard.html',
                    controller: 'NovaEmpresaController',
                    controllerAs: 'vm',
                    title: 'nova empresa',
                }
            }
        ];
    }
})();
