(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('UtilsFunctions', UtilsFunctions);
    UtilsFunctions.$inject = ['$filter', 'Extencio','config','dataservice','DataserviseProvider'];
    /* @ngInject */
    function UtilsFunctions($filter, Extencio,config,dataservice,DataserviseProvider) {
        var service = {
            formatData: formatData,
            formatDataView : formatDataView,
            removeCamposInvalidos:removeCamposInvalidos,
            soma  : soma,
            permissao : permissao,
            copiarObjecto: copiarObjecto,
            porExtencio:porExtencio,
            where : where,
            validaCPF : validaCPF,
            existe   : existe,
            getDataServe : getDataServe,
            qtDias : qtDias,
        };
        return service;
        ////////////////
        function formatData (data, hora) {
            var d, m, y,hr='', dt;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            if (hr !== '') {
                dt = y+'-'+m+'-'+d+' '+hr;  
            } else {
                dt = y+'-'+m+'-'+d;  
            }
            return dt;              
        }

        function formatDataView (data, hora) {
            var d, m, y,hr='', dt;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            if (hr !== '') {
                dt = m+'/'+d+'/'+y+' '+hr;  
            } else {
                dt = m+'/'+d+'/'+y;  
            }
            return dt;              
        }        

        function removeCamposInvalidos (dados,camposInv) {
          for (var i = 0; i < camposInv.length; i++) {
            delete dados[camposInv[i]];
          }
          return dados;
        }

        function soma(array,rowQt,rowValue) {
            var total = 0;
            angular.forEach(array, function(row, key){
                if (rowQt!=='') {
                    var valor = row[rowQt]*row[rowValue];
                    total = total + valor;
                } else {
                    total = total + row[rowValue];
                }
            });
            return total.toFixed(2);
        }

        function permissao(arrayModUser,idModSis) {
            if (config.modPerm) {//se o modulo de permissoes estiver habilitado
                var p = [];
                for (var i = 0; i < arrayModUser.length; i++) {
                    if (arrayModUser[i].id_modulo===idModSis) {
                        p.push(arrayModUser[i]);
                        break;
                    }
                }
                if (p.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;//se nao estiver habilitado, permitir acesso livre
            }
        }

        function copiarObjecto(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            var temp = obj.constructor();
            for (var key in obj) {
                temp[key] = copiarObjecto(obj[key]);
            }
            return temp;
        }

        function porExtencio(valor) {
            return Extencio.porExtencio(valor);
        }

        function where(array,field,filtro,all) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i][field] === filtro) {
                    if (all) {//todos os registro que encontrar
                        result.push(array[i]);
                    }else{//somente o primeiro que encontrar
                        result = array[i];
                        break;
                    }
                }
            }
            return result;
        }

        function existe(index,array) {
            /*verifica se um determinado valor existe em um array*/
          var x = false;
          for (var i = 0; i < array.length; i++) {
            if (array[i] == index) {
              return true;
            }
          }
          return x;
        }

        function getDataServe(dataset) {
            var msgErro = 'Falha ao busca a data atual no servidor';
            var servico = 'dataAtual';
            var dataset = DataserviseProvider.getPrmWebService();
            return dataservice.dadosWeb(dataset,servico,msgErro)
                .then(function (data) {
                    return data;
                });            
        }        

        function qtDias(dt1,dt2) {
            var ONE_DAY = (1000 * 60 * 60 * 24);
            var date1_ms = dt1.getTime();
            var date2_ms = dt2.getTime();
            if (date1_ms > date2_ms) {
                dias = 0;
            } else {
                var difference_ms = Math.abs(date1_ms - date2_ms);
                var dias = Math.round(difference_ms/ONE_DAY);
            }
            return dias;
        }; 

      function validaCPF(str) {
        if (str) {
          str = str.replace('.', '');
          str = str.replace('.', '');
          str = str.replace('-', '');

          var cpf = str;
          var numeros, digitos, soma, i, resultado, digitos_iguais;
          digitos_iguais = 1;
          if (cpf.length < 11)
            return false;
          for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
              digitos_iguais = 0;
              break;
            }
          if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--)
              soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
              return false;
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--)
              soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
              return false;
            return true;
          }
          else
            return false;
        }
      }

                 

    }
})();