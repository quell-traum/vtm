'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Card = require('../../../cards/server/models/card.server.model.js');

/**
 * Character Schema
 */
var CharacterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Заполните имя персонажа',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  clan: {
    type: String,
    default: '',
    required: 'Выберите клан',
    trim: true
  },
  keyAbility: {
    type: String,
    default: '',
    required: 'Выберите ключевой навык',
    trim: true
  },
  generation: {
    type: Number,
    default: 1,
    required: 'Выберите поколение'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  cards: [ {
    type : Schema.ObjectId, ref : 'Card'
  } ]
});

mongoose.model('Character', CharacterSchema);
