const express = require('express');
const router = express.Router();
const passport = require('passport');
const { setCache, getCache } = require('../config/redis');
const { Category } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    if(!req.body.name) {
      res.status(400).json({ message: 'You must provide a category name' });
    } else {
      let newCategory = {
        name: req.body.name
      };
      Category.create(newCategory).then(category => {
        res.status(201).json({ message: 'Category Created', category });
      }).catch(err => {
        res.status(400).json({ message: err.errors[0].message });
      });
    }
  }
});

router.post('/rename/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    if(!req.body.newName) {
      res.status(400).json({ message: 'You must provide a category name' });
    } else {
      Category.findByPk(req.params.id).then(category => {
        if(!category) {
          res.status(404).json({ message: 'Category not found' });
        } else {
          category.name = req.body.newName;
          category.save().then(() => {
            res.status(200).json({ message: 'Category renamed' });
          }).catch(err => {
            res.status(500).json({ message: 'Something went wrong '});
          });
        }
      }).catch(err => {
        res.status(500).json({ message: 'Something went wrong '});
      });
    }
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    Category.findByPk(req.params.id).then(category => {
      if(!category) {
        res.status(404).json({ message: 'Category not found' });
      } else {
        category.destroy().then(() => {
          res.status(200).json({ message: 'Category deleted' });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong '});
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong '});
    });
  }
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