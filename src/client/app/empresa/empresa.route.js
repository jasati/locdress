(function() {
    'use strict';

    angular
        .module('app.empresa')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.config',
                config: {
                    url: 'config',
                    templateUrl: 'app/empresa/templates/empresa-cadastro.html',
                    controller: 'EmpresaController',
                    controllerAs: 'vm',
                    title: 'Configurações',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-cog orange"></i> Configurações',
                        perm: 6,
                    }                    
                }
            }
        ];
    }
})();
