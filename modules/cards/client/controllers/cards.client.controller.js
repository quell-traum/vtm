(function () {
  'use strict';

  // Cards controller
  angular
    .module('cards')
    .controller('CardsController', CardsController);

  CardsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'cardResolve'];

  function CardsController ($scope, $state, $window, Authentication, card) {
    var vm = this;

    vm.authentication = Authentication;
    vm.card = card;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Card
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.card.$remove($state.go('cards.list'));
      }
    }

    // Save Card
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cardForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.card._id) {
        vm.card.$update(successCallback, errorCallback);
      } else {
        vm.card.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cards.view', {
          cardId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
