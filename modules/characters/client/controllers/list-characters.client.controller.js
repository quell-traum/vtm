(function () {
  'use strict';

  angular
    .module('characters')
    .controller('CharactersListController', CharactersListController);

  CharactersListController.$inject = ['CharactersService', '$scope', '$state'];

  function CharactersListController(CharactersService, $scope, $state) {
    var vm = this;

    vm.characters = CharactersService.query();

    $scope.goToCharacter = function(characterId) {
      $state.go('characters.view', {
        characterId: characterId
      });
    }

  }

}());
