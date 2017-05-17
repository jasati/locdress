(function() {
    'use strict';

    angular
        .module('app.layout')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell',
                config: {
                    url: '/app/',
                    templateUrl: 'app/layout/shell.html',
                    controller: 'ShellController',
                    controllerAs: 'vm',
                    title: 'shell',
                }
            },
            {
                state: 'start',
                config: {
                    url: '/?register?email',
                    controller: 'StartController',
                    controllerAs: 'vm',
                    title: 'start',
                }
            }
        ];
    }
})();
