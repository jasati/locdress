(function() {
    'use strict';

    angular
        .module('app.login')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'app/login/templates/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'login',
                }
            },
            {
                state: 'suspenso',
                config: {
                    url: '/servico-suspenso',
                    templateUrl: 'app/login/templates/suspenso.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Suspenso',
                }
            }            
        ];
    }
})();
