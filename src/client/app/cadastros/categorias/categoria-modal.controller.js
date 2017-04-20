(function(){
    'use strict';

    angular
        .module('cad.categoria')
        .controller('CategoriaModalController', CategoriaModalController);
    CategoriaModalController.$inject = ['Categorias', '$uibModalInstance', '$scope','$filter', '$uibModal', 'CategoriaService'];
    /* @ngInject */
    function CategoriaModalController(Categorias, $uibModalInstance, $scope, $filter, $uibModal, CategoriaService) {
        var vm = this;
        vm.title = 'Cadastrar de Categorias';
        vm.categorias = Categorias;
        vm.especificao = [
            {value: 'P', text: 'Produto'},
            {value: 'S', text: 'Serviço'}
        ]; 
        vm.popover = {
          templateUrl: 'app/cadastros/categorias/templates/novo.html',
          title: 'Nova Categoria'
        }; 
        //vm.addcat;
        vm.consulta = {id_categoria:"",descricao:""};
        vm.totalRegPag = 10;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        vm.salvar = salvar;
        vm.novo = novo;
        vm.editar = editar;
        vm.deletar = deletar;
        vm.addCategoria = addCategoria;
        vm.ok = ok;
        vm.cancel = cancel;

        function getCategorias() {
            CategoriaService.read(vm.consulta).then(function(data){
              vm.categorias = data.reg;
            });            
        }    

        function salvar(cat) {
            if (cat.id_categoria) {
                editar(cat);
            } else {
                novo(cat);
                vm.addcat = null;
            }
        }
        function addCategoria() {
            vm.addcat = {
                descricao:''
            };
            vm.categorias.push(vm.addcat);
        }

        function novo(save) {
            CategoriaService.create(save).then(function(data){
                getCategorias();
            });
        }

        function editar(save) {
            CategoriaService.update(save).then(function(data){

            });            
        }

        function deletar(del,index) {
            CategoriaService.deletar(del).then(function(data){
                getCategorias();
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