'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
    required: 'Выберите ключевую способность',
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
  }
});

mongoose.model('Character', CharacterSchema);
