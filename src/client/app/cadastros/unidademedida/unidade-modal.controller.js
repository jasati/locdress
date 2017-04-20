(function(){
    'use strict';

    angular
        .module('cad.unidade')
        .controller('UnidadeModalController', UnidadeModalController);
    UnidadeModalController.$inject = ['Data', '$modalInstance', '$scope','$filter', '$modal', 'UnidadeService'];
    /* @ngInject */
    function UnidadeModalController(Data, $modalInstance, $scope, $filter, $modal, UnidadeService) {
        var vm = this;
        vm.title = 'Cadastro de Unidade de Medida';
        vm.unidades= Data; 
        //vm.addreg;
        vm.consulta = {sigla:"",descricao:""};
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

        function getUnidades() {
            UnidadeService.read(vm.consulta).then(function(data){
              vm.unidades = data.reg;
            });            
        }    

        function salvar(reg) {
            if (reg.id_unidade) {
                editar(reg);
            } else {
                novo(reg);
                vm.addreg = null;
            }
        }
        function addNovoReg() {
            vm.addreg = {
                descricao:'',
                sigla:''
            };
            vm.unidades.push(vm.addreg);
        }

        function novo(save) {
            UnidadeService.create(save).then(function(data){
                getUnidades();
            });
        }

        function editar(save) {
            UnidadeService.update(save).then(function(data){

            });            
        }

        function deletar(del,index) {
            UnidadeService.deletar(del).then(function(data){
                getUnidades();
            });
        }
        function ok(data) {
            $modalInstance.close(data);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
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