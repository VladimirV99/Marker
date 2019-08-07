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
      req.status(200).json({ success: false, message: 'You must provide a category name' });
    } else {
      let newCategory = {
        name: req.body.name
      };
      Category.create(newCategory).then(category => {
        res.status(201).json({ success: true, message: 'Category Created' });
      }).catch(err => {
        res.status(200).json({ success: false, message: err.errors[0].message });
      });
    }
  }
});

router.delete('/delete/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } else {
    Category.findOne({ where: { name: req.params.name } }).then(category => {
      if(!category) {
        res.status(200).json({ success: false, message: 'Category not found' });
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

module.exports = router;