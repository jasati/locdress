(function() {
    'use strict';

    angular
        .module('sis.rec')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.recebimentos',
                config: {
                    url: 'recebimentos',
                    templateUrl: 'app/sistema/recebimentos/templates/recebimentos.html',
                    controller: 'RecController',
                    controllerAs: 'vm',
                    title: 'recebimentos',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-money orange"></i> Recebimentos',
                        perm:19
                    }                    
                }
            }
        ];
    }
})();
