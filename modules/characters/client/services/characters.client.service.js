// Characters service used to communicate Characters REST endpoints
(function () {
  'use strict';

  angular
    .module('characters')
    .factory('CharactersService', CharactersService);

  CharactersService.$inject = ['$resource'];

  function CharactersService($resource) {
    return $resource('api/characters/:characterId', {
      characterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      recalculateCards: {
        url: 'api/characters/:characterId/recalculateCards',
        method: 'PUT'
      }
    });
  }
}());
