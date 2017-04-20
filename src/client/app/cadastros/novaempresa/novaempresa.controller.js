(function() {
    'use strict';
    angular
        .module('app.novaempresa')
        .controller('NovaEmpresaController', NovaEmpresaController);
    NovaEmpresaController.$inject = ['$filter','$stateParams','$q','$scope','$cookies','EmpresaService','LojasService','ModContratoService','PerfilService','ModPerfilService','UsuarioService','config','logger','MailChimpProvider','UtilsFunctions','WizardHandler','DataserviseProvider'];
    /* @ngInject */
    function NovaEmpresaController($filter,$stateParams,$q,$scope,$cookies,EmpresaService,LojasService,ModContratoService,PerfilService,ModPerfilService,UsuarioService,config,logger,MailChimpProvider,UtilsFunctions,WizardHandler,DataserviseProvider) {
        var vm = this;
        vm.title = 'Informações para começar';
        vm.icon = 'fa-cog'
        vm.usuario = {};
        vm.empresa = {};
        vm.dias_lic = 0;
        vm.sistema = config.urlSistema;
        var idPerfilUser = null;
        var idLojaUser = null;
        var modeloContrato = '<h1 style="text-align: center;"><b style="text-align: center;">Contrato de Locação de Roupas</b></h1><div>&nbsp; &nbsp; &nbsp; &nbsp; Os signatários, que contratam nas qualidades indicadas neste contrato, tem entre si,</div><div>ajustadas a presente locação, mediante as seguintes condições:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; A LOJA MODELO, inscrita no CNPJ/MF sob nº, 99.999.999/0001-99, com sede na rua XXXXX, nºXX Bairro - Cep:000000-000 Cidade - Estado, neste ato representada na Forma de seu contrato social e de outro lado o contratante denominado de "LOCADOR", resolvem celebrar o presente contrato de locação, nas seguintes condições:</div><div><ol><li>O objeto do presente contrato é a locação de roupas, usadas ou não, e acessórios de uso pessoal, as quais são selecionados e indicados pelo "LOCADOR", pessoalmente na loja física;</li><li>A LOJA MODELO se compromete a disponibilizar ao LOCADOR, as roupas e acessórios, escolhidos e locados em perfeito estado para uso e conservação, da data estabelecida;</li><li>A LOCADORA, por seu vez compromete-se a reservar as peças e / ou acessórios da presente locação a partir da assinatura deste contrato.</li></ol></div>';


        /*funçoes*/
        vm.qtDias = UtilsFunctions.qtDias;
        vm.callSalvarEmp = callSalvarEmp;
        vm.atualizarEmp = atualizarEmp;
        vm.callSalvarUsuario = callSalvarUsuario;
        vm.avancar = avancar;
        vm.loadEmpresa = loadEmpresa;
        vm.verificarDiasLic = verificarDiasLic;
        vm.pagSit = pagSit;
        vm.convDate = convDate
        activate();

        ////////////////
        function activate() {
        	//setMailChimp();
        	if ($stateParams.actv) {
        		if ($cookies.get('idEmp')) {
        			activeEmp($cookies.get('idEmp'));
        		} else {
        			vm.newEmp = false;
        		}
        	} else {
        		vm.newEmp = true;
        	}
        }

        // function setMailChimp() {
	       //  MailChimpProvider.setConfig({
	       //      username: 'jasati',
	       //      dc: 'us10',
	       //      u: '3ac13a5780bbed87724dc432a',
	       //      id:'33c2b80053'
	       //  });        	// body...
        // }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function verificarDiasLic() {
        	if (vm.empresa.data_ativacao) {
	        	var promises = [getData()]
	        	$q.all(promises).then(function (res) {
	        		var dataAt = convDate($filter('date')(res[0],'MM/dd/yyyy'));
	        		var dataExp = convDate($filter('date')(vm.empresa.data_ativacao,'MM/dd/yyyy'));
	        		dataExp.setDate(dataExp.getDate()+vm.empresa.dias_lic)
	        		vm.dias_lic =  vm.qtDias(dataAt,dataExp);
	        	});
        	}
        }

        function avancar() {
        	WizardHandler.wizard().goTo(1);
        }

        function pagSit() {
        	WizardHandler.wizard().goTo(4);
        }

        function callSalvarEmp(formValid) {
        	if (!vm.salvando) {
        		vm.salvando = true;
        		//verificar se a empresa ja existe
    			EmpresaService.load(vm.empresa.cpf_cnpj).then(function (emp) {
    				if (emp.reg.length > 0) {
    					vm.salvando = false;
    					vm.empresa = emp.reg[0];
    					verificarDiasLic();
    					//enviar para pagina de empresa cadastrada
    					WizardHandler.wizard().goTo(3);
    				} else {
    					salvarNovaEmp(formValid);
    				}
    			});
        	}
        }

        function activeEmp(idEmp) {
        	DataserviseProvider.indexGeral.id_emp = idEmp;
        	EmpresaService.load().then(function (emp) {
        		var empresa = emp.reg[0];
        		if (empresa.status == 0) {
        			empresa.status = 1;//ativando
        			getData().then(function(date) {
        				empresa.data_ativacao = date;//data ativacao
	        			EmpresaService.update(empresa).then(function (res) {
	        				$cookies.remove('idEmp');
	        				var msgEmail = '<h2>Bem Vindo a Jasati Sistemas</h2>'+
	        					'<p>Opa! aqui é o Alan, estou te enviando esse e-mail rapidinho para lhe desejar um bem vindo, então Bem Vindo a Jasati Sistemas.</p>'+
	        					'<p>Estou deixando abaixo um link para acesso direto ao app locDress, depois você me responde esse e-mail me falando se conseguiu acessar o sistema e dê sua opinião e sugestão, caso tenha alguma!</p>'+
	        					'</br>'+
	        					'<p><b>Endereço do Sistema: </b><a href="'+config.urlSistema+'">LocDress</a></p>'+
	        					'<p><b>Login: </b>'+empresa.email+'</p>';
	                        var newEmail = {
	                            email:empresa.email,
	                            assunto:'Seu acesso ao sistema LocDress',
	                            mensagem:msgEmail,
	                            head_from:'locdress@jasati.com.br',
	                        };
	                        UsuarioService.enviarEmail(newEmail).then(function (res) {
	                            location.assign(config.urlSistema);
	                        });
	        			});
        			})

        		} else {
        			location.assign(config.urlSistema);
        		}
        	});
        }

        function getData() {
        	return UtilsFunctions.getDataServe().then(function (res) {
        		return res.data;
        	});
        }

        function salvarNovaEmp(formValid) {
        	if (formValid) {
        		vm.empresa.status = 0;//colocar status desativado
        		vm.empresa.id_plano = 1;//plano de para avaliação
        		EmpresaService.create(vm.empresa).then(function (res) {
        			if (res.status == 'ok') {
        				var id_emp = res.last_insert;
        				vm.usuario.nome = vm.empresa.responsavel;
        				vm.usuario.email = vm.empresa.email;
        				criarLojaMatriz(id_emp).then(function (res) {
        					if (res) {
        						criarContratoModelo(id_emp).then(function (res) {
        							if (res) {
        								var promises = [criarPerfils(id_emp)];
        								$q.all(promises).then(function () {
        									vm.empresa.id_empresa = id_emp;
        									setEmpCad(id_emp); //gravar um cookie
        									WizardHandler.wizard().goTo(2);
        									vm.salvando = false;
        								});
        							}
        						});
        					}
        				});
        			}
        		});
        	}
        }

        function criarLojaMatriz(id_empresa) {
        	var loja = {
        		id_empresa:id_empresa,
        		nome:'Matriz',
        		endereco:vm.empresa.endereco,
        		tel:vm.empresa.tel1
        	}
            return LojasService.create(loja).then(function (res) {
            	if (res.status == 'ok') {
            		idLojaUser = res.last_insert;
            		return true;
            	}
            });
        }

        function criarContratoModelo(id_empresa) {
        	var modelo = {
        		id_empresa:id_empresa,
        		contrato:modeloContrato,
        	}
        	return ModContratoService.create(modelo).then(function (res) {
        		if (res.status == 'ok') {
        			return true;
        		}
        	});
        }

        function criarPerfils(id_empresa) {
        	var perfils = {
        		0:{id_empresa:id_empresa,nome:'Administrador'},
        		1:{id_empresa:id_empresa,nome:'Operador'}
        	};
        	angular.forEach(perfils, function(value, key){
        		PerfilService.create(value).then(function (res) {
        			if (res.status = 'ok') {
        				if (value.nome == 'Administrador') {
        					idPerfilUser = res.last_insert;
	        				var modulos = {
	        					0:{id_modulo:1,id_perfil:res.last_insert},
	        					1:{id_modulo:2,id_perfil:res.last_insert},
	        					2:{id_modulo:3,id_perfil:res.last_insert},
	        					3:{id_modulo:4,id_perfil:res.last_insert},
	        					4:{id_modulo:5,id_perfil:res.last_insert},
	        					5:{id_modulo:6,id_perfil:res.last_insert},
	        					6:{id_modulo:7,id_perfil:res.last_insert},
	        					7:{id_modulo:8,id_perfil:res.last_insert},
	        					8:{id_modulo:9,id_perfil:res.last_insert},
	        					9:{id_modulo:10,id_perfil:res.last_insert},
	        					10:{id_modulo:11,id_perfil:res.last_insert},
	        					11:{id_modulo:12,id_perfil:res.last_insert},
	        					12:{id_modulo:13,id_perfil:res.last_insert},
	        					13:{id_modulo:14,id_perfil:res.last_insert},
	        					14:{id_modulo:15,id_perfil:res.last_insert},
	        					15:{id_modulo:16,id_perfil:res.last_insert},
	        					16:{id_modulo:17,id_perfil:res.last_insert},
	        					17:{id_modulo:18,id_perfil:res.last_insert},
	        					18:{id_modulo:19,id_perfil:res.last_insert},
	        					19:{id_modulo:20,id_perfil:res.last_insert},
	        					20:{id_modulo:21,id_perfil:res.last_insert},
	        					21:{id_modulo:22,id_perfil:res.last_insert},
	        					22:{id_modulo:23,id_perfil:res.last_insert},
	        					23:{id_modulo:24,id_perfil:res.last_insert}
	        				};
						} else {
	        				var modulos = {
	        					0:{id_modulo:7,id_perfil:res.last_insert},
	        					1:{id_modulo:13,id_perfil:res.last_insert},
	        					2:{id_modulo:14,id_perfil:res.last_insert},
	        					3:{id_modulo:15,id_perfil:res.last_insert},
	        					4:{id_modulo:17,id_perfil:res.last_insert},
	        					5:{id_modulo:18,id_perfil:res.last_insert},
	        					6:{id_modulo:19,id_perfil:res.last_insert},
	        					7:{id_modulo:20,id_perfil:res.last_insert},
	        					8:{id_modulo:23,id_perfil:res.last_insert}
	        				};
						}
        				ModPerfilService.create(modulos);
        			}
        		});
        	});
        }



        function atualizarEmp() {
          EmpresaService.update(vm.empresa);
        }

        function callSalvarUsuario(formValid) {
        	if (!vm.salvando) {
        		vm.salvando = true;
        		criarNovoUsuario(formValid);
        	}
        }

        function criarNovoUsuario(formValid) {
        	if (formValid) {
        		vm.usuario.id_empresa = vm.empresa.id_empresa;
        		vm.usuario.status = 1;
        		vm.usuario.id_loja = idLojaUser;
        		vm.usuario.id_perfil = idPerfilUser;
        		UsuarioService.create(vm.usuario).then(function (res) {
        			if (res.status == 'ok') {
        				vm.usuario.id_usuario = res.last_insert;
        				var email = {
			        		EMAIL:vm.usuario.email,
			        		FNAME:vm.empresa.responsavel,
			        		LPHONE:vm.empresa.cel
        				};
						MailChimpProvider.subscribe(email).then(function (data) {
							logger.success('O link de ativação foi enviado para o seu email.');
							vm.salvando = false;
							WizardHandler.wizard().goTo(4);
						}, function (error) {
						    logger.danger('Ocorreu uma falha no cadastro do email, '+error+'.');
						    vm.salvando = false;
						});
        			}
        		});
        	}
        }

        function setEmpCad (id_emp) {
            $cookies.put('idEmp',id_emp);
        }

        function loadEmpresa(email) {
        	var data = {
        		email:email,
        	}
        	UsuarioService.buscarEmail(data).then(function (res) {
        		if (res.reg.length > 0) {
        			DataserviseProvider.indexGeral.id_emp =res.reg[0].id_empresa;
        			EmpresaService.load().then(function (emp) {
        				vm.empresa = emp.reg[0];
        				var chimp = {
			        		EMAIL:email,
			        		FNAME:vm.empresa.responsavel,
			        		LPHONE:vm.empresa.cel,
                            CODEMP:vm.empresa.id_empresa,
        				}
        				mailChimp(chimp);
        			});
        		} else {
        			logger.warning('O email informado não foi localizado no cadastro para ser ativado.');
        		}
        	})
        }

        function mailChimp(email) {
			MailChimpProvider.subscribe(email).then(function (data) {
				logger.success('O link de ativação foi envilado para o email, verifique o seu email.');

			}, function (error) {
			    logger.error('Ocorreu uma falha no cadastro do email, '+error);
			});
        }



    }
})();