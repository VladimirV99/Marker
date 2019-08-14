const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User, Forum, Thread, Post } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.body.subject) {
    res.status(400).json({ message: 'You must provide a subject' });
  } else if(!req.body.forum) {
    res.status(400).json({ message: 'You must provide a forum' });
  } else if(!req.body.content) {
    res.status(400).json({ message: 'You must provide post content' });
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
                let newPost = {
                  content: req.body.content
                };
                Post.create(newPost).then(post => {
                  post.setThread(thread).then(() => {
                    post.setUser(user).then(() => {
                      Post.findByPk(post.id).then(post => {
                        res.status(201).json({ message: 'Thread Created', thread, posts:[post] });
                      }).catch(err => {
                        res.status(500).json({ message: 'Something went wrong' });
                      });
                    });
                  });
                });
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

router.get('/get/:id/page/:page/:itemsPerPage', (req, res) => {
  let itemsPerPage = 20;
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a thread' });
  } else if(!req.params.page) {
    res.status(400).json({ message: 'You must provide a page number' });
  } else {
    Thread.findOne({ where: {id: req.params.id}, include: [{ model: Forum }]}).then(thread => {
      if(!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<30)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Post.findAndCountAll({ where: { thread_id: thread.id }, offset: (page-1)*itemsPerPage, limit: itemsPerPage, include: [{ model: User }]}).then(result => {
          res.status(200).json({ forum: thread.forum.name, thread: thread.subject, posts: result.rows, total: result.count });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });;
  }
});

module.exports = router;