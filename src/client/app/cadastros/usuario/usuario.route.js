(function() {
    'use strict';

    angular
        .module('cad.usuario')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'shell.usuario',
                config: {
                    url: 'usuario',
                    templateUrl: 'app/cadastros/usuario/templates/usuario.html',
                    controller: 'UsuarioController',
                    controllerAs: 'vm',
                    title: 'usuario',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-user orange"></i> Cadastrar Usuários',
                        perm:1
                    }                    
                }
            }
        ];
    }
})();
