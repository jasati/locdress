
(function() {
    'use strict';
    angular
        .module('app.login')
        .directive('usuarioMenuTop', usuarioMenuTop);
    usuarioMenuTop.$inject = ['$state','$q','DataserviseProvider', '$cookies', '$uibModal', 'dataservice', 'UsuarioService'];
    /* @ngInject */
    function usuarioMenuTop ($state,$q,DataserviseProvider, $cookies, $uibModal, dataservice, UsuarioService) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: UsuarioMenuTopController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
            	'usuario':'=',
            	'logado': '=',
                'loja': '='
            },
            templateUrl: 'app/login/templates/usuario-menu-top.html'
        };



        function UsuarioMenuTopController () {
            var vm = this;

            vm.logoff = logoff;
            vm.cadastroUsuarioLogado = cadastroUsuarioLogado;
            vm.alterarSenha = alterarSenha;
            vm.trocarLoja = trocarLoja;

            activate();
            function activate() {
                var promises = [exibirLoja()];
                $q.all(promises);
            }

            function exibirLoja() {
                //vm.loja = DataserviseProvider.userLogado.lojaAtual;
            }


            function logoff () {
                $cookies.remove('nomeUser');
                $cookies.remove('idUser');
                $cookies.remove('idEmp');
                DataserviseProvider.indexGeral.id_usuario = '';
                DataserviseProvider.indexGeral.id_emp = '';
                vm.logado = false;
                vm.usuario = {};
                $state.go('login');

            }

            function cadastroUsuarioLogado () {
              UsuarioService.editPerfil(vm.usuario).then(function (save){
                UsuarioService.update(save);
              });
            }

            function alterarSenha () {
                var modalInstance = $uibModal.open({
                  templateUrl: 'app/cadastros/usuario/templates/usuario-alterar-senha.html',
                  controller: 'UsuarioModalController',
                  controllerAs: 'vm',
                  size: 'sm',
                  backdrop:true,
                  resolve: {
                    Dados: function () {
                      return {usuario:vm.usuario};
                    }
                  }
                });
	            modalInstance.result.then(function (save) {
                    UsuarioService.update(save);
	            });
            }

            function trocarLoja() {
                var modalInstance = $uibModal.open({
                  templateUrl: 'app/empresa/templates/select-loja.html',
                  controllerAs: 'vm',
                  controller: controllModal,
                  size: 'sm',
                  backdrop:true,
                });
                controllModal.$inject = ['$uibModalInstance','DataserviseProvider'];
                function controllModal($uibModalInstance,DataserviseProvider){
                    var vm = this;
                    var data = DataserviseProvider.getUserLogado();
                    vm.lojas = data.lojas;

                    vm.ok = ok;
                    vm.cancel = cancel;
                    function ok(loja){
                        $uibModalInstance.close(loja);
                        DataserviseProvider.userLogado.lojaAtual = loja;
                        //vm.loja = loja;
                    };

                    function cancel(){
                        $uibModalInstance.dismiss();
                    };
                }
                modalInstance.result.then(function (data) {
                    vm.loja = data;
                });
            }

	        function prmWeb() {          
	            DataserviseProvider.configPrmWebService('id_index_main','id_emp');
	            DataserviseProvider.configPrmWebService('valor_id_main','1');
	            DataserviseProvider.configPrmWebService('modulo','usuarios');
	            DataserviseProvider.configPrmWebService('id_tabela','id_usuario');              
	        }

        }


        return directive;
    }
})();