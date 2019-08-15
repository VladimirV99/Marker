const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User, Thread, Post } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.body.content) {
    res.status(400).json({ message: 'You must provide post content' });
  } else if(!req.body.thread) {
    res.status(400).json({ message: 'You must provide a thread' });
  } else {
    Thread.findByPk(req.body.thread).then(thread => {
      if(!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        User.findByPk(req.user.id).then(user => {
          let newPost = {
            content: req.body.content
          };
          Post.create(newPost).then(post => {
            post.setThread(thread).then(() => {
              post.setUser(user).then(() => {
                // console.log(post); //do i need do query again?
                Post.findOne({ where: { id: post.id }, include: [{ model: User }] }).then(post => {
                  res.status(201).json({ message: 'Post Created', post });
                }).catch(err => {
                  res.status(500).json({ message: 'Something went wrong' });
                });
              });
            });
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
    res.status(400).json({ message: 'You must provide the post id' });
  } else {
    Post.findByPk(req.params.id).then(post => {
      if(!post) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        if(post.user_id == req.user.id || req.user.is_moderator) {
          post.destroy().then(() => {
            res.status(200).json({ message: 'Post deleted' });
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