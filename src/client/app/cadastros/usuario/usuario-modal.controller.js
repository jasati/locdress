(function(){
    'use strict';

    angular
        .module('cad.usuario')
        .controller('UsuarioModalController', UsuarioModalController);
    UsuarioModalController.$inject = ['$q','Dados','$scope', '$uibModalInstance','UsuarioService','logger','config'];
    /* @ngInject */
    function UsuarioModalController($q,Dados, $scope, $uibModalInstance,UsuarioService,logger,config) {
        var vm = this;
        var action = Dados.action;
        vm.title = 'Cadastrar Usuario';
        vm.icon = 'fa-user';        
        vm.usuario = Dados.usuario;
        vm.perfils = Dados.perfils;
        vm.secretarias = Dados.secretarias;
        vm.modPerfils = Dados.modPerfils;
        vm.lojas = UsuarioService.getLoja.lojas;
        vm.optnivel = [
            {valor:0,descricao:'Administrador'},
            {valor:1,descricao:'Usuário'},
        ];
        vm.senha = {
            oldsenha : '',
            newsenha : '',
            rsenha : ''
        };
        vm.senhaInvalida = false;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.validaSenha = validaSenha;
        vm.getModPerfil = getModPerfil;
        vm.salvar = salvar;

        
        ////////////

        activate();

        function activate() {
            var promises = [getModPerfil(vm.usuario.id_perfil)];
            return $q.all(promises).then(function() {
            });
        }
        function validaSenha(senha){
            var prm = {
                logar:0,
                login:vm.usuario.login,
                senha:senha.oldsenha
            };
            UsuarioService.validaSenha(prm).then(function (user) {
                if (senha.oldsenha == user.reg[0].senha) {
                    vm.usuario.senha = senha.newsenha;
                    ok(vm.usuario);
                } else {
                    vm.senhaInvalida = true;
                }                
            });

        }
        function getModPerfil(perfil) {
            if (perfil) {
                var cons = {id_perfil:perfil};
                UsuarioService.getModPerfil(cons).then(function(data){
                  vm.modPerfils = data.reg;
                });          
            }  
        }

        function salvar(usuario) {
            switch (action){
                case 'create':
                    usuario.senha = gerarSenha();
                    UsuarioService.create(usuario).then(function (res) {
                        if (res.status == 'ok') {
                            enviarSenhaEmail(usuario).then(function (res) {
                                if (res.status == 'ok') {
                                    logger.success('A senha foi enviada para o email: '+usuario.email);
                                } else {
                                    logger.warning('A senha não foi enviada para o email informado, verifique o email.');
                                }
                                ok();
                            });
                        }
                    });
                    break;
                case 'update':
                    UsuarioService.update(usuario).then(function (res) {
                        if (res.status == 'ok') {
                            ok();
                        }
                    });
                    break;
            }
        }

        function gerarSenha() {
            var dt = new Date();
            var senha = dt.getDate()+dt.getTime();
            var mensx="";
            var l="";
            var i;
            var j=0;
            var ch;
            senha = senha.toString();
            ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm!@#$%&*()_-=+9876543210:;>.<,|}^]{[/?HhGgFfDdSsMm"; 
            for (i=0;i<senha.length; i++){
                l+=senha.substr(i,1);
                j++;
                if (j==2) {
                    l=Number(l);
                    mensx+=ch.substr(l,1);
                    j=0;
                    l="";
                }
            }
            return mensx;
        }

        function enviarSenhaEmail(user) {
            var msg = 
                "<h1>Bem vindo ao locDress <small>Controle de aluguel e reservas de trajes.</small></h1>"+
                "<h3>Abaixo esta os dados para acesso ao sistema</h3>"+
                "<p><b>Link para acessar o sistema : </b><a href='"+config.urlSistema+"'>Click Aqui</a></p>"+
                "<p><b>Login : </b>"+user.email+"</p>"+
                "<p><b>Senha : </b> "+user.senha+"</p>";
            var email = {
                email:user.email,
                assunto:'Senha de Acesso ao locDress',
                mensagem:msg,
                head_from:'locdress@jasati.com.br',
            }
            return UsuarioService.enviarEmail(email).then(function (res) {
                return res;
            });
        }

        function ok(save) {
        	$uibModalInstance.close(save);
        }
        function cancel(){
        	$uibModalInstance.dismiss('cancel');
        }
    }
})();