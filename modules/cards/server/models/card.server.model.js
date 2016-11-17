'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Card Schema
 */
var CardSchema = new Schema({
  physicalPower: {
    type: Number,
    default: 0
  },
  mentalPower: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  },
  _character : {
    type: Schema.ObjectId,
    ref: 'Character'
  },
  manual: {
    type: Boolean,
    default:true
  }
});

mongoose.model('Card', CardSchema);
