'use strict';

/**
 * Module dependencies
 */
var cardsPolicy = require('../policies/cards.server.policy'),
  cards = require('../controllers/cards.server.controller');

module.exports = function(app) {
  // Cards Routes
  app.route('/api/cards').all(cardsPolicy.isAllowed)
    .get(cards.list)
    .post(cards.create);

  app.route('/api/cards/:cardId').all(cardsPolicy.isAllowed)
    .get(cards.read)
    .put(cards.update)
    .delete(cards.delete);

  // Finish by binding the Card middleware
  app.param('cardId', cards.cardByID);
};
