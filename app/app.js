'use strict';

// Declare app level module which depends on views, and components
angular.module('uk.ac.soton.ecs.analytics.example', [
	'ngRoute',
	'com.2fdevs.videogular',
	'com.2fdevs.videogular.plugins.controls',
	'uk.ac.soton.ecs.analytics.example.video',
//	'uk.ac.soton.ecs.videogular.plugins.heatmaps',
	'uk.ac.soton.ecs.analytics.example.version'
])
.config(['$routeProvider', function($routeProvider) {
     $routeProvider.otherwise({redirectTo: '/video'});
}]);

