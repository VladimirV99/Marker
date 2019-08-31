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
          Post.createPost(newPost, thread, user).then(post => {
            res.status(201).json({ message: 'Post Created', post });
          }).catch(err => {
            res.status(err.status).json({ message: err.message });
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
        if(post.author_id == req.user.id || req.user.is_moderator) {
          if(!post.is_main) {
            Thread.findByPk(post.thread_id).then(thread => {
              if(!thread) {
                res.status(404).json({ message: 'Thread not found' });
              } else {
                thread.post_count = thread.post_count-1;
                thread.save().then(() => {
                  post.destroy().then(() => {
                    res.status(200).json({ message: 'Post deleted' });
                  }).catch(err => {
                    res.status(500).json({ message: 'Something went wrong' });
                  });
                }).catch(err => {
                  res.status(500).json({ message: 'Something went wrong' });
                });
              }
            }).catch(err => {
              res.status(500).json({ message: 'Something went wrong' });
            });
          } else {
            res.status(400).json({ message: 'Can\'t delete main post' });
          }
        } else {
          res.status(401).json({ message: 'Unauthorized' });
        }
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.get('/user/:username/page/:page/:itemsPerPage', (req, res) => {
  let itemsPerPage = 20;
  if(!req.params.username) {
    res.status(400).json({ message: 'You must provide a username' });
  } else if(!req.params.page) {
    res.status(400).json({ message: 'You must provide a page number' });
  } else {
    User.findOne({ where: { username: req.params.username } }).then(user => {
      if(!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<30)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Post.findAndCountAll({
          attributes: ['id', 'content', 'is_main', 'created_at'],
          where: { author_id: user.id },
          offset: (page-1)*itemsPerPage,
          limit: itemsPerPage,
          include: [{ model: Thread, attributes: ['id', 'subject'] }]
        }).then(result => {
          res.status(200).json({
            posts: result.rows,
            total: result.count
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

module.exports = router;