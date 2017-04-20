(function(){
    'use strict';

    angular
        .module('cad.item')
        .controller('ItemSelModalController', ItemSelModalController);
    ItemSelModalController.$inject = ['$filter','$q', '$modalInstance', '$scope', '$modal', 'config', 'ItemService','logger'];
    /* @ngInject */
    function ItemSelModalController($filter, $q, $modalInstance, $scope, $modal, config, ItemService,logger) {
        var vm = this;
        vm.title = 'Selecionar Item';
        vm.urlImagem = config.urlImagem;
        vm.itens = [];
        vm.consulta = Movimento.consulta;
        vm.totalRegPag = 8;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;  
        vm.formValido = true; 
        vm.tipoMov = Movimento.tipo;     

        vm.setPage = setPage;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.addRemItem = addRemItem;
        vm.keypress = keypress;
        vm.calcular = calcular;
        
        activate();
        ////////////

        function activate() {
            var promises = [ItemService.startDataset(), getItem()];
            return $q.all(promises).then(function() {
                console.log('Selecionar Itens');
            });            
        }


        function addRemItem (index) {
            if (index.select === 0  || index.select === undefined) {
                index.select = 1;
                index.qt = 1;
                index.total = index.qt * index.valor;
                index.id_mov = 0;
                document.getElementById(index.id_item).focus();
            } else {
                index.select = 0;
                index.qt = null;
            }
        }
        function calcular (index) {

            if (vm.tipoMov === 0) {
                if (index.qt !== '' && index.valor !== '') {
                    index.total = index.qt * index.valor;
                }
            } else {
                if (index.qt !== '' && index.custo !== '') {
                    index.valor = index.custo;
                    index.total = index.qt * index.valor;
                }
            }
        }

        function keypress ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode ===13) {
                ok();
            }

        }

        function getItem() {
            ItemService.read(vm.consulta,getLimite()).then(function(data){
              vm.itens = data.reg;
              vm.totalReg = data.qtde;              
            });            
        }      
 
        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getItem();
        }

        function ok() {
            if (vm.formValido) {
                var data = $filter('filter')(vm.itens,{select:1});
                $modalInstance.close(data);                
            } else {
                logger.error('O campo quantidade não pode está vazio em um item selecionado!');
            }
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
    }
})();