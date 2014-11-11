'use strict';

describe('uk.ac.soton.ecs.analytics.example.version module', function() {
  beforeEach(module('uk.ac.soton.ecs.analytics.example.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
