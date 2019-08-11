const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { Category } = require('../config/database');
const Op = Sequelize.Op;

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } else {
    if(!req.body.name) {
      req.status(400).json({ success: false, message: 'You must provide a category name' });
    } else {
      let newCategory = {
        name: req.body.name
      };
      Category.create(newCategory).then(category => {
        res.status(201).json({ success: true, message: 'Category Created', category });
      }).catch(err => {
        res.status(400).json({ success: false, message: err.errors[0].message });
      });
    }
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } else {
    Category.findByPk(req.params.id).then(category => {
      if(!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
      } else {
        category.destroy().then(() => {
          res.status(200).json({ success:true, message: 'Category deleted' });
        }).catch(err => {
          res.status(500).json({ success: false, message: 'Something went wrong '});
        });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong '});
    });
  }
});

router.get('/all', (req, res) => {
  Category.findAll().then(categories => {
    res.status(200).json({ success: true, categories });
  }).catch(err => {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  });
});

module.exports = router;