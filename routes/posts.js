const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User, Thread, Post, VoteBalance } = require('../config/database');
const { getUser } = require('../util/auth');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.createPost(req.body.content, req.body.thread, req.user.model).then(post => {
    res.status(201).json({ message: 'Post Created', post });
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.delete(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.post('/upvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.upvote(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.post('/downvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.downvote(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
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
            { model: VoteBalance, attributes: [[Sequelize.fn('COALESCE', Sequelize.col('balance'), 0), 'balance']] },
            { 
              model: User,
              attributes: ['id'],
              through: { attributes: ['type'], where: { 'user_id': req.user.id } },
              as: 'votes',
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