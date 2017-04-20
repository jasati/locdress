(function(){
    'use strict';

    angular
        .module('cad.perfil')
        .controller('PerfilModModalController', PerfilModModalController);
    PerfilModModalController.$inject = ['Perfil', '$uibModalInstance', '$scope', '$uibModal', 'ModPerfilService'];
    /* @ngInject */
    function PerfilModModalController(Perfil, $uibModalInstance, $scope, $uibModal, ModPerfilService) {
        var vm = this;
        vm.title = 'Modulos do Perfil';
        vm.perfil = Perfil;
        vm.modPerfil = [];
        vm.consulta = {id_perfil:vm.perfil.id_perfil,descricao:""};

        vm.ok = ok;
        vm.cancel = cancel;
        vm.getModPerfil = getModPerfil;
        vm.incModulos = incModulos;
        vm.deletar = deletar;


        getModPerfil();

        function getModPerfil() {
            ModPerfilService.read(vm.consulta).then(function(data){
              vm.modPerfil = data.reg;
            });  
        }
        function incModulos() {
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/modulossys/templates/selecionar-modulos.html',
              controller: 'ModulosModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                ModPerfil: function () {
                  return vm.modPerfil;
                }
              }
            });
            
            modalInstance.result.then(function (save) {
                for (var i = 0; i < save.length; i++) {
                    save[i].id_perfil = vm.perfil.id_perfil;
                }
                ModPerfilService.create(save).then(function (data){
                    getModPerfil();
                });
            });
        }
        function deletar(del,index) {
            ModPerfilService.deletar(del).then(function(data){
                getModPerfil();
            });
        }
        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();