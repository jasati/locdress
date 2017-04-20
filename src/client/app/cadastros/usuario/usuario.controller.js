(function () {
    'use strict';

    angular
        .module('cad.usuario')
        .controller('UsuarioController', UsuarioController);

    UsuarioController.$inject = ['$q', 'logger', 'routerHelper','UsuarioService', '$uibModal'];
    /* @ngInject */
    function UsuarioController($q, logger, routerHelper,UsuarioService, $uibModal) {
        var vm = this;
        vm.title = 'Usuarios do Sistema';
        vm.icon = 'fa-user';
        vm.subtitle = 'Cadastrar os usuarios para acesso ao sistema.';                
        vm.itens = [];
        vm.usuarios = [];
        vm.perfils = [];
        vm.modPerfils = [];
        vm.secretarias = [];
        vm.consulta = {nome:"",status:1,codigo:"",id_perfil:"",email:"",login:"",id_loja:"",avancado:false};
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.popover = {
          templateUrl: 'app/cadastros/usuario/templates/pesquisa.html',
          title: 'Pesquisa Avançada'
        }; 
        vm.lojas = UsuarioService.getLoja.lojas;
        vm.permissao = UsuarioService.verificarPermissao;
        vm.getUsuario = getUsuario;
        vm.getPerfil = getPerfil;
        vm.getModPerfil = getModPerfil;
        vm.editUsuario = editUsuario;
        vm.newUsuario = newUsuario;
        vm.deleteUsuario = deleteUsuario;
        vm.setPage = setPage;
        vm.pesquisaAvancada = pesquisaAvancada;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.cadPerfil = cadPerfil;
        vm.edtPerfil = edtPerfil;
        vm.pesquisa = pesquisa;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
          $q.all([vm.permissao(1)]).then(function(data){
            if (data) {
              var promises = [getUsuario(),getPerfil()];
              return $q.all(promises).then(function() {
                  logger.info('Janela Usuário Ativada');
              });
            } else {
              logger.warning('Acesso Negado!');
            }
          });
        }

        function getUsuario() {
            UsuarioService.getUsuario(vm.consulta,getLimite()).then(function(data){
              vm.usuarios = data.reg;
              vm.totalReg = data.qtde;              
            });            
        } 

        function getPerfil() {
            UsuarioService.getPerfil(vm.consulta).then(function(data){
              vm.perfils = data.reg;
            });            
        }
        function getModPerfil(perfil) {
          var cons = {id_perfil:perfil};
            UsuarioService.getModPerfil(cons).then(function(data){
              vm.modPerfils = data.reg;
            });            
        }
        function pesquisaAvancada() {
          vm.consulta.avancado = true;
          getUsuario();
        }
        function limparPesqAvancada() {
          vm.consulta.nome = "";
          vm.consulta.login = "";
          vm.consulta.status = 1;
          vm.consulta.codigo = "";
          vm.consulta.id_perfil = "";
          vm.consulta.email = "";
          // body...
        }

        function newUsuario() {
          if (vm.permissao(2)) {
            UsuarioService.newUsuario().then(function (save) {
              getUsuario();
            });
          }
        }   

        function edtPerfil(index) {
          UsuarioService.editPerfil(index).then(function (save){
            alert(save);
          });
        }

        function editUsuario(index) {
          if (vm.permissao(2)) {
            UsuarioService.editUsuario(index).then(function (save) {

            });
          }
        }

        function deleteUsuario(index) {
          if (vm.permissao(2)) {
            var data = {
              usuario:index,
            };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/usuario/templates/delete.html',
              controller: controllModal,
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Data: function () {
                  return data;
                }
              },
            });
            controllModal.$inject = ['$uibModalInstance','Data'];
            function controllModal($uibModalInstance,Data) {
              var vm = this;
              vm.usuario = Data.usuario;

              vm.ok = ok;
              vm.cancel = cancel;

              function ok(del) {
                UsuarioService.deletar(del).then(function(data){
                  getUsuario();
                });
                $uibModalInstance.close(del);
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
          }
        }    

        function cadPerfil() {
          if (vm.permissao(5)) {
            UsuarioService.cadPerfil().then(function (save) {
              getPerfil();
            });
          }
        }
         function pesquisa() {
          var data = {
            consulta:vm.consulta,
          };
            var modalInstance = $uibModal.open({
              templateUrl: 'app/cadastros/usuario/templates/pesquisa.html',
              controller: controllModal,
              controllerAs: 'vm',
              size: '',
              backdrop:false,
              resolve: {
                Data: function () {
                  return data;
                }
              },
            });
            controllModal.$inject = ['$uibModalInstance','Data'];
            function controllModal($uibModalInstance,Data) {
              var vm = this;
              vm.consulta = Data.consulta;

              vm.ok = ok;
              vm.cancel = cancel;
              vm.limpar = limpar;

              function limpar (){
                limparPesqAvancada();
              }

              function ok() {
                getUsuario();
                $uibModalInstance.close();
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            }            
        }                
      

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getUsuario();
        }

    }
})();
