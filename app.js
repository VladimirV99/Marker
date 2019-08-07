const express = require('express');
const passport = require('passport');

const users = require('./routes/users');
const categories = require('./routes/categories');

const { db } = require('./config/database');
db.authenticate().then(() => {
  console.log('Connected to Database.');
}).catch(err => {
  console.error('Unable to Connect to the Database:', err);
});

const app = express();

/* CORS */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.json());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Index');
});

app.use('/api/users', users);
app.use('/api/categories', categories);

app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})