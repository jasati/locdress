(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('Extencio', Extencio);

    function Extencio() {
        var service = {
            porExtencio: porExtencio
        };
        return service;
        ////////////////
        function  porExtencio(valor) {
			var palavras = {
				1   : 'um',
				2   : 'dois',
				3   : 'tres',
				4   : 'quatro',
				5   : 'cinco',
				6   : 'seis',
				7   : 'sete',
				8   : 'oito',
				9   : 'nove',
				10  : 'dez',
				11  : 'onze',
				12  : 'doze',
				13  : 'treze',
				14  : 'quatorze',
				15  : 'quinze',
				16  : 'dezesseis',
				17  : 'dezessete',
				18  : 'dezoito',
				19  : 'dezenove',
				20  : 'vinte',
				30  : 'trinta',
				40  : 'quarenta',
				50  : 'cinquenta',
				60  : 'sessenta',
				70  : 'setenta',
				80  : 'oitenta',
				90  : 'noventa',
				100 : 'cento',
				200 : 'duzentos',
				300 : 'trezentos',
				400 : 'quatrocentos',
				500 : 'quinhentos',
				600 : 'seicentos',
				700 : 'setecentos',
				800 : 'oitocentos',
				900 : 'novecentos'
			};

			var valorObj = Number(valor);

			if (valorObj === isNaN) {
				return console.error('Apenas números são permitidos.');
			} else {
				return humanize();
			}

			function humanizedDezena(value) {
				var parte = '';
				if (value <= 20 || (value % 10) === 0) {
				  return palavras[parseInt(value)];
				}

				var parteUnidade = value % 10;
				var parteDezena  = value - parteUnidade;

				var humanizedUnidade = palavras[parseInt(parteUnidade)];
				var humanizedDezena  = palavras[parseInt(parteDezena)];
				parte = humanizedDezena;
				if (parteUnidade > 0) {
					parte = parte + ' e ' + humanizedUnidade;
				}
				return parte;
			}

			function humanizedCentena(value) {
				var parte = '';
				var parteDezena  = value % 100;
				var parteCentena = value - parteDezena;

				if (value === 100 && parteDezena === 0) {
					return 'cem';
				}
				parte = palavras[parseInt(parteCentena)];
				if (parteDezena > 0) {
					parte = parte + ' e ' + humanizedDezena(parteDezena);
				}

				return parte;
			}


			function convertToExtensive(value) {
				value = parseInt(value);
				var tamanho = (value + '').length;

				if (tamanho <= 2) {
					return humanizedDezena(value);
				}

				if (tamanho === 3) {
					return humanizedCentena(value);
				}

				if (tamanho >= 4) {
					var parteMilhar  = value / 1000;
					var parteCentena = value % 1000;

					var humanizedMilhar = (parteMilhar !== 1) ? (convertToExtensive(parteMilhar) + 'mil') : 'mil';

					if (parteCentena > 0) {
						return humanizedMilhar + ', ' + humanizedCentena(parteCentena);
				}

					return humanizedMilhar;
				}
			}

			function humanize() {
				var parteInteira = parseInt(valor);
				var reais = (parteInteira > 0) ? ((convertToExtensive(parteInteira) + ((parteInteira !== 1) ? ' reais' : ' real'))) : '';

				var parteFracionaria = Math.round(((valor % 1) * 100));
				var cents = convertToExtensive(parteFracionaria) +  ' centavos';
				var centavos = (parteFracionaria > 0) ? ((parteInteira > 0) ? ' e ' : '') + cents : '';

				return reais + centavos;
			}

        }
    }
})();