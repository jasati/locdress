(function() {
    'use strict';
    angular
        .module('app.core')
        .provider('MailChimpProvider', MailChimpProvider);
    MailChimpProvider.$inject = [];
    /* @ngInject */
    function MailChimpProvider() {
        this.$get = mailChimp;

        function mailChimp($http,$q,config) {

            var chimp = config.mailChimp;
            var service = {
                subscribe : subscribe,
            };

            return service;

            function subscribe(data) {
                var defer = $q.defer();
                var params = angular.extend({u: chimp.u, id: chimp.id, c:'JSON_CALLBACK'},data);
                var url = 'https://'+ chimp.username + '.'+chimp.dc +'.list-manage.com/subscribe/post-json';
                $http({
                    url: url,
                    params: params,
                    method: 'JSONP'
                }).then(function (data) {
                    if(data.data.result === 'success')
                        defer.resolve(data.data);
                    else
                        defer.reject(data.data);

                }, function (err) {
                    defer.reject(err)
                });

                return defer.promise;
            }


        }
    }
})();