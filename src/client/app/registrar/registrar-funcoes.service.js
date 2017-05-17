(function() {
    'use strict';
    angular
        .module('app.registrar')
        .service('RegistrarFuncService', RegistrarFuncService);
    RegistrarFuncService.$inject = ['$q','$state','RegistrarService','UsuarioService','PerfilService','ModPerfilService','ModContratoService','LojasService','EmpresaService','DataserviseProvider','LoginFuncService'];
    /* @ngInject */
    function RegistrarFuncService($q,$state,RegistrarService,UsuarioService,PerfilService,ModPerfilService,ModContratoService,LojasService,EmpresaService,DataserviseProvider,LoginFuncService) {
        this.funcoes = funcoes;
        ////////////////
        function funcoes() {
        	var vm = this;
        	vm.empresa     = {};
        	vm.usuario     = {};
        	vm.loja        = {};
        	vm.contratoMod = {};
        	vm.perfilAdm   = {};
        	vm.perfilUser  = {};
        	vm.salvando = false;
        	vm.erroConfirmCad = false;
        	vm.statusConfimCad = 0;
        	var newContato = function () {
				vm.newContatoGetResponse().then(function (responseGet) {
					if (responseGet.status == 'ok') {
						vm.setCookieUser();
						$state.go('aguardconfirm');
					}
				});
				//$state.go('aguardconfirm');
        	}

        	// vm.registrar = function (registro,valid) {empresa
        	// 	if (valid) {
        	// 		vm.salvando = true;
	        // 		if (vm..id_empresa) {
	        // 			if (vm.usuario.id_usuario) {
	        // 				newContato();
	        // 			}
	        // 		} else {
	        // 			vm.empresa = {
		       //              nome:registro.nome,
		       //              responsavel:registro.responsavel,
		       //              email:registro.email,
		       //              cel:registro.cel,
		       //              status:1
	        // 			};
	        // 			vm.usuario = {
		       //              nome:registro.responsavel,
		       //              email:registro.email,
		       //              senha:registro.senha,
		       //              status:1,
	        // 			};
	        // 			vm.getUsuario(vm.usuario.email).then(function (responseUser) {
	        // 				if (responseUser.reg.length > 0) {
	        // 					vm.usuario = responseUser.reg[0];
	        // 					vm.getEmpresa(vm.usuario.id_empresa).then(function (responseEmp) {
	        // 						vm.empresa = responseEmp.reg[0];
	        // 						vm.empresaJaCad();
	        // 					});
	        // 				} else {
	        // 					EmpresaService.create(vm.empresa).then(function (responseEmp) {
	        // 						if (responseEmp.status == 'ok') {
	        // 							vm.empresa.id_empresa = responseEmp.last_insert;
	        // 							vm.usuario.id_empresa = responseEmp.last_insert;
	        // 							if (vm.usuario.id_usuario) {
	        // 								newContato();
	        // 							} else {
	        // 								vm.newUser().then(function (responseNewUser) {
	        // 									if (responseNewUser.status == 'ok') {
	        // 										vm.usuario.id_usuario = responseNewUser.last_insert;
	        // 										newContato();
	        // 									}
	        // 								});
	        // 							}
	        // 						}
	        // 					});
	        // 				}
	        // 			});
	        // 		}
        	// 	}
        	// }
        	// 

        	vm.registrar = function (registro,valid) {
        		if (valid) {
        			vm.empresa = {
	                    nome:registro.nome,
	                    responsavel:registro.responsavel,
	                    email:registro.email,
	                    status:1
        			};
        			vm.usuario = {
	                    nome:registro.responsavel,
	                    email:registro.email,
	                    senha:registro.senha,
	                    status:1,
        			};
        			vm.getUsuario(vm.usuario.email).then(function (responseUser) {
        				if (responseUser.reg.length > 0) {
        					vm.usuario = responseUser.reg[0];
        					vm.getEmpresa(vm.usuario.id_empresa).then(function (responseEmp) {
        						vm.empresa = responseEmp;
        						vm.empresaJaCad();
        					});
        				} else {
        					EmpresaService.create(vm.empresa).then(function (responseEmp) {
        						if (responseEmp.status == 'ok') {
        							vm.empresa.id_empresa = responseEmp.last_insert;
        							vm.usuario.id_empresa = responseEmp.last_insert;
    								vm.newUser().then(function (responseNewUser) {
    									if (responseNewUser.status == 'ok') {
    										vm.usuario.id_usuario = responseNewUser.last_insert;
    										vm.setCookieUser();
    										$state.go('confirmareg',{confirm:vm.empresa.email,idemp:vm.empresa.id_empresa});
    									}
    								});
        						}
        					});
        				}
        			});
	        		
        		}
        	}

        	vm.confirmarCadastro = function (conf,idemp) {//o codigo da confirmação e o id da empresa
        		vm.erroConfirmCad = false; //inciar sem erro
        		vm.statusConfimCad = 0; //iniciar o status em 0

        		var criandoPerfil = function () {
					vm.criarPerfilAdm().then(function (respPerf) {
						if (respPerf.status == 'ok') {
							vm.perfilAdm.id_perfil = respPerf.last_insert;
							vm.usuario.id_perfil = respPerf.last_insert;
							vm.statusConfimCad = 5;
							atualizarUsuario();
						} else {
							vm.erroConfirmCad = true;
						}
					});
        		};

        		var atualizarUsuario = function () {
					UsuarioService.update(vm.usuario).then(function (respUser) {
						if (respUser.status == 'ok') {
							vm.statusConfimCad = 6;
							vm.realizarLogin();
						}
					});
        		};

        		if (conf == '' || idemp == '') {
        			logger.danger('Link de confirmação invalido.');
        			$state.go('aguardconfirm');
        		} else {
        			vm.getEmpresa(idemp).then(function (responseEmp) {
        				if (!responseEmp.id_empresa) {
        					logger.danger('Link de confirmação invalido.');
        					$state.go('aguardconfirm');
        				} else {
        					vm.empresa = responseEmp;
        					vm.empresa.cad_confirm = conf;
        					EmpresaService.update(vm.empresa).then(function (resp) {
        						if (resp.status == 'ok') {
        							vm.getUsuario(vm.empresa.email).then(function (respUser) {
        								vm.usuario = respUser.reg[0];
	        							vm.statusConfimCad = 1;
	        							if (!vm.contratoMod.id_empresa) {
	        								vm.criarContratoModelo();
	        								vm.statusConfimCad = 2;
	        							}

	        							if (!vm.perfilUser.id_perfil) {
	        								vm.criarPerfilUser();
	        								vm.statusConfimCad = 3;
	        							}

	        							if (!vm.loja.id_loja) {
	        								vm.criarLojaMatriz().then(function (respLoja) {
	        									if (respLoja.status == 'ok') {
	        										vm.loja.id_loja = respLoja.last_insert;
	        										vm.usuario.id_loja = respLoja.last_insert;
	        										vm.statusConfimCad = 4;
	        										criandoPerfil();
	        									} else {
	        										vm.erroConfirmCad = true;
	        									}
	        								});
	        							} else if (!vm.perfilAdm.id_perfil) {
	        								criandoPerfil();
	        							}
        							});
        						}
        					});
        				}
        			});
        		}
        	}

        	vm.newContatoGetResponse = function () {
	            var contato = {
	                name:vm.empresa.responsavel,
	                email:vm.empresa.email,
	                dayOfCycle:0,
	                campaign:{
	                    campaignId:"T5U0E",
	                },
	                customFieldValues:[{
	                    customFieldId:"uX9Xw",
	                    value:[vm.empresa.id_empresa.toString()]
	                }]
	            };
	            return RegistrarService.mailGetResponse(contato).then(function (res) {
	                return res
	            });
        	}

        	vm.setCookieUser = function () {
        		var login = new LoginFuncService.funcoes();
        		login.setUserLogado(vm.usuario.nome,vm.usuario.id_usuario,vm.empresa.id_empresa);
        	}

        	vm.realizarLogin = function () {
                var login = new LoginFuncService.funcoes();
                login.fazerLogin();
        	}

        	vm.getUsuario = function (email) {
        		var data = {
        			email:email,
        		};
        		return UsuarioService.buscarEmail(data).then(function (res) {
    				return res;

        		})

        	}

        	vm.getEmpresa = function (id_emp) {
        		DataserviseProvider.indexGeral.id_emp = id_emp;
        		return EmpresaService.load().then(function (res) {
        			return res.reg[0];
        		});
        	}

        	vm.newUser = function () {
	            var criar = function (usuario) {
					return UsuarioService.create(usuario).then(function(res){
	                    return res;
	            	});
	            }
	    		var promises = [criar(vm.usuario)];
	    		return $q.all(promises).then(function (data) {
	    			return data[0];
	    		});
        	}

        	vm.empresaJaCad = function () {
        		if (vm.empresa.cad_confirm) {
        			$state.go('login');
        		} else {
        			$state.go('confirmareg',{confirm:vm.empresa.email,idemp:vm.empresa.id_empresa});
        		}
        	}

        	vm.reEnviarEmailGetResponse = function (email) {
        		var atualizaNewEmail = function () {
        			vm.empresa.email = email;
        			vm.usuario.email = email;
        			return EmpresaService.update(vm.empresa).then(function (res) {
        				if (res.status == 'ok') {
        				 	return UsuarioService.update(vm.usuario).then(function (resUser) {
        						if (resUser.status == 'ok') {
        							vm.newContatoGetResponse().then(function (ret) {
        								if (ret.status == 'ok') {
        									return true;
        								} else {
        									return false;
        								}
        							});
        						}
        					});
        				}
        			});
        		}

        		if (vm.usuario.id_usuario) {
        			if (email === vm.usuario.email) {
						vm.newContatoGetResponse().then(function (ret) {
							if (ret.status == 'ok') {
								return true;
							} else {
								return false;
							}
						});
        			} else {
        				return atualizaNewEmail();
        			}
        		} else {
        			return vm.getUsuario(email).then(function (resUser) {
        				if (resUser.reg.length > 0) {
        					vm.usuario = resUser.reg[0];
        					return vm.getEmpresa(vm.usuario.id_empresa).then(function (resEmp) {
        						vm.empresa = resEmp;
        						return vm.newContatoGetResponse().then(function (ret) {
        							if (ret.status == 'ok') {
        								return true;
        							} else {
        								return false;
        							}
        						})
        					});
        				}
        			})
        		}
        	}


        	vm.criarLojaMatriz = function () {
	            vm.loja = {
	                id_empresa:vm.empresa.id_empresa,
	                nome:'Matriz'
	            };
	            return LojasService.create(vm.loja).then(function (res) {
                    return res;
	            });
        	}

        	vm.criarContratoModelo = function () {
	            vm.contratoMod = {
	                id_empresa:vm.empresa.id_empresa,
	                contrato:'<h1 style="text-align: center;"><b style="text-align: center;">Contrato de Locação de Roupas</b></h1><div>&nbsp; &nbsp; &nbsp; &nbsp; Os signatários, que contratam nas qualidades indicadas neste contrato, tem entre si,</div><div>ajustadas a presente locação, mediante as seguintes condições:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; A LOJA MODELO, inscrita no CNPJ/MF sob nº, 99.999.999/0001-99, com sede na rua XXXXX, nºXX Bairro - Cep:000000-000 Cidade - Estado, neste ato representada na Forma de seu contrato social e de outro lado o contratante denominado de "LOCADOR", resolvem celebrar o presente contrato de locação, nas seguintes condições:</div><div><ol><li>O objeto do presente contrato é a locação de roupas, usadas ou não, e acessórios de uso pessoal, as quais são selecionados e indicados pelo "LOCADOR", pessoalmente na loja física;</li><li>A LOJA MODELO se compromete a disponibilizar ao LOCADOR, as roupas e acessórios, escolhidos e locados em perfeito estado para uso e conservação, da data estabelecida;</li><li>A LOCADORA, por seu vez compromete-se a reservar as peças e / ou acessórios da presente locação a partir da assinatura deste contrato.</li></ol></div>',
	            }
	            return ModContratoService.create(vm.contratoMod).then(function (res) {
	                return true;
	            });
        	}

        	vm.criarPerfilAdm = function () {
	            vm.perfilAdm = {
	                id_empresa:vm.empresa.id_empresa,
	                nome:'Administrador'
	            };
	            return PerfilService.create(vm.perfilAdm).then(function (res) {
	                if (res.status = 'ok') {
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
	                    ModPerfilService.create(modulos);
	                    return res;
	                }
	            });
        	}

        	vm.criarPerfilUser = function () {
	            vm.perfilUser = {
	                id_empresa:vm.empresa.id_empresa,
	                nome:'Operador'
	            };

	            return PerfilService.create(vm.perfilUser).then(function (res) {
	                if (res.status = 'ok') {
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
	                    ModPerfilService.create(modulos);
	                    return true;
	                }
	            });
        	}


        	/*end func*/
        }
    }
})();