require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const session = require('koa-generic-session');
// const router = require('koa-route');
// const user = require('./controllers/user');
// const words = require('./controllers/words');

const app = new Koa();
app.keys = ['some secret hurr'];
const koaOptions = {
  origin: false,
  credentials: true,
};
app.use(cors(koaOptions));
app.use(session());

console.log('start app');

// app.use(userauth({
//   match: '/user',
//   // auth system login url
//   loginURLFormatter: function (url) {
//     return 'http://login.demo.com/login?redirect=' + url;
//   },
//   // login callback and getUser info handler
//   getUser: async ctx => {
//     var token = this.query.token;
//     // get user
//     return user;
//   }
// }));

// const routes = require('./controllers/routes');
// const db = require('./controllers/db');
// const mongooseConfig = require('./lib/mongoose-config');
const config = require('./lib/config');

app.use(bodyParser());
// app.use(session(app))

// mongooseConfig();
// db();
// app.use(routes());
// app.use(router.get('/api/user', user.user));
// app.use(router.get('/api/login', user.login));
// app.use(router.post('/api/register', user.register));
// app.use(router.post('/api/word', user.createWord));
// app.use(router.delete('/api/word', user.deleteWord));
// app.use(router.post('/api/space', user.createSpace));
// app.use(router.get('/api/words', words.getWords));

// const water = new Word({ word: 'water', translate: 'вода' });
// water.save((err, second) => {
//   if (err) return console.error(err);
//     console.log('second arg', second)
// })

app.listen(config.port);
