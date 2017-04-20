(function(){
    'use strict';

    angular
        .module('sis.consulta')
        .controller('ZoomImgController', ZoomImgController);
    ZoomImgController.$inject = ['Data', '$uibModalInstance', '$scope', 'config'];
    /* @ngInject */
    function ZoomImgController(Data, $uibModalInstance, $scope, config) {
        var vm = this;
        vm.title = 'Cadastro Item';
        vm.item = Data.item;
        vm.pathImg = config.urlImagem;

        vm.ok = ok;
        vm.cancel = cancel;

        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();