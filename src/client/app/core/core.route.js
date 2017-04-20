(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper,editableOptions) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
        //editableOptions.theme = 'bs3';
    }

    function getStates() {
        return [
            {
                state: 'shell.404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
