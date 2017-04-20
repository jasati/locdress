(function() {
    'use strict';

    angular
        .module('cad.item')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.item',
                config: {
                    url: 'item',
                    templateUrl: 'app/cadastros/item/templates/item.html',
                    controller: 'ItemController',
                    controllerAs: 'vm',
                    title: 'item',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-street-view orange"></i> Cadastrar Trajes',
                        perm:7
                    }                    
                }
            }
        ];
    }
})();
