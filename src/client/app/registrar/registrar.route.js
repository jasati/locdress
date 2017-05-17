(function() {
    'use strict';

    angular
        .module('app.registrar')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'registrar',
                config: {
                    url: '/registrar?email',
                    templateUrl: 'app/registrar/templates/registrar.html',
                    controller: 'RegistrarController',
                    controllerAs: 'vm',
                    title: 'Registrar'
                }
            },
            {
                state: 'aguardconfirm',
                config: {
                    url: '/aguardando-confirmacao',
                    templateUrl: 'app/registrar/templates/aguardando.html',
                    controller: 'AguardandoConfController',
                    controllerAs: 'vm',
                    title: 'Aguardando Confirmação'
                }
            },
            {
                state: 'confirmareg',
                config: {
                    url: '/confirmando?confirm?idemp',
                    templateUrl: 'app/registrar/templates/confirmando.html',
                    controller: 'ConfirmRegController',
                    controllerAs: 'vm',
                    title: 'Confirmado registro'
                }
            }                        
        ];
    }
})();
