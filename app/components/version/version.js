'use strict';

angular.module('uk.ac.soton.ecs.analytics.example.version', [
  'uk.ac.soton.ecs.analytics.example.version.interpolate-filter',
  'uk.ac.soton.ecs.analytics.example.version.version-directive'
])

.value('version', '0.1');
