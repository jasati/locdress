(function(){
    'use strict';

    angular
        .module('cad.modulos')
        .controller('ModulosModalController', ModulosModalController);
    ModulosModalController.$inject = ['ModPerfil', '$uibModalInstance', '$scope','$filter', '$uibModal', 'ModulosService'];
    /* @ngInject */
    function ModulosModalController(ModPerfil, $uibModalInstance, $scope, $filter,$uibModal, ModulosService) {
        var vm = this;
        vm.title = 'Modulos do Sistema';
        vm.modulos = [];
        vm.modulosGr = [];
        vm.modPerfil = ModPerfil;
        vm.consulta = {descricao:"",id_mg:1};

        vm.ok = ok;
        vm.cancel = cancel;
        vm.getModulos = getModulos;

        getModGr();
        getModulos();

        function getModulos() {
            ModulosService.read(vm.consulta).then(function(mod){
                var m = mod.reg;
              vm.modulos = filtrarModPerfil(m);
            });  
        }

        function getModGr() {
            ModulosService.readMgr().then(function(grupo){
              vm.modulosGr = grupo.reg;
            });  
        }        
        function filtrarModPerfil(mod) {
            
            for (var i = 0; i < mod.length; i++) {
                var d = [];
                d = $filter('filter')(vm.modPerfil,{id_modulo:mod[i].id_modulo},true);
                if (d.length > 0) {
                    mod[i].check = 0;
                }
                
            }
            return mod;
        }
        function ok() {
            var data = $filter('filter')(vm.modulos,{select:1});
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();