(function() {
    'use strict';

    angular
        .module('sis.reserva')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.reservas',
                config: {
                    url: 'reservas',
                    templateUrl: 'app/sistema/reservas/templates/reservas.html',
                    controller: 'ReservaController',
                    controllerAs: 'vm',
                    title: 'reservas',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-calendar-check-o orange"></i> Reservas',
                        perm:17
                    }                    
                }
            }
        ];
    }
})();
