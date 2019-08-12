const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { Category, Forum } = require('../config/database');
const Op = Sequelize.Op;

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } else {
    if(!req.body.name) {
      req.status(400).json({ success: false, message: 'You must provide a forum name' });
    } else if(!req.body.category) {
      res.status(400).json({ success: false, message: 'You must provide a category' });
    } else {
      Category.findByPk(req.body.category).then(category => {
        if(!category) {
          res.status(404).json({ success: false, message: 'Category not found' });
        } else {
          let newForum = {
            name: req.body.name
          };
          Forum.create(newForum).then(forum => {
            forum.setCategory(category).then(() => {
                res.status(201).json({ success: true, message: 'Forum Created', forum });
            });
          }).catch(err => {
            res.status(400).json({ success: false, message: err.errors[0].message });
          });
        }
      }).catch(err => {
        res.status(500).json({ success: false, message: 'Something went wrong' });
      });
    }
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } else {
    Forum.findByPk(req.params.id).then(forum => {
      if(!forum) {
        res.status(404).json({ success: false, message: 'Forum not found' });
      } else {
        forum.destroy().then(() => {
          res.status(200).json({ success:true, message: 'Forum deleted' });
        }).catch(err => {
          res.status(500).json({ success: false, message: 'Something went wrong '});
        });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong '});
    });
  }
});

router.get('/category/:id', (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ success: false, message: 'You must provide a category' });
  } else {
    Category.findByPk(req.params.id).then(category => {
      if(!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
      } else {
        Forum.findAll({ where: { category_id: req.params.id } }).then(forums => {
          res.status(200).json({ success: true, forums });
        }).catch(err => {
          res.status(500).json({ success: false, message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    });
  }
});

router.get('/all', (req, res) => {
  Category.findAll().then(categories => {
    let promises = [];
    let result = [];
    categories.forEach(category => {
      promises.push(Forum.findAll({ where: { category_id: category.id } }));
      result.push({ id: category.id, name: category.name });
    });
    Promise.all(promises).then(values => {
      for(let i = 0; i < values.length; i++) {
        result[i].forums = values[i];
      }
      res.status(200).json({ forums: result });
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    })
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

module.exports = router;