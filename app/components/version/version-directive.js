'use strict';

angular.module('uk.ac.soton.ecs.analytics.example.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);
