const express = require('express');

const app = express();

/* CORS */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Index');
});

const port = process.env.port || 5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})