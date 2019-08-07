const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User, Category, Thread } = require('../config/database');
const Op = Sequelize.Op;

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.body.subject) {
    res.status(200).json({ success: false, message: 'You must provide the subject' });
  } else if(!req.body.category) {
    res.status(200).json({ success: false, message: 'You must provide the category' });
  } else {
    Category.findByPk(req.body.category).then(category => {
      if(!category) {
        res.status(200).json({ success: false, message: 'Category not found' });
      } else {
        User.findByPk(req.user.id).then(user => {
          let newThread = {
            subject: req.body.subject
          };
          Thread.create(newThread).then(thread => {
            thread.setUser(user).then(() => {
              thread.setCategory(category).then(() => {
                res.status(200).json({ success: true, thread });
              });
            });
          }).catch(err => {
            res.status(200).json({ success: false, message: err.errors[0].message });
          });
        }).catch(err => {
          res.status(500).json({ success: false, message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    });
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.params.id) {
    res.status(200).json({ success: false, message: 'You must provide the thread id' });
  } else {
    Thread.findByPk(req.params.id).then(thread => {
      if(!thread) {
        res.status(200).json({ success: false, message: 'Thread not found' });
      } else {
        if(thread.user_id == req.user.id || req.user.is_moderator) {
          thread.destroy().then(() => {
            res.status(200).json({ success: true, message: 'Thread deleted' });
          }).catch(err => {
            res.status(500).json({ success: false, message: 'Something went wrong' });
          });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    });
  }
});

router.get('/category/:category/page/:page/:itemsPerPage', (req, res) => {
  let itemsPerPage = 5;
  if(!req.params.category) {
    res.status(400).json({ success: false, message: 'You must provide the category id' });
  } else if(!req.params.page) {
    res.status(400).json({ success: false, message: 'You must provide the page' });
  } else {
    Category.findByPk(req.params.category).then(category => {
      if(!category) {
        res.status(200).json({ success: false, message: 'Category not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<15)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Thread.findAll({ where: { category_id: category.id }, offset: (page-1)*itemsPerPage, limit: itemsPerPage }).then(threads => {
          res.status(200).json({ success: true, posts: threads });
        }).catch(err => {
          res.status(500).json({ success: false, message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    });;
  }
});

module.exports = router;