const mongoose = require('mongoose');
const models = require('./models');
const omit = require('lodash.omit');

const { wordSchema, wordsCollectionSchema } = models;
const Word = mongoose.model('Word', wordSchema);
const WordsCollection = mongoose.model('WordsCollection', wordsCollectionSchema);


const sortedArrByData = (arr) => {
  return arr.sort((item1, item2) => {
    const firstSeconds = new Date(item1.createdDate).getTime();
    const secondSeconds = new Date(item2.createdDate).getTime();

    if (firstSeconds > secondSeconds) {
      return -1;
    } else if (firstSeconds < secondSeconds) {
      return 1;
    } return 0;
  });
}

const getWords = async (ctx) => {
  const currentWordsColl = await WordsCollection.findById(ctx.request.query.wodsId); 
  const sortedWords = sortedArrByData(currentWordsColl.words)

  ctx.body = sortedWords;
}

module.exports = {
  getWords
}