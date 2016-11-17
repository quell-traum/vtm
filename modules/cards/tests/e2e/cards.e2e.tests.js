'use strict';

describe('Cards E2E Tests:', function () {
  describe('Test Cards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cards');
      expect(element.all(by.repeater('card in cards')).count()).toEqual(0);
    });
  });
});
