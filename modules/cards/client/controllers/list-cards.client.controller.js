(function () {
  'use strict';

  angular
    .module('cards')
    .controller('CardsListController', CardsListController);

  CardsListController.$inject = ['CardsService'];

  function CardsListController(CardsService) {
    var vm = this;

    vm.cards = CardsService.query();
  }
}());
