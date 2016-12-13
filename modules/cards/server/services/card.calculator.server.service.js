'use strict';

var mongoose = require('mongoose'),
  Character = mongoose.model('Character'),
  Card = mongoose.model('Card');

var cardLevelModifiers = {
  medium: 0,
  strong: 1,
  veryStrong: 2,
  veryVeryStrong: 2,
  sudden: -1,
  verySudden: -2
};

var cardsNumber = function (character) {
  return 10 - Math.floor(character.generation / 2);
};

var BlankCard = function(cardNumber, characterGeneration) {
  var modifiers = this.cardModifiers(cardNumber) || {};
  this.modifier = modifiers.modifier;
  this.isFirstOfType = modifiers.isFirstOfType;
  this.characterGeneration = characterGeneration;
};

BlankCard.prototype.__calculateFigures = function() {

};

/**
 *
 * 13 поколение 4 карт (2/2)
 * 12 поколение 4 карт (2/2)
 *
 * 11 поколение 5 карт (2/2/1)
 * 10 поколение 5 карт (2/2/1)
 *
 * 9 поколение 6 карт (2/2/1/1)
 * 8 поколение 6 карт (2/2/1/1)
 *
 * 7 поколение 7 карт (2/2/2/1) round first puper to  lower and second puper to higher
 */
BlankCard.prototype.cardModifiers = function(cardNumber) {
  switch (cardNumber) {
    case 1:
      return { modifier: cardLevelModifiers.medium, isFirstOfType: true };
    case 2:
      return { modifier: cardLevelModifiers.medium, isFirstOfType: false };
    case 3:
      return { modifier: cardLevelModifiers.strong, isFirstOfType: true };
    case 4:
      return { modifier: cardLevelModifiers.strong, isFirstOfType: false };
    case 5:
      return { modifier: cardLevelModifiers.veryStrong, isFirstOfType: true };
    case 6:
      return { modifier: cardLevelModifiers.sudden, isFirstOfType: true };
    case 7:
      return { modifier: cardLevelModifiers.veryStrong, isFirstOfType: false };
    case 8:
      return { modifier: cardLevelModifiers.veryVeryStrong, isFirstOfType: true };
    case 9:
      return { modifier: cardLevelModifiers.sudden, isFirstOfType: false };
    case 10:
      return { modifier: cardLevelModifiers.verySudden, isFirstOfType: true };
  }
};

var getRawCards = function(character) {
  var cardsNumber = cardsNumber(character);
  var characterGeneration = character.generation;

  var blankCards = [];
  for (var cardNumber = 0; cardNumber <= cardsNumber; cardNumber++) {
    blankCards.push(new BlankCard(cardNumber, characterGeneration));
  }

};

/**
 * Calculates battle card figures
 * returns [ { higher: number, lover: number, cardModifiers: enum} ]
 *
 */
exports.calculateCard = function() {

};

exports.cardLevel = cardLevelModifiers;

var removeCards = function (character) {
  character.cards = character.cards || [];
  var cardIds = character.cards.map(function (c) {
    return c._id;
  });
  Card.remove({ _id: { $in: cardIds } }, function (err) {
    if (err) console.log('Error while deleting ' + err.message);
  });
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
