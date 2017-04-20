(function () {
    'use strict';

    angular
        .module('app.core', [
        	'ngCookies',
            'ngAnimate', 
            'ngSanitize',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.utils',
            'ui.router', 'ngplus', 'ui.bootstrap', 'angularFileUpload','chart.js',
            'ngAside','xeditable','ui.mask','mgo-angular-wizard'
        ]);
})();
