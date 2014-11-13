'use strict';

angular.module('uk.ac.soton.ecs.analytics.example.video', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/video', {
    templateUrl: 'video/video.html',
    controller: 'VideoCtrl'
  });
}])

.controller('VideoCtrl', function($scope, $sce) {
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
/*
				sections: [
					{
						start: '1970-01-01T00:00:00.000Z',
						end: '1970-01-01T00:00:02.000Z',
						frequency : '4'
					},
					{
						start: '1970-01-01T00:00:02.000Z',
						end: '1970-01-01T00:00:03.030Z',
						frequency : '2'
					},
					{
						start: '1970-01-01T00:00:03.030Z',
						end: '1970-01-01T00:00:03.050Z',
						frequency : '1'
					},
					{
						start: '1970-01-01T00:00:03.050Z',
						end: '1970-01-01T00:00:03.900Z',
						frequency : '11'
					},
				], */
				colours: [
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
				$scope.$apply(
					$scope.config.plugins.heatmaps.sections.push(
					{ 
						start: frequencyList[i].start,
						end: frequencyList[i].end,
						frequency: frequencyList[i].frequency
					}
					)	
				);	
			}
		}	
	};

});
