const express = require('express');
const passport = require('passport');

const users = require('./routes/users');
const categories = require('./routes/categories');
const forums = require('./routes/forums');
const threads = require('./routes/threads');
const posts = require('./routes/posts');

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const { db } = require('./config/database');
const { createCache } = require('./config/redis');

createCache(REDIS_PORT);

const app = express();

/* CORS */
if(process.env.NODE_ENV !== 'production') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
}

app.use(express.static('./public'));

app.use(express.json());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/forums', forums);
app.use('/api/threads', threads);
app.use('/api/posts', posts);

if(process.env.NODE_ENV === 'production') {           
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

db.authenticate().then(() => {
  console.log('Connected to Database.');
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to Connect to the Database:', err);
});