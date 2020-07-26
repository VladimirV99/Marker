const express = require('express');
const router = express.Router();
const passport = require('passport');
const { setCache, getCache } = require('../config/redis');
const { Category } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  Category.createCategory(req.body.name, req.user.model).then(category => {
    res.status(201).json({ message: 'Category Created', category });
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.post('/rename/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Category.createCategory(req.params.id, req.body.newName, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Category.delete(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.get('/all', getCache('categories/all'), (req, res) => {
  Category.findAll().then(categories => {
    res.status(200).json({ categories });
    setCache('categories/all', {status: 200, response: {categories}}, 300);
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

module.exports = router;