'use strict';

describe('Characters E2E Tests:', function () {
  describe('Test Characters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/characters');
      expect(element.all(by.repeater('character in characters')).count()).toEqual(0);
    });
  });
});
