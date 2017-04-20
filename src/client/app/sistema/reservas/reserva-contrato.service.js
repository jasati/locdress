(function() {
    'use strict';
    angular
        .module('sis.reserva')
        .factory('ReqReport', ReqReport);
    ReqReport.$inject = ['config','DataserviseProvider','$filter','UtilsFunctions'];
    /* @ngInject */
    function ReqReport(config,DataserviseProvider,$filter,UtilsFunctions) {
        var pathImg = config.urlImagem;
        var dadosPref = DataserviseProvider.userLogado.prefeitura;
        var DataAt = new Date();
        var soma = UtilsFunctions.soma;
        var extencio = UtilsFunctions.porExtencio;
        var service = {
            getTplRequisicao: getTplRequisicao,
            getTplListaReq  : getTplListaReq
        };
        return service;
        ////////////////
        function getTplRequisicao(requisicao,itens) {
        	var tplItens = '';
        	var tpl = "<html> <head> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'>";
        	tpl=tpl+"<style>#rel{position: relative !important; top:0; left:0;} #abs{position: absolute !important; top:10px;} table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}td, th {border: 1px solid #8c8c8c;} th{background-color: #777;color:white} tr:nth-child(even) {background-color: #dddddd;} b{font-weight: bold;}</style>";
            if (DataserviseProvider.userLogado.usuario.id_usuario!=requisicao.id_usuario) {
                tpl=tpl+"<style>body{color:black;background-image:url('"+pathImg+"print-controle1.png');}</style>";
            }
        	tpl=tpl+"</head><body>";
        	/*Container*/
        	tpl=tpl+"<div class='row'><div id='rel'>";


        	/*Montando o caberçario*/
        	tpl=tpl+"<div class='col-xs-4'><img src='"+pathImg+dadosPref.logo_prefeitura+"' height='80' alt='logo prefeitura'></div>";
        	tpl=tpl+"<div class='col-xs-6'><h4>"+requisicao.uni_orc+"-"+requisicao.secretaria+"</h4></div>";
        	tpl=tpl+"<div class='col-xs-12'><h4 class='text-center'><strong style='font-weight: bold'>Requisição</strong></h4></div>";
        	/*fim caberçario*/

            /*dados do requisitante*/
            tpl=tpl+"<div class='col-xs-12'>";
            tpl=tpl+"<div class='panel panel-default'>";
            tpl=tpl+"<p class='small'><b>Responsável : </b>"+requisicao.usuario;
            tpl=tpl+"<b> Ip Login : </b>"+requisicao.ip_acess;
            tpl=tpl+"</p></div></div>";

        	/*Header requisicao*/
            tpl=tpl+"<div class='col-xs-12'>";

            tpl=tpl+"<div class='col-xs-6'>";//col esquerda
            tpl=tpl+"<p><b>Modalidade: </b>"+requisicao.modalidade+"<b> Nº: </b>"+requisicao.n_modalidade+"</p>";
            tpl=tpl+"<p><b>Fornecedor: </b>"+requisicao.razao+"</p>";
            tpl=tpl+"<p><b>Endereço: </b>"+requisicao.endereco+"</p>";
            tpl=tpl+"<p><b>CPF/CNPJ: </b>"+requisicao.cpf_cnpj+"</p>";
            tpl=tpl+"</div>";//fim col esquerda

            tpl=tpl+"<div class='col-xs-4'>";//col direita
            var dtreq = new Date(requisicao.req_data);
            tpl=tpl+"<p><b>Requisitado: </b>"+$filter('date')(dtreq,'dd/MM/yyyy HH:mm')+"</p>";
            tpl=tpl+"<p><b>Impresso em: </b>"+$filter('date')(DataAt,'dd/MM/yyyy HH:mm')+"</p>";
            tpl=tpl+"<p><b>Nº :</b>"+requisicao.n_requisicao+"</p>";
            tpl=tpl+"</div>";//fim col direita

            tpl=tpl+"</div>";
        	/*Fim header requisicao*/

        	/*itens da requisicao*/
        	tpl=tpl+"<div class='col-xs-12'>";
        	tpl=tpl+"<table>";
        	tpl=tpl+"<thead><tr>";
        	tpl=tpl+"<th style='width:3%'>#</th>";
        	tpl=tpl+"<th style='width:7%'>Item</th>";
        	tpl=tpl+"<th style='width:40%'>Descrição</th>";
        	tpl=tpl+"<th style='width:20%'>Marca</th>";
        	tpl=tpl+"<th style='width:5%'>UN</th>";
        	tpl=tpl+"<th style='width:5%'>Qtde.</th>";
        	tpl=tpl+"<th style='width:10%'>Valor</th>";
        	tpl=tpl+"<th style='width:10%'>Total</th>";
        	tpl=tpl+"</tr></thead>";
        	tpl=tpl+"<tbody>";
        	angular.forEach(itens, function(value, key){
        		tpl=tpl+"<tr><td>"+key+"</td>";
        		tpl=tpl+"<td>"+value.id_item+"</td>";
        		tpl=tpl+"<td>"+value.item+"</td>";
        		if (value.marca===null) {tpl=tpl+"<td></td>";}else{tpl=tpl+"<td>"+value.marca+"</td>";}
        		tpl=tpl+"<td>"+value.unidade+"</td>";
        		tpl=tpl+"<td>"+value.qt+"</td>";
        		tpl=tpl+"<td class='text-right'>"+$filter('currency')(value.valor)+"</td>";
        		tpl=tpl+"<td class='text-right'>"+$filter('currency')(value.qt*value.valor)+"</td></tr>";
        	});
        	tpl=tpl+"</tbody></table></div>";
        	tpl=tpl+"<div class='col-xs-12'><h4 class='text-right'><b>Total : </b>"+$filter('currency')(requisicao.total,'R$')+"</h4></div>";
        	/*Fim itens da requisicao*/

        	/*detalhes da requisicao*/
        	tpl=tpl+"<div class='col-xs-12'>";
        	tpl=tpl+"<p><b>Finalidade do Pedido :</b></p>";
        	tpl=tpl+"<p>"+requisicao.finalidade+"</p>";
        	tpl=tpl+"<p><b>Endereço de Entrega:</b></p>";
        	tpl=tpl+"<p>"+requisicao.end_entrega+"</p>";
            tpl=tpl+"</div>";
            tpl=tpl+"<div class='col-xs-12'>";
            tpl=tpl+"<div class='text-center' style='margin-top: 80px; page-break-before: auto'>";
            tpl=tpl+"<p>______________________________________________________</p>";
            tpl=tpl+"<p>Responsável pelo pedido (assinatura e carimbo <b>Obrigatório</b>)</p>";
            tpl=tpl+"</div>";
            /*fim detalhes da requisicao*/

            /*rodape da requisicao*/
            tpl=tpl+"<div class='col-xs-12'>";
            tpl=tpl+"<div class='col-xs-5'>";
            tpl=tpl+"<div class='panel panel-default' style='height: 130px'>";
            if (requisicao.id_sr === 2&&DataserviseProvider.userLogado.usuario.id_usuario===requisicao.id_usuario) {
                tpl=tpl+"<p><b>Autorizado </b>Pelo Setor de Compras</p>";
                tpl=tpl+"<span style='font-size: 8px'>Assinatura Digital</span>";
                tpl=tpl+"<img src='"+pathImg+requisicao.assin_digital+"' height='80' alt='Autorizado'>";
                var dtAut = new Date(requisicao.data_lib);
                tpl=tpl+"<p><b>Autorizado em: </b>"+$filter('date')(dtAut,'dd/MM/yyyy HH:mm')+"</p>";
            } else {
                if (DataserviseProvider.userLogado.usuario.id_usuario!=requisicao.id_usuario) {
                    tpl=tpl+"<p><b>Impresso para controle interno</b></p>";
                }
                
            }
            tpl=tpl+"</div></div>";
            tpl=tpl+"<div class='col-xs-5'>";
            tpl=tpl+"<div class='panel panel-default' style='height: 130px'>";
            tpl=tpl+"<p><b>Liberação - Setor de Compras </b><span style='font-size: 6px'>(Preenchido no momento da entrega)</span></p>";
            tpl=tpl+"<p><b>Dia :</b>___/___/_____ </p>";
            tpl=tpl+"<p><b>Nome:</b>________________________________</p>";
            tpl=tpl+"<p><b>Tel :</b>________________________________</p>";
            tpl=tpl+"</div></div></div>";
            /* fim rodape da requisicao*/
        	/*fim container*/
        	tpl=tpl+"</div></div></div></body></html>";
        	return tpl;
        }

        function getTplListaReq(reqs) {
            var tpl = "<html> <head> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'>";
            tpl=tpl+"<style>body{color:black} table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}td, th {border: 1px solid #8c8c8c;} th{background-color: #777;color:white} tr:nth-child(even) {background-color: #dddddd;} b{font-weight: bold;}</style>";
            tpl=tpl+"</head>";
            /*Container*/
            tpl=tpl+"<div class='row'><div class=''>";

            /*cabeçario*/
            tpl=tpl+"<div class='col-xs-4'><img src='"+pathImg+dadosPref.logo_prefeitura+"' height='80' alt='logo prefeitura'></div>";
            tpl=tpl+"<div class='col-xs-6'>";
            tpl=tpl+"<h5 class='text-muted'>"+dadosPref.nome+"</h5>";
            tpl=tpl+"<h5 class='text-muted'>"+dadosPref.endereco+"</h5>";
            tpl=tpl+"<h5 class='text-muted'>"+dadosPref.slogan+"</h5>";
            tpl=tpl+"</div>";
            tpl=tpl+"<div class='col-xs-12'><h4 class='text-center'><strong style='font-weight: bold'>Listagem de Requisições</strong></h4></div>";
            /*fim cabeçario*/

            /*listagem das requisições*/
            tpl=tpl+"<div class='col-xs-12'>";
            tpl=tpl+"<table>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width:10%'>Nº Requisição</th>";
            tpl=tpl+"<th style='width:5%'>Data</th>";
            tpl=tpl+"<th style='width:30%'>Fornecedor</th>";
            tpl=tpl+"<th style='width:30%'>Secretaría</th>";
            tpl=tpl+"<th style='width:15%'>Responsável</th>";
            tpl=tpl+"<th style='width:10%'>Total</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(reqs, function(value, key){
                tpl=tpl+"<tr><td>"+value.n_requisicao+"</td>";
                var dtreq = new Date(value.req_data);
                tpl=tpl+"<td>"+$filter('date')(dtreq,'dd/MM/yyyy HH:mm')+"</td>";
                tpl=tpl+"<td>"+value.razao+"</td>";
                tpl=tpl+"<td>"+value.secretaria+"</td>";
                tpl=tpl+"<td>"+value.usuario+"</td>";
                tpl=tpl+"<td class='text-right'>"+$filter('currency')(value.total)+"</td></tr>";
            });
            tpl=tpl+"</tbody></table></div>";
            tpl=tpl+"<div class='col-xs-12'><h4 class='text-right'><b>Total : </b>"+$filter('currency')(soma(reqs,'','total'))+"</h4></div>";

            /*fim container*/
            tpl=tpl+"</div></div></div></html>";

            return tpl;            
        }
    }
})();