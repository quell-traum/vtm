'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Персонажи',
      state: 'characters',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Список персонажей',
      state: 'characters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Создать персонажа',
      state: 'characters.create',
      roles: ['user']
    });
  }
]);
