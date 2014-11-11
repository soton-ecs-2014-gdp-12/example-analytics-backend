'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/video");
  });


  describe('video', function() {

    beforeEach(function() {
      browser.get('index.html#/video');
    });


    it('should render view1 when user navigates to /video', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for video/);
    });

  });

});
