// Cards service used to communicate Cards REST endpoints
(function () {
  'use strict';

  angular
    .module('cards')
    .factory('CardsService', CardsService);

  CardsService.$inject = ['$resource'];

  function CardsService($resource) {
    return $resource('api/cards/:cardId', {
      cardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
