(function () {
  'use strict';

  // Characters controller
  angular
    .module('characters')
    .controller('CharactersController', CharactersController);

  CharactersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'characterResolve', 'CharactersService'];

  function CharactersController ($scope, $state, $window, Authentication, character, CharactersService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.character = character;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.clans = [
      'Вентру',
      'Тремер',
      'Носферату',
      'Бруджа',
      'Джованни',
      'Тореадор',
      'Малкавиан',
      'Отступники Ласомбра',
      'Равнос'
    ];

    $scope.keyAbilities = [
      'Ментальный',
      'Физический'
    ];

    $scope.generationValues = [ 7, 8, 9, 10, 11, 12, 13];

    $scope.calculateCards = function calculateCard(vm) {
      if (!!vm.character && !!vm.character.cards && !!vm.character.cards.length && !confirm('Все существующие карты персонажа будут удалены перед пересчетом карт.\nПродолжить?')) {
        return;
      }

      CharactersService.recalculateCards(vm.character,
          function(res){
            console.log('res', res);
            vm.character.cards = res.cards;
          },
          function(err){
            console.log('err', err);
          }
      );
    };

    // Remove existing Character
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.character.$remove($state.go('characters.list'));
      }
    }

    // Save Character
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.characterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.character._id) {
        vm.character.$update(successCallback, errorCallback);
      } else {
        vm.character.$save(successCallback, errorCallback);
      }


      function successCallback(res) {
        $state.go('characters.view', {
          characterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
