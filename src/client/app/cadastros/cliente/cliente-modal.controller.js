(function(){
    'use strict';

    angular
        .module('cad.cliente')
        .controller('ClienteModalController', ClienteModalController);
    ClienteModalController.$inject = ['$q','$filter','Data', 'config', 'logger', '$uibModalInstance', '$scope', '$uibModal', 'ClienteService', 'UtilsFunctions'];
    /* @ngInject */
    function ClienteModalController($q,$filter,Data, config, logger, $uibModalInstance, $scope, $uibModal, ClienteService, UtilsFunctions) {
        var vm = this;
        var action = Data.action;
        vm.title = 'Cadastrar Cliente';
        vm.icon = 'fa-group';        
        vm.cliente = Data.cliente;
        vm.getLojas = Data.lojas;

        vm.optEstCivil = [
                {desc:"Solteiro(a)"},
                {desc:"Casado(a)"},
                {desc:"Divorciado(a)"},
                {desc:"Viúvo(a)"},
                {desc:"Separado(a)"},
                {desc:"Companheiro(a)"}
        ];
        vm.ok = ok;
        vm.cancel = cancel;
        vm.getCliCad = getCliCad;
        vm.preeCampoSel = preeCampoSel;
        vm.validarCpf = validarCpf;

        activite();

        function activite() {
            var promises = [setDataEmi(),readLojas(),validarCpf(vm.cliente.cpf)];
            return $q.all;
        }

        function setDataEmi() {
            var dt = $filter('date')(vm.cliente.data_nascimento,'MM/dd/yyyy');
            vm.cliente.data_nascimento = convDate(dt);
            vm.cliente.id_loja = Number(vm.cliente.id_loja);
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getCliCad(cliente,campo) {
            var consulta = {};
            if (campo === 'nome') {
                consulta.nome = cliente;
            } else if (campo === 'rg') {
                consulta.rg = cliente;
            } else if (campo === 'cpf') {
                consulta.cpf = cliente;
            }
            return ClienteService.read(consulta).then(function (data) {
                return data.reg;
            });
        }

        function preeCampoSel(cliSel) {
            vm.cliente = cliSel;
            setDataEmi();
        }
        function readLojas(val) {
            vm.lojas = vm.getLojas();
        }

        function validarCpf(cpf) {
            vm.cpfValido = UtilsFunctions.validaCPF(cpf);
        }
        function ok(data) {
          switch (action){
            case 'create':
              ClienteService.create(data).then(function(res){
                  if (res.status === 'ok') {
                    $uibModalInstance.close();
                  }
              });
              break;
            case 'update':
              ClienteService.update(data).then(function(res){
                  if (res.status === 'ok') {
                    $uibModalInstance.close();
                  }
              });
              break;
          }
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();