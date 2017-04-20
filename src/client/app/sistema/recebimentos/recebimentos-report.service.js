(function() {
    'use strict';
    angular
        .module('sis.rec')
        .factory('RecReport', RecReport);
    RecReport.$inject = ['config','DataserviseProvider','$filter','UtilsFunctions'];
    /* @ngInject */
    function RecReport(config,DataserviseProvider,$filter,UtilsFunctions) {
        var pathImg = config.urlImagem;
        var empresa = DataserviseProvider.userLogado.empresa;
        var DataAt = new Date();
        var soma = UtilsFunctions.soma;
        var extencio = UtilsFunctions.porExtencio;
        var service = {
            tplRecibo : tplRecibo,
        };
        return service;
        ////////////////
        function tplRecibo(recibo) {
        	var tplItens = '';
        	var tpl = "<html>";
        	tpl=tpl+"<body>";
        	/*Container*/
        	tpl=tpl+"<div class='row'><div class='col-xs-12'>";
            tpl=tpl+"<div class='panel panel-default'><div class='panel-body'>";


        	/*Montando o caberçario*/
            tpl=tpl+"<div class='col-xs-12'><div class='panel panel-default'><div class='panel-body'>";
        	tpl=tpl+"<div class='col-xs-3'><img src='"+pathImg;
            if (empresa.logo) {
                tpl=tpl+empresa.logo;
            } else{
                tpl=tpl+'noImg.jpg';
            }
            tpl=tpl+"' height='50' alt='logo prefeitura'></div>";
        	tpl=tpl+"<div class='col-xs-3'><h3>Recibo</h3></div>";
            tpl=tpl+"<div class='col-xs-4'><h3>Valor : <i style='font-size:70%'> "+$filter('currency')(recibo.valor,'R$')+"</i></h3></div>";
            tpl=tpl+"</div></div>";
        	/*fim caberçario*/

            /*dados do recibo*/
            tpl=tpl+"<div class='panel panel-default'><div class='panel-body'>";
            tpl=tpl+"<p><b>Recebemos de : </b><i>"+recibo.cliente+"</i></p>";
            tpl=tpl+"<p><b>RG : </b><i>"+recibo.cliente_rg+"</i><b> CPF : </b><i>"+recibo.cliente_cpf+"</i></p>";
            tpl=tpl+"<p><b>a quantia de : </b><i>"+extencio(recibo.valor)+"</i></p>";
            tpl=tpl+"<p><b>Correspondente a :</b>";
            if (recibo.id_reserva) {
                tpl=tpl+" Contrato Nº "+recibo.id_reserva+"<br>";
            }
            tpl=tpl+"<i>"+recibo.obs+"</i></p>";
            tpl=tpl+"<p class='text-right'><b>"+$filter('date')(recibo.data_rec,'dd, MMMM,  y')+"</b></p>";
            tpl=tpl+"</div></div>";


        	/*fim container*/
        	tpl=tpl+"</div>";
            tpl=tpl+"<p class='text-center'>____________________________________________</p>";
            tpl=tpl+"<p class='text-center'><small>Assinatura ou Carimbo</small></p>";
            tpl=tpl+"</div></div></div></div></body></html>";
        	return tpl;
        }

    }
})();