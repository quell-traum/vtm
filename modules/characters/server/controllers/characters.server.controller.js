'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Character = mongoose.model('Character'),
  Card = mongoose.model('Card'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var removeCards = function (character) {
  character.cards = character.cards || [];
  var cardIds = character.cards.map(function (c) {
    return c._id;
  });
  Card.remove({ _id: { $in: cardIds } }, function (err) {
    if (err) console.log('Error while deleting ' + err.message);
  });
};

var cardsNumber = function (character) {
  return 10 - Math.floor(character.generation / 2);
};

var createCard = function (character) {
  var card = new Card({
    physicalPower: parseInt(Math.random() * 100),
    mentalPower: parseInt(Math.random() * 100),
    _character: character._id
  });
  card.save(function (err) {
  });
  return card;
};

var createCards = function (character) {
  removeCards(character);
  character.cards = [];

  for (var i = 0; i < cardsNumber(character); i++) {
    var card = createCard(character);
    character.cards.push(card);
  }

  character.save();
};

/**
 * Create a Character
 */
exports.create = function (req, res) {
  var character = new Character(req.body);
  character.user = req.user;

  character.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(character);
    }
  });
};

/**
 * Show the current Character
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var character = req.character ? req.character.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  character.isCurrentUserOwner = req.user && character.user && character.user._id.toString() === req.user._id.toString();

  res.jsonp(character);
};

/**
 * Update a Character
 */
exports.update = function (req, res) {
  var character = req.character;

  character = _.extend(character, req.body);

  character.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(character);
    }
  });
};

/**
 * Delete an Character
 */
exports.delete = function (req, res) {
  var character = req.character;

  character.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(character);
    }
  });
};

/**
 * List of Characters
 */
exports.list = function (req, res) {
  Character.find().sort('-created').populate('user', 'displayName').exec(function (err, characters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(characters);
    }
  });
};

/**
 * Character middleware
 */
exports.characterByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Character is invalid'
    });
  }

  Character.findById(id).populate('user', 'displayName').populate('cards').exec(function (err, character) {
    if (err) {
      return next(err);
    } else if (!character) {
      return res.status(404).send({
        message: 'No Character with that identifier has been found'
      });
    }
    req.character = character;
    next();
  });
};

exports.recalculateCards = function (req, res) {
  var character = req.character;

  createCards(character);
  Character.findById(character._id).populate('user', 'displayName').populate('cards').exec(function (err, character) {
    if (err) {
      return res.status(400).send(err);
    } else if (!character) {
      return res.status(404).send({
        message: 'No Character with that identifier has been found'
      });
    }
    res.jsonp(character);
  });
};
