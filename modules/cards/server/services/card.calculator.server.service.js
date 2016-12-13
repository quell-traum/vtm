'use strict';

var mongoose = require('mongoose'),
  Character = mongoose.model('Character'),
  Card = mongoose.model('Card');

var LOWEST_GENERATION = 13;

var cardLevelModifiers = {
  medium: 0,
  strong: 1,
  veryStrong: 2,
  veryVeryStrong: 3,
  sudden: -1,
  verySudden: -2
};


var BlankCard = function(cardNumber, characterGeneration) {
  this.__setCardModifiers(cardNumber);
  this.characterGeneration = characterGeneration;
  this.__calculateFigures();
};

BlankCard.prototype.__calculateFigures = function() {
  var base = LOWEST_GENERATION - this.characterGeneration + 1;
  var figure = base / 2 + this.modifier;

  // first card of type has higher figure rounded to be closer to the base and lower - to be farther from the base
  // second card of type has higher figure rounded to be farther from the base and lower - to be closer to the base
  if (this.isFirstOfType) {
    this.higherFigure = Math.ceil(figure);
    this.lowerFigure = Math.floor(figure);
  } else {
    this.higherFigure = Math.floor(figure);
    this.lowerFigure = Math.ceil(figure);
  }
}
;

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
BlankCard.prototype.__setCardModifiers = function(cardNumber) {
  switch (cardNumber) {
    case 1:
      this.modifier = cardLevelModifiers.medium;
      this.isFirstOfType = true;
      break;
    case 2:
      this.modifier = cardLevelModifiers.medium;
      this.isFirstOfType = false;
      break;
    case 3:
      this.modifier = cardLevelModifiers.strong;
      this.isFirstOfType = true;
      break;
    case 4:
      this.modifier = cardLevelModifiers.strong;
      this.isFirstOfType = false;
      break;
    case 5:
      this.modifier = cardLevelModifiers.veryStrong;
      this.isFirstOfType = true;
      break;
    case 6:
      this.modifier = cardLevelModifiers.sudden;
      this.isFirstOfType = true;
      break;
    case 7:
      this.modifier = cardLevelModifiers.veryStrong;
      this.isFirstOfType = false;
      break;
    case 8:
      this.modifier = cardLevelModifiers.veryVeryStrong;
      this.isFirstOfType = true;
      break;
    case 9:
      this.modifier = cardLevelModifiers.sudden;
      this.isFirstOfType = false;
      break;
    case 10:
      this.modifier = cardLevelModifiers.verySudden;
      this.isFirstOfType = true;
      break;
  }
};

var getRawCards = function(character) {
  var cardsNumber = 10 - Math.floor(character.generation / 2);

  var characterGeneration = character.generation;

  var blankCards = [];
  for (var cardNumber = 0; cardNumber <= cardsNumber; cardNumber++) {
    blankCards.push(new BlankCard(cardNumber, characterGeneration));
  }
  return blankCards;
};

exports.removeCards = function (character) {
  character.cards = character.cards || [];
  var cardIds = character.cards.map(function (c) {
    return c._id;
  });
  Card.remove({ _id: { $in: cardIds } }, function (err) {
    if (err) console.log('Error while deleting ' + err.message);
  });
};

var createCard = function (character, blankCard) {
  var cardData = {
    _character: character._id,
    manual: false,
    physicalPower: 0,
    mentalPower: 0
  };
  switch (character.keyAbility) {
    case 'Ментальный':
      cardData.physicalPower = blankCard.lowerFigure;
      cardData.mentalPower = blankCard.higherFigure;
      break;
    case 'Физический':
      cardData.physicalPower = blankCard.higherFigure;
      cardData.mentalPower = blankCard.lowerFigure;
      break;
  }

  var card = new Card(cardData);
  card.save(function (err) {
  });
  return card;
};

exports.createCards = function (character) {
  var blankCards = getRawCards(character) || [];

  for (var i = 0; i < blankCards.length; i++) {
    var card = createCard(character, blankCards[i]);
    character.cards.push(card);
  }
};
