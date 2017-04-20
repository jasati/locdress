(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htSidebar', htSidebar);
    htSidebar.$inject = [];   
    /* @ngInject */

    function htSidebar () {
        var directive = {
            bindToController: true,
            controller: htSidebarController,
            controllerAs: 'vm',            
            link: link,
            restrict: 'EA',
            scope: {
                whenDoneAnimating: '&?'
            }
        };

        function htSidebarController() {
            //var vm = this;
        }
        
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    $sidebarInner.slideDown(350, scope.whenDoneAnimating);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350, scope.whenDoneAnimating);
                }
            }
        }
    }
})();
