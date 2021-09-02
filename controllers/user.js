const mongoose = require('mongoose');
const models = require('./models');
const omit = require('lodash.omit');

const { userSchema, wordSchema, spaceSchema, wordsCollectionSchema } = models;
const User = mongoose.model('User', userSchema);
const Word = mongoose.model('Word', wordSchema);
const Space = mongoose.model('Space', spaceSchema);
const WordsCollection = mongoose.model(
  'WordsCollection',
  wordsCollectionSchema,
);

const sortedArrByData = (arr) => {
  return arr.sort((item1, item2) => {
    const firstSeconds = new Date(item1.createdDate).getTime();
    const secondSeconds = new Date(item2.createdDate).getTime();

    if (firstSeconds > secondSeconds) {
      return -1;
    } else if (firstSeconds < secondSeconds) {
      return 1;
    }
    return 0;
  });
};

const user = async (ctx) => {
  console.log('user');
  const user = await User.findById(ctx.request.query.id).lean();

  if (!user) {
    ctx.body = 'unautorized loh';
    ctx.status = 401;

    return;
  }

  if (user) {
    // const sortedWords = sortedArrByData(user.words)
    ctx.body = omit(user, 'password');
    ctx.status = 200;
  }
};

const login = async (ctx) => {
  console.log('зашел в login');
  const user = await User.findOne({ login: ctx.request.query.login }).lean();

  if (!user) {
    ctx.body = {
      accessToken: 'wqdwjndwjendkwkwendkjnjn',
    };
    ctx.status = 200;

    return;
  }

  if (user && user.password === ctx.request.query.password) {
    // const sortedWords = sortedArrByData(user.words)
    // const correctUser = {
    //   ...omit(user, 'password'),
    //   words: sortedWords,
    // };
    ctx.body = omit(user, 'password');
    ctx.status = 200;
    ctx.cookies.set('userId', user._id, { signed: true, httpOnly: false });
  }
};

const addUserTodb = (data) => {
  const newUser = new User(data);
  return new Promise((resolve, reject) => {
    newUser.save(async (err) => {
      if (err) {
        console.error(err);
        reject('Error');
      } else {
        resolve('CREATED new user');
      }
    });
  });
};

const register = async (ctx) => {
  const user = await addUserTodb(ctx.request.body);
  ctx.body = user;
  ctx.status = 200;
};

const addSpaceToUser = async ({ _id, name }) => {
  const user = await User.findById(_id);
  const existingSpace = user?.spaces.find((item) => item.name === name);

  if (existingSpace) {
    return 'This space already existing';
  }

  const newWordsCollection = await new WordsCollection();
  newWordsCollection.save(function(err) {
    if (err) return handleError(err);
  });

  const newSpace = new Space({
    name,
    words: newWordsCollection._id,
  });

  const updatedUser = await User.findByIdAndUpdate(_id, {
    $addToSet: { spaces: newSpace },
  }).exec();

  return updatedUser;
};

const createSpace = async (ctx) => {
  const post = await addSpaceToUser(ctx.request.body);
  ctx.body = post;
  ctx.status = 200;
};

const addWordToSpace = async ({ userId, spaceId, ...otherData }) => {
  const user = await User.findById(userId);
  const currentSpace = user.spaces.find((item) => {
    console.log(String(item._id), 'spaceId', spaceId, item._id == spaceId);
    return String(item._id) === spaceId;
  });
  console.log('spaceId', spaceId, user.spaces, 'currentSpace', currentSpace);
  const currentWordsColl = await WordsCollection.findById(currentSpace.words);

  const existingWord = currentWordsColl.words.find(
    (item) => item.word === otherData.word,
  );

  console.log('existingWord', existingWord);

  if (existingWord) {
    return 'This word already existing';
  }

  const newWord = new Word(otherData);

  const updatedCollection = await WordsCollection.findByIdAndUpdate(
    currentSpace.words,
    { $addToSet: { words: newWord } },
  ).exec();

  return updatedCollection;
};

const createWord = async (ctx) => {
  const post = await addWordToSpace(ctx.request.body);
  ctx.body = post;
  ctx.status = 200;
};

const deleteWord = async (ctx) => {
  const { userId, wordId } = ctx.request.body;

  await User.findByIdAndUpdate(userId, {
    $pull: { words: { _id: wordId } },
  }).exec();

  ctx.body = {};
};

module.exports = {
  login,
  register,
  createWord,
  deleteWord,
  createSpace,
};
