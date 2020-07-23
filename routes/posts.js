const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User, Forum, Thread, Post, Vote, VoteCount } = require('../config/database');
const { getUser } = require('../util/auth');

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
    Post.findByPk(req.params.id, {
      attributes: [ 'id', 'is_main' ],
      include: [
        { model: User, attributes: ['id'], as: 'author' },
        { model: Thread, attributes: ['id'], include: { model: Forum, attributes: ['id'] } }
      ]
    }).then(post => {
      if(!post) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        if((post.author.id == req.user.id) || req.user.is_moderator) {
          if(!post.is_main) {
            post.thread.post_count -= 1;
            post.thread.save().then(() => {
              post.destroy().then(() => {
                res.status(200).json({ message: 'Post deleted' });
              }).catch(err => {
                res.status(500).json({ message: 'Something went wrong' });
              });
            }).catch(err => {
              res.status(500).json({ message: 'Something went wrong' });
            });
          } else {
            post.thread.forum.thread_count -= 1;
            post.thread.forum.save().then(() => {
              post.thread.destroy().then(() => {
                res.status(200).json({ message: 'Thread deleted' });
              }).catch(err => {
                res.status(500).json({ message: 'Something went wrong' });
              });
            }).catch(err => {
              res.status(500).json({ message: 'Something went wrong' });
            });
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

router.post('/upvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide the post id' });
  } else {
    Post.findByPk(req.params.id, {include: VoteCount}).then(post => {
      if(!post) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        if(post.authorId != req.user.id) {
          Vote.findOne({ user_id: req.user.id, post_id:post.id }).then(vote => {
            if(!vote) {
              Vote.create({ userId: req.user.id, postId:post.id, type: 1 }).then(vote => {
                post.vote_count.count += 1;
                post.vote_count.save().then(() => {
                  res.status(200).json({
                    id: post.id,
                    count: post.vote_count.count,
                    upvoted: true,
                    user_id: req.user.id,
                    message: 'Upvoted post'
                  });
                });
              });
            } else {
              if(vote.type != 1) {
                let diff = 1 - vote.type;
                vote.type = 1;
                vote.save().then(() => {
                  post.vote_count.count += diff;
                  post.vote_count.save().then(() => {
                    res.status(200).json({
                      id: post.id,
                      count: post.vote_count.count,
                      upvoted: true,
                      user_id: req.user.id,
                      message: 'Upvoted post'
                    });
                  });
                });
              } else {
                vote.destroy().then(() => {
                  post.vote_count.count -= 1;
                  post.vote_count.save().then(() => {
                    res.status(200).json({
                      id: post.id,
                      count: post.vote_count.count,
                      upvoted: false,
                      user_id: req.user.id,
                      message: 'Upvote removed'
                    });
                  });
                });
              }
            }
          }).catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
          });
        } else {
          res.status(401).json({ message: 'You can\'t upvote your own post' });
        }
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.post('/downvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide the post id' });
  } else {
    Post.findByPk(req.params.id, {include: VoteCount}).then(post => {
      if(!post) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        if(post.authorId != req.user.id) {
          Vote.findOne({ user_id: req.user.id, post_id:post.id }).then(vote => {
            if(!vote) {
              Vote.create({ userId: req.user.id, postId:post.id, type: -1 }).then(vote => {
                post.vote_count.count -= 1;
                post.vote_count.save().then(() => {
                  res.status(200).json({
                    id: post.id,
                    count: post.vote_count.count,
                    downvoted: true,
                    user_id: req.user.id,
                    message: 'Downvoted post'
                  });
                });
              });
            } else {
              if(vote.type != -1) {
                let diff = -1 - vote.type;
                vote.type = -1;
                vote.save().then(() => {
                  post.vote_count.count += diff;
                  post.vote_count.save().then(() => {
                    res.status(200).json({
                      id: post.id,
                      count: post.vote_count.count,
                      downvoted: true,
                      user_id: req.user.id,
                      message: 'Downvoted post'
                    });
                  });
                });
              } else {
                vote.destroy().then(() => {
                  post.vote_count.count += 1;
                  post.vote_count.save().then(() => {
                    res.status(200).json({
                      id: post.id,
                      count: post.vote_count.count,
                      downvoted: false,
                      user_id: req.user.id,
                      message: 'Downvote removed'
                    });
                  });
                });
              }
            }
          }).catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
          });
        } else {
          res.status(401).json({ message: 'You can\'t downvote your own post' });
        }
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.get('/user/:username/page/:page/:itemsPerPage', getUser, (req, res) => {
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
          include: [
            { model: Thread, attributes: ['id', 'subject'] },
            { model: VoteCount, attributes: [[Sequelize.fn('COALESCE', Sequelize.col('count'), 0), 'count']] },
            { 
              model: User,
              through: { attributes: ['type'], where: { 'user_id': req.user.id } },
              as: 'votes'
            }
          ],
          subQuery: false,
          order: [['created_at', 'DESC']]
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