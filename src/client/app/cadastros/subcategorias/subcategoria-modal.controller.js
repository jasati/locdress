(function(){
    'use strict';

    angular
        .module('cad.subcategoria')
        .controller('SubCategoriaModalController', SubCategoriaModalController);
    SubCategoriaModalController.$inject = ['Data', '$uibModalInstance', '$scope','$filter', '$uibModal', 'SubCategoriaService'];
    /* @ngInject */
    function SubCategoriaModalController(Data, $uibModalInstance, $scope, $filter, $uibModal, SubCategoriaService) {
        var vm = this;
        vm.title = 'Cadastrar Sub-Categorias';
        vm.subcategorias = Data.subcategorias;
        vm.categorias= Data.categorias; 
        //vm.addreg;
        vm.consulta = {id_categoria:"",descricao:""};
        vm.totalRegPag = 10;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        vm.salvar = salvar;
        vm.novo = novo;
        vm.editar = editar;
        vm.deletar = deletar;
        vm.addNovoReg = addNovoReg;
        vm.ok = ok;
        vm.cancel = cancel;

        function getSubCategorias() {
            SubCategoriaService.read(vm.consulta).then(function(data){
              vm.subcategorias = data.reg;
            });            
        }    

        function salvar(reg) {
            if (reg.id_subcat) {
                editar(reg);
            } else {
                novo(reg);
                vm.addreg = null;
            }
        }
        function addNovoReg() {
            vm.addreg = {
                descricao:'',
                id_categoria:''
            };
            vm.subcategorias.push(vm.addreg);
        }

        function novo(save) {
            SubCategoriaService.create(save).then(function(data){
                getSubCategorias();
            });
        }

        function editar(save) {
            SubCategoriaService.update(save).then(function(data){
                getSubCategorias();
            });            
        }

        function deletar(del,index) {
            SubCategoriaService.deletar(del).then(function(data){
                getSubCategorias();
            });
        }
        function ok(data) {
            $uibModalInstance.close(data);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
        angular.element(document.body).popover({
            selector: '[rel=popover]',
            trigger: "click"
        }).on("show.bs.popover", function(e){
            angular.element("[rel=popover]").not(e.target).popover("destroy");
             angular.element(".popover").remove();
        });        
    }
})();