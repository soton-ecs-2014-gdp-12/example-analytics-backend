'use strict';

angular.module('uk.ac.soton.ecs.analytics.example.video', [
		'ngRoute',
		'com.2fdevs.videogular',
		'com.2fdevs.videogular.plugins.controls',
		'uk.ac.soton.ecs.analytics.example.video',
		'uk.ac.soton.ecs.videogular.plugins.heatmaps',
		'uk.ac.soton.ecs.analytics.example.version'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'video/video.html',
    controller: 'VideoCtrl'
  });
}]) 

.controller('VideoCtrl', function($scope, $sce, $route) {
	$scope.config = {
		autoHide: false,
		autoHideTime: 3000,
		sources: [
			{src: $sce.trustAsResourceUrl("video.ogg"), type: "video/ogg"},
		],
		theme: {
			url: "video/videogular.css"
		},
		plugins: {
			heatmaps: {
				theme: {
					url: "bower_components/videogular-heatmap/heatmaps.css",
				},
				colours: [
					{
						upto: '1',
					},
					{
						upto: '2',
						colour: 'indigo',
					},
					{
						upto: '4',
						colour: 'blue',
					},
					{
						upto: '6',
						colour: 'green',
					},
					{
						upto: '8',
						colour: 'yellow',
					},
					{
						upto: '10',
						colour: 'orange',
					},
					{
						upto: '+',
						colour: 'red',
					},
				],
			},
		}
	};

	$scope.addSections=function(frequencyList){
		if (typeof $scope.config.plugins.heatmaps !== 'undefined') {
			$scope.config.plugins.heatmaps.sections = $scope.config.plugins.heatmaps.sections || [];
			for (var i in frequencyList) {
					$scope.config.plugins.heatmaps.sections.push(
					{ 
						start: frequencyList[i].start,
						end: frequencyList[i].end,
						frequency: frequencyList[i].frequency
					}
					)	;	
			}
		}
	};

});
