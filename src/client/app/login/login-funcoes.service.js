(function() {
    'use strict';
    angular
        .module('app.login')
        .service('LoginFuncService', LoginFuncService);
    LoginFuncService.$inject = ['$state','$q','DataserviseProvider','UsuarioService', 'logger', '$cookies', 'config','EmpresaService','LojasService','UtilsFunctions','LicencasService'];
    /* @ngInject */
    function LoginFuncService($state,$q,DataserviseProvider, UsuarioService, logger, $cookies, config,EmpresaService,LojasService,UtilsFunctions,LicencasService) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
        	var vm = this;

	        vm.appTitulo = config.appTitle;
	        vm.appSubTitulo = config.appSubtitle;
	        vm.usuario = {logando : false};

	        var consulta = {
	                'login':"",
	                'senha':"",
	                'id_usuario':"",
	                'logar':1 //essa informação será para 0 ser logado pelo campo login
	                          //e 1 pelo campo email
	            };


	        /*funções retornos externos*/
	        var login = function (func) {
	            consulta.email = func.usuario.email;
	            consulta.senha = func.usuario.senha;	        	
	        	var promises = [func,UsuarioService.login(consulta)]
	        	return $q.all(promises).then(function (resp) {
	        		return resp;
	        	});
	        };


	        vm.logar = function () {
	            vm.usuario.logando = true;
	            login(vm).then(function(resp) {
	            	var func = resp[0];
	            	var user = resp[1];
	                if (user) {
	                    if (user.reg.length!==0) {//verifica se achou usuario
	                        if (user.reg[0].status == 1){ //usuario esta ativo
	                        	func.usuario = user.reg[0];
                                DataserviseProvider.indexGeral.id_usuario = func.usuario.id_usuario;
                                DataserviseProvider.userLogado.usuario = func.usuario;
	                        	//preencher a constante para consulta da empresa
	                            DataserviseProvider.indexGeral.id_emp = func.usuario.id_empresa;
	                            EmpresaService.load().then(function (emp) {
	                                if (emp.reg[0].status == 1){ //empresa esta ativa
	                                	DataserviseProvider.userLogado.empresa = emp.reg[0];
	                                	//o cadastro foi confirmado?
	                                	if (emp.reg[0].cad_confirm != null) {
		                                	//buscar as lojas da empresa
		                                    LojasService.read('').then(function (lojas){
		                                        DataserviseProvider.userLogado.lojas = lojas.reg;
		                                        DataserviseProvider.userLogado.lojaAtual = UtilsFunctions.where(lojas.reg,'id_loja',func.usuario.id_loja,false);
		                                        func.loja = DataserviseProvider.userLogado.lojaAtual;
			                                    var cons={
			                                    	id_perfil:func.usuario.id_perfil
			                                    };
			                                    UsuarioService.getModPerfil(cons).then(function(mod){
			                                        DataserviseProvider.userLogado.modulos = mod.reg;
			                                        UsuarioService.atDadosLogin(func.usuario);
			                                        func.setUserLogado(func.usuario.nome,func.usuario.id_usuario,func.usuario.id_empresa);
			                                        $state.go('shell.dashboard');
			                                    });
		                                    });
	                                    } else {
	                                    	$state.go('aguardconfirm');
	                                    }
	                                } else {
	                                    $state.go('suspenso');
	                                }
	                            });
	                        } else {
	                            logger.info('Esse usuário está desativado, Entre em contato com o administrador.');
	                            func.usuario.logando = false;
		    					if ($state.current.name !== 'login'){
		    						$state.go('login');
		    					}
	                        }
	                    } else {
	                        logger.warning("Usuário ou senha inválidos.");
	                        func.setConsulta();
	                        func.usuario.logando = false;
	                        if ($cookies.get('idUser')) {
	                        	func.logoff();
	                        }
	                    }
	                } else {
	                    logger.error('O servidor não retornou os dados solicitado.');
	                    func.usuario.logando = false;
	                }
	            });
	        }


	        vm.setConsulta = function() {
	            consulta = {
	                'login':"",
	                'senha':"",
	                'id_usuario':"",
	                'logar':1 //essa informação será para 0 ser logado pelo campo login
	                          //e 1 pelo campo email
	            };
	        }

	        vm.fazerLogin = function () {
	            if ($cookies.get('idUser')) {
	                consulta.id_usuario = $cookies.get('idUser');//getUserLogado('idUser')
	                vm.logar();
	            } else {
	                $state.go('login');
	            }
	        }

            vm.logoff = function () {
                $cookies.remove('nomeUser');
                $cookies.remove('idUser');
                $cookies.remove('idEmp');
                DataserviseProvider.indexGeral.id_usuario = '';
                DataserviseProvider.indexGeral.id_emp = '';
                vm.logado = false;
                vm.usuario = {};
                $state.go('login');
            }

	        vm.setUserLogado = function (nome,id,id_emp) {
	            $cookies.put('nomeUser',nome);
	            $cookies.put('idUser',id);
	            $cookies.put('idEmp',id_emp);
	            vm.logado = true;
	        }

	        vm.getUserLogado = function (prm) {
	             return $cookies[prm];
	        }

	        vm.recuperarSenha = function(email) {
	            vm.usuario.rec = true;
	            var data = {
	                email:email,
	            }
	            UsuarioService.buscarEmail(data).then(function (res) {
	                if (res.reg.length!==0 ) {
	                    var user = res.reg[0];
	                    var msg = "<p>Olá "+user.nome+",</p>"+
	                        "<p>Você solicitou o reenvio da sua senha de acesso ao sistema</p>"+
	                        "<p>Login : <b>"+user.email+"</b></p>"+
	                        "<p>Senha : <b>"+user.senha+"</b></p>";
	                    var enviar = {
	                        email:user.email,
	                        assunto:'Senha de Acesso ao locDress',
	                        mensagem:msg,
	                        head_from:'locdress@jasati.com.br',
	                    };

	                    UsuarioService.enviarEmail(enviar).then(function (res) {
	                        if (res.status == 'ok') {
	                            logger.success('A senha foi enviada para o email: '+user.email);
	                        } else {
	                            logger.warning('A senha não foi enviada para o email informado, verifique o email.');
	                        }
	                        vm.usuario.rec = false;
	                    });
	                } else {
	                    logger.warning('Email não encontrado no sistema.');
	                    vm.usuario.rec = false;
	                }
	            });
	        }
        }
    }
})();