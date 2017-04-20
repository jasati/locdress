(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$stateParams','$state','$rootScope', '$timeout', 'config', 'logger', '$cookies','DataserviseProvider'];
    /* @ngInject */
    function ShellController($stateParams,$state,$rootScope, $timeout, config, logger, $cookies,DataserviseProvider) {
        var vm = this;
        vm.busyMessage = 'Aguarde ...';
        vm.isBusy = true;
        vm.logado = false;
        vm.usuario = {
            login : '',
            senha : '',
            nome : ''
        };




       // $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by Jasati',
            subtitle:config.versao,
        };

        activate();

        function activate() {
            vm.usuario = DataserviseProvider.userLogado.usuario;
            vm.loja = DataserviseProvider.userLogado.lojaAtual;
        }

        // function hideSplash() {
        //     //Force a 1 second delay so we can see the splash.
        //     $timeout(function() {
        //         $rootScope.showSplash = false;
        //     }, 1000);
        // }
       

    }
})();
