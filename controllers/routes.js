const mongoose = require('mongoose');
const models = require('./models');
const omit = require('lodash.omit');

const routes = () => {
  const { wordSchema } = models;

  const alotWrodsPipeline = (wordsAlot) => {
    const wordsArr = wordsAlot.split(/\d/)
      .map(item => {
        const indexx = item.indexOf('↵')
        return item.slice(0, indexx)
      })
      .map(item => item.trim())
      .map(item => item.slice(2))

    return wordsArr.map(item => {
      const firstIndex = item.indexOf('-')
      return {
          word: item.slice(0, firstIndex).trim(),
          translate: item.slice(firstIndex + 1).trim(),
        }
    })
    .filter(item => !!item.word)
  }

  return async (ctx, next) => {
    const url = ctx.request.path
    if (url === '/api/create/alot' && ctx.request.method === 'POST') {
      const arrs = alotWrodsPipeline(ctx.request.body.words)
      const posts = await arrs.forEach(item => addWordToDb(item));
      ctx.body = posts
      ctx.status = 200
    }  else {
      ctx.body = 'Hello Koa'
    }
  }
}

module.exports = routes