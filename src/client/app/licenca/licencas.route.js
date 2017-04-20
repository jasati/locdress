(function() {
    'use strict';

    angular
        .module('app.licenca')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'licenca_teste',
                config: {
                    url: '/ativar-licenca-teste',
                    templateUrl: 'app/licenca/templates/licenca-teste.html',
                    controller: 'LicencaController',
                    controllerAs: 'vm',
                    title: 'Licenças',
                }
            },
            {
                state: 'licenca_paga',
                config: {
                    url: '/ativar-licenca',
                    templateUrl: 'app/licenca/templates/licenca-paga.html',
                    controller: 'LicencaController',
                    controllerAs: 'vm',
                    title: 'Licenças',
                }
            }
        ];
    }
})();
