(function() {
    'use strict';
    angular
        .module('sis.reserva')
        .factory('ResReport', ResReport);
    ResReport.$inject = ['config','DataserviseProvider','$filter','UtilsFunctions'];
    /* @ngInject */
    function ResReport(config,DataserviseProvider,$filter,UtilsFunctions) {
        var pathImg = config.urlImagem;
        var empresa = DataserviseProvider.userLogado.empresa;
        var DataAt = new Date();
        var soma = UtilsFunctions.soma;
        var extencio = UtilsFunctions.porExtencio;
        var service = {
            tplContrato: tplContrato,
            tplTermo : tplTermo,
            tplDevolucao : tplDevolucao,
        };
        return service;
        ////////////////
        
        function impCampo(valor) {
            if (valor === null || valor === '') {
                return '';
            } else {
                return valor;
            }
        }

        function tplContrato(contrato) {
        	var tpl ="<html><body>";
        	/*Container*/
        	tpl=tpl+"<div class='row'><div class='col-xs-12'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            if (empresa.logo) {
                tpl=tpl+"<div align='center'><img src='"+pathImg;
                if (empresa.logo) {
                    tpl=tpl+empresa.logo;
                } else{
                    tpl=tpl+'noImg.jpg';
                }
                tpl=tpl+"' height='50' alt='logo prefeitura'></div>";                
            } else {
                tpl=tpl+"<h1 class='text-center'>"+impCampo(empresa.nome)+"</h1>";
            }
            tpl=tpl+"<h6 class='text-center'>"+impCampo(empresa.slogan)+"</h6>";
            tpl=tpl+"<p class='text-center'>Tels: "+impCampo(empresa.tel1)+" / "+impCampo(empresa.tel2)+" / "+impCampo(empresa.cel)+"</p>";
            tpl=tpl+"<p class='text-center'>e-Mail: "+impCampo(empresa.email)+"</p>";
            tpl=tpl+"</div>";

            /*corpo*/
            tpl=tpl+contrato;

            /*roda pe*/
            tpl=tpl+"<div class='footer'>";
            tpl=tpl+"<p class='text-center'><b>"+impCampo(empresa.endereco)+"</b></p>";
            tpl=tpl+"<p class='text-center'><b>"+impCampo(empresa.cidade)+"</b></p>";
            tpl=tpl+"</div>";


        	/*fim container*/
        	tpl=tpl+"</div></div></body></html>";
        	return tpl;
        }

        function tplTermo(reserva,trajes) {
            var qtDias = function (dt1,dt2) {
                var ONE_DAY = (1000 * 60 * 60 * 24);
                var date1_ms = dt1.getTime();
                var date2_ms = dt2.getTime();
                var difference_ms = Math.abs(date1_ms - date2_ms);
                return Math.round(difference_ms/ONE_DAY); 
            };
            var tpl = "<html><body>";
            /*Container*/
            tpl=tpl+"<div class='row'><div class='col-xs-12'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            if (empresa.logo) {
                tpl=tpl+"<div align='center'><img src='"+pathImg;
                if (empresa.logo) {
                    tpl=tpl+empresa.logo;
                } else{
                    tpl=tpl+'noImg.jpg';
                }
                tpl=tpl+"' height='50' alt='logo prefeitura'></div>";                
            } else {
                tpl=tpl+"<h1 class='text-center'>"+impCampo(empresa.nome)+"</h1>";
            }
            tpl=tpl+"<h6 class='text-center'>"+impCampo(empresa.slogan)+"</h6>";
            tpl=tpl+"<p class='text-center'>Tels: "+impCampo(empresa.tel1)+" / "+impCampo(empresa.tel2)+" / "+impCampo(empresa.cel)+"</p>";
            tpl=tpl+"<p class='text-center'>e-Mail: "+impCampo(empresa.email)+"</p>";
            tpl=tpl+"</div>";

            /*corpo*/
            tpl=tpl+"<p class='text-center'><b>TERMO DE RESPONSABILIDADE</b></p>";
            tpl=tpl+"<div class='row text-justify'>";
            tpl=tpl+"<p>EU <i>"+impCampo(reserva.cliente)+"</i></p>";
            tpl=tpl+"<p>ESTADO CIVIL <i>"+impCampo(reserva.estado_civil)+"</i> PROFISSÃO <i>"+impCampo(reserva.profissao)+"</i></p>";
            tpl=tpl+"<p>TEL <i>"+impCampo(reserva.tel1)+" "+impCampo(reserva.cel1)+" "+impCampo(reserva.cel2)+"</i></p>";
            tpl=tpl+"<p>INSCRITO NO CPF SOB O Nº <i>"+impCampo(reserva.cpf)+"</i> E NO RG Nº <i>"+impCampo(reserva.rg)+"</i></p>";
            tpl=tpl+"<p>FILIAÇÃO <i>"+impCampo(reserva.nome_pai)+"</i> E <i>"+impCampo(reserva.nome_mae)+"</i></p>";
            tpl=tpl+"<p>RESIDENTE E DOMIC. A RUA <i>"+impCampo(reserva.endereco)+"</i></p>";
            tpl=tpl+"<p>BAIRRO <i>"+impCampo(reserva.bairro)+"</i> CIDADE <i>"+impCampo(reserva.cidade)+"</i></p>";
            tpl=tpl+"</div>";
            tpl=tpl+"<br>";

            /*trajes da reserva*/
            tpl=tpl+"<div class='row'>";
            tpl=tpl+"<p>MEDIANTE ESTE INSTRUMENTO DECLARA RESPONSABILIZA-SE PELA CONSERVAÇÃO DOS ITENS A BAIXO:</p>";
            tpl=tpl+"<table style='margin:5px'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width:5%'>Ordem</th>";
            tpl=tpl+"<th style='width:45%'>Descrição</th>";
            tpl=tpl+"<th style='width:20%'>Referencia</th>";
            tpl=tpl+"<th style='width:15%'>Cor</th>";
            tpl=tpl+"<th style='width:15%'>Tamanho</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            var item = 0;
            angular.forEach(trajes, function(value, key){
                item++;
                tpl=tpl+"<tr><td>"+(item)+"</td>";
                tpl=tpl+"<td>"+value.descricao+"</td>";
                tpl=tpl+"<td>"+value.ref+"</td>";
                tpl=tpl+"<td>"+value.cor+"</td>";
                tpl=tpl+"<td>"+value.tam+"</td>";
            });
            tpl=tpl+"</tbody></table>";
            tpl=tpl+"<p>DE PROPRIEDADE DE "+impCampo(empresa.nome)+", CNPJ "+impCampo(empresa.cpf_cnpj)+"</p></div>";
            tpl=tpl+"<br>";
            tpl=tpl+"<div class='row'>";
            tpl=tpl+"<p>DATA DA REALIZAÇÃO DO CONTRATO : <b>"+$filter('date')(reserva.data_reserva,'dd/MM/yyyy')+"</b>, Nº DO CONTRATO : <b>"+reserva.id_reserva+"</b></p>";
            tpl=tpl+"<p>DATA DO EVENTO : <b>"+$filter('date')(reserva.data_evento,'dd/MM/yyyy')+"</b>, DATA DA DEVOLUÇÃO : <b>"+$filter('date')(reserva.data_devolucao,'dd/MM/yyyy')+"</b></p>";
            tpl=tpl+"<p>VALOR DO CONTRATO : <b>"+$filter('currency')(soma(trajes,'','valor'),'R$')+"</b>, VALOR DA ENTRADA : <b>"+$filter('currency')(reserva.valor_entrada,'R$')+"</b></p>";
            tpl=tpl+"<p>PRAZO DE (<b>"+qtDias(reserva.data_retirada,reserva.data_devolucao)+"</b>) DIAS. A CONTAR DA DATA DE <b>"+$filter('date')(reserva.data_retirada,'dd/MM/yyyy')+"</b>, COMPROMETENDO-SE A DEVOVE-LO EM PERFEITO ESTADO AO FIM DESTE PRAZO.</p>";
            tpl=tpl+"<p>EM CASO DE ESTRAVIO E DANOS QUE ACARRETEM A PERDA TOTAL OU PARCIAL DO BEM, FICA OBRIGADO A RESSARCIR O PROPRIETÁRIO DOS PREJUIZOS EXPERIMENTADOS.</p>";
            tpl=tpl+"<br>";
            tpl=tpl+"<p>"+impCampo(empresa.cidade)+" "+$filter('date')(DataAt,'dd/MM/yyyy')+"</p>";
            tpl=tpl+"<p class='text-center'>____________________________________________</p>";
            tpl=tpl+"<p class='text-center'><small>Assinatura</small></p>";
            tpl=tpl+"</div>";
            tpl=tpl+"<br>";
            var trajes_aj = $filter('filter')(trajes,{ajustar:1});
            if (trajes_aj.length > 0) {
                tpl=tpl+"<div class='row'>";
                tpl=tpl+"<p><b>AJUSTES A SER REALIZADO</b></p><hr>";
                angular.forEach(trajes_aj, function(value, key){
                    tpl=tpl+"<p>Referencia : <b>"+value.ref+"</b> --> "+value.ajustes+"</p>";
                });
                tpl=tpl+"</div>";
                tpl=tpl+"<br>";
            }
            /*roda pe*/
            tpl=tpl+"<div class='row'>";
            tpl=tpl+"<p class='text-center'>"+impCampo(empresa.endereco)+"</p>";
            tpl=tpl+"<p class='text-center'>"+impCampo(empresa.cidade)+"</p>";
            tpl=tpl+"</div>";


            /*fim container*/
            tpl=tpl+"</div></div></body></html>";
            return tpl;
        }


        function tplDevolucao(reserva,trjes) {
            var tpl = "<html><body>";
            /*Container*/
            tpl=tpl+"<div class='row'><div class='col-xs-12'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            if (empresa.logo) {
                tpl=tpl+"<div align='center'><img src='"+pathImg;
                if (empresa.logo) {
                    tpl=tpl+empresa.logo;
                } else{
                    tpl=tpl+'noImg.jpg';
                }
                tpl=tpl+"' height='50' alt='logo prefeitura'></div>";                
            } else {
                tpl=tpl+"<h1 class='text-center'>"+impCampo(empresa.nome)+"</h1>";
            }
            tpl=tpl+"<h6 class='text-center'>"+impCampo(empresa.slogan)+"</h6>";
            tpl=tpl+"<p class='text-center'>Tels: "+impCampo(empresa.tel1)+" / "+impCampo(empresa.tel2)+" / "+impCampo(empresa.cel)+"</p>";
            tpl=tpl+"<p class='text-center'>e-Mail: "+impCampo(empresa.email)+"</p>";
            tpl=tpl+"</div>";

            /*corpo*/
            tpl=tpl+"<p class='text-center'><b>ATESTADO DE DEVOLUÇÃO</b></p>";
            tpl=tpl+"<div class='row text-justify'>";
            tpl=tpl+"<p>Nº DO CONTRATO : <b>"+reserva.id_reserva+"</b></p>";            
            tpl=tpl+"<p>ATESTAMOS QUE OS BENS FORAM DEVOLVIDOS EM "+$filter('date')(DataAt,'dd/MM/yyyy')+" NAS SEGUINTES CONDIÇÕES:</p>";
            tpl=tpl+"<br>";
            tpl=tpl+"<p><i>"+impCampo(reserva.obs_devolucao)+"</i></p>";
            tpl=tpl+"<br>";
            tpl=tpl+"<p>RESPONSÁVEL PELO RECEBIMENTO : "+impCampo(reserva.resp_dev)+"</p>";            
            tpl=tpl+"</div>";
            tpl=tpl+"<br>";
            tpl=tpl+"<p class='text-center'>____________________________________________</p>";
            tpl=tpl+"<p class='text-center'><small>Assinatura ou Carimbo</small></p>";            
            /*roda pe*/
            tpl=tpl+"<div class='row'>";
            tpl=tpl+"<p class='text-center'>"+impCampo(empresa.endereco)+"</p>";
            tpl=tpl+"<p class='text-center'>"+impCampo(empresa.cidade)+"</p>";
            tpl=tpl+"</div>";


            /*fim container*/
            tpl=tpl+"</div></div></body></html>";
            return tpl;
        }

    }
})();