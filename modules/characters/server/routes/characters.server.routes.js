'use strict';

/**
 * Module dependencies
 */
var charactersPolicy = require('../policies/characters.server.policy'),
  characters = require('../controllers/characters.server.controller');

module.exports = function(app) {
  // Characters Routes
  app.route('/api/characters').all(charactersPolicy.isAllowed)
    .get(characters.list)
    .post(characters.create);

  app.route('/api/characters/:characterId').all(charactersPolicy.isAllowed)
    .get(characters.read)
    .put(characters.update)
    .delete(characters.delete);

  // Finish by binding the Character middleware
  app.param('characterId', characters.characterByID);
};
