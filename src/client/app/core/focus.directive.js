(function() {
    'use strict';
    angular
        .module('app.core')
        .directive('appFocus', appFocus);
    appFocus.$inject = [];
    /* @ngInject */
    function appFocus () {
        return {
            link: function(scope, element, attrs) {
                element[0].focus(); 
        	},
    	};
    }

})();