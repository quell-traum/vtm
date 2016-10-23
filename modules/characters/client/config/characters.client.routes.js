(function () {
  'use strict';

  angular
    .module('characters')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('characters', {
        abstract: true,
        url: '/characters',
        template: '<ui-view/>'
      })
      .state('characters.list', {
        url: '',
        templateUrl: 'modules/characters/client/views/list-characters.client.view.html',
        controller: 'CharactersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Characters List'
        }
      })
      .state('characters.create', {
        url: '/create',
        templateUrl: 'modules/characters/client/views/form-character.client.view.html',
        controller: 'CharactersController',
        controllerAs: 'vm',
        resolve: {
          characterResolve: newCharacter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Characters Create'
        }
      })
      .state('characters.edit', {
        url: '/:characterId/edit',
        templateUrl: 'modules/characters/client/views/form-character.client.view.html',
        controller: 'CharactersController',
        controllerAs: 'vm',
        resolve: {
          characterResolve: getCharacter
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Character {{ characterResolve.name }}'
        }
      })
      .state('characters.view', {
        url: '/:characterId',
        templateUrl: 'modules/characters/client/views/view-character.client.view.html',
        controller: 'CharactersController',
        controllerAs: 'vm',
        resolve: {
          characterResolve: getCharacter
        },
        data: {
          pageTitle: 'Character {{ characterResolve.name }}'
        }
      });
  }

  getCharacter.$inject = ['$stateParams', 'CharactersService'];

  function getCharacter($stateParams, CharactersService) {
    return CharactersService.get({
      characterId: $stateParams.characterId
    }).$promise;
  }

  newCharacter.$inject = ['CharactersService'];

  function newCharacter(CharactersService) {
    return new CharactersService();
  }
}());
