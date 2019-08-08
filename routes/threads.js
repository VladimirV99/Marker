const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User, Forum, Thread } = require('../config/database');
const Op = Sequelize.Op;

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.body.subject) {
    res.status(200).json({ success: false, message: 'You must provide a subject' });
  } else if(!req.body.forum) {
    res.status(200).json({ success: false, message: 'You must provide a forum' });
  } else {
    Forum.findByPk(req.body.forum).then(forum => {
      if(!forum) {
        res.status(200).json({ success: false, message: 'Forum not found' });
      } else {
        User.findByPk(req.user.id).then(user => {
          let newThread = {
            subject: req.body.subject
          };
          Thread.create(newThread).then(thread => {
            thread.setUser(user).then(() => {
              thread.setForum(forum).then(() => {
                res.status(201).json({ success: true, message: 'Thread Created', thread });
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

router.get('/forum/:forum/page/:page/:itemsPerPage', (req, res) => {
  let itemsPerPage = 5;
  if(!req.params.forum) {
    res.status(400).json({ success: false, message: 'You must provide a forum' });
  } else if(!req.params.page) {
    res.status(400).json({ success: false, message: 'You must provide a page number' });
  } else {
    Forum.findByPk(req.params.forum).then(forum => {
      if(!forum) {
        res.status(200).json({ success: false, message: 'Forum not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<15)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Thread.findAll({ where: { forum_id: forum.id }, offset: (page-1)*itemsPerPage, limit: itemsPerPage }).then(threads => {
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