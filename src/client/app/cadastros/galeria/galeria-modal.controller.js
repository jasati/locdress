(function(){
    'use strict';

    angular
        .module('app.galeria')
        .controller('GaleriaModalController', GaleriaModalController);
    GaleriaModalController.$inject = ['Data', '$q', '$uibModalInstance', '$scope', 'config', 'logger','GaleriaService'];
    /* @ngInject */
    function GaleriaModalController(Data, $q, $uibModalInstance, $scope, config, logger,GaleriaService) {
        var vm = this;
        vm.title = 'Selecionar Imagem na Galeria';
        vm.uploader = GaleriaService.upload();
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function(i /*{File|FileLikeObject}*/, options) {
                var type = '|' + i.type.slice(i.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });        
        vm.urlImagem = config.urlImagem;
        vm.galeria = [];
        vm.imgSelect = [];
        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;
        vm.imgSel = 0;
        vm.btnDel = true;
        vm.img = [];
        //////////

        vm.getGaleria = getGaleria;
        vm.selecionarImagem = selecionarImagem;
        vm.deleteImagem = deleteImagem;
        vm.setPage = setPage;
        vm.ok = ok;
        vm.cancel = cancel;
        activate();
        
        ////////////
        function activate() {
            var promises = [getGaleria()];
            return $q.all(promises);
        }

        function getGaleria() {
            GaleriaService.read('',getLimite()).then(function (data) {
                vm.galeria = data.reg;
                vm.totalReg = data.qtde;
            });
        }

        function deleteImagem(img) {
            GaleriaService.deletar(img).then(function(data){
                if (data.status == "ok") {
                    GaleriaService.remImagem(img).then(function (res){
                        getGaleria();
                    });
                } else {
                    logger.warning(data.msg);
                }
            });
        }

        function selecionarImagem (img) {
            vm.imgSel = img.id_galeria;
            vm.img = img;
        }

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }

        function setPage () {
            getGaleria();
        }             

        function ok() {
        	$uibModalInstance.close(vm.img);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();