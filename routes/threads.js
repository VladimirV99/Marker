const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User, Category, Forum, Thread, Post, VoteBalance } = require('../config/database');
const { getUser } = require('../util/auth');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  Thread.createThread(req.body.subject, req.body.content, req.body.forum, req.user.model).then(result => {
    res.status(201).json({ message: 'Thread Created', thread: result.thread, posts: result.posts });
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.post('/rename/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Thread.rename(req.params.id, req.body.newName, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Thread.delete(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.get('/get/:id/page/:page/:itemsPerPage', getUser, (req, res) => {
  let itemsPerPage = 20;
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a thread' });
  } else if(!req.params.page) {
    res.status(400).json({ message: 'You must provide a page number' });
  } else {
    Thread.findOne({ 
      attributes: ['id', 'subject', 'created_at'],
      where: {id: req.params.id},
      include: [
        { model: Forum, attributes: ['id', 'name'], include: [Category] },
        { model: User, as: 'author', attributes: ['id', 'username', 'first_name', 'last_name'] }
      ]
    }).then(thread => {
      if(!thread) {
        res.status(404).json({ message: 'Thread not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<30)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Post.findAndCountAll({
          attributes: ['id', 'content', 'is_main', 'created_at'],
          where: { thread_id: thread.id },
          offset: (page-1)*itemsPerPage,
          limit: itemsPerPage,
          include: [
            { model: User, attributes: ['id', 'username', 'first_name', 'last_name', 'photo'], as: 'author' },
            { model: VoteBalance, attributes: [[Sequelize.fn('COALESCE', Sequelize.col('balance'), 0), 'balance']] },
            { 
              model: User,
              attributes: ['id'],
              through: { attributes: ['type'], where: { 'user_id': req.user.id } },
              as: 'votes',
            }
          ],
          subQuery: false,
          order: [['created_at', 'ASC']]
        }).then(result => {
          res.status(200).json({
            category: thread.forum.category,
            forum: { id: thread.forum.id, name: thread.forum.name },
            thread: { id: thread.id, subject: thread.subject, author: thread.author, created_at: thread.dataValues.created_at },
            posts: result.rows,
            total: result.count
          });
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