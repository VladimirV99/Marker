const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User, Forum, Thread } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.body.subject) {
    res.status(400).json({ message: 'You must provide a subject' });
  } else if(!req.body.forum) {
    res.status(400).json({ message: 'You must provide a forum' });
  } else {
    Forum.findByPk(req.body.forum).then(forum => {
      if(!forum) {
        res.status(404).json({ message: 'Forum not found' });
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
            res.status(400).json({ message: err.errors[0].message });
          });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide the thread id' });
  } else {
    Thread.findByPk(req.params.id).then(thread => {
      if(!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        if(thread.user_id == req.user.id || req.user.is_moderator) {
          thread.destroy().then(() => {
            res.status(200).json({ message: 'Thread deleted' });
          }).catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
          });
        } else {
          res.status(401).json({ message: 'Unauthorized' });
        }
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

module.exports = router;