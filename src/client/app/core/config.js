(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    var prmAmbiente = 2;//0:local 1:teste 2:producao
    var ambiente = {
        0:{//local
            api:"http://mucontratos.alan.dev/v1/",
            db:"locdress",
            img:"http://mucontratos.alan.dev/App/Upload/",
            report:"http://mucontratos.alan.dev/App/Tmp/",
            urlSistema:"http://localhost:3000/",
        },
        1:{//teste
            api:"http://ws.teste.locdress.jasati.com.br/v1/",
            db:"jasatico_locdress_teste",
            img:"http://ws.teste.locdress.jasati.com.br/App/Upload/",
            report:"http://ws.teste.locdress.jasati.com.br/App/Tmp/",
            urlSistema:"http://app.teste.locdress.jasati.com.br/",
        },
        2:{//producao
            api:"http://ws.locdress.jasati.com.br/v1/",
            db:"jasatico_locdress",
            img:"http://ws.locdress.jasati.com.br/App/Upload/",
            report:"http://ws.locdress.jasati.com.br/App/Tmp/",
            urlSistema:"http://app.locdress.jasati.com.br/",
        }        
    };
    var config = {
        versao        :'0.1.1',
        appErrorPrefix: '[Ops! Dados Não Processados] ',
        appTitle      : 'LocDress',
        appSubtitle   : 'Sistema para Locação e Controle de Trajes',
        urlWebService :ambiente[prmAmbiente].api,
        urlImagem     :ambiente[prmAmbiente].img,
        dbase         :ambiente[prmAmbiente].db,
        report        :ambiente[prmAmbiente].report,
        urlSistema    :ambiente[prmAmbiente].urlSistema,
        getResponseKey:'e2f46f53a4c7c590c472f65c0f3504b1',
        mailChimp     :{
            username: 'jasati',
            dc: 'us10',
            u: '3ac13a5780bbed87724dc432a',
            id:'33c2b80053'
        },
        // true ou false para habilitar o modulo de permissao, caso esteja false
        // o sistema ira libera os modulos sem verificar
        modPerm : true, 
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', '$httpProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $httpProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
        //permitir chamada de dominio cruzado CORS
        $httpProvider.defaults.useXDomain = true;

    }

})();
