const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: String,
  translate: String,
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const wordsCollectionSchema = new mongoose.Schema({
  words: [wordSchema]
});

const spaceSchema = new mongoose.Schema({
  name: String,
  words: String
});

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  spaces: [spaceSchema]
});



module.exports = {
  wordsCollectionSchema,
  wordSchema,
  userSchema,
  spaceSchema
};