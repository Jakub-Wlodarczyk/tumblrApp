'use strict';

angular.module('tumblrApp', ['ngRoute', 'ngSanitize', 'welcome.page'])
    
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/welcome'});
}])
    
.directive('navbar', function() {
    return {
        templateUrl: 'components/navbar/navbar.html'
    }
});
    

