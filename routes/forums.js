const express = require('express');
const router = express.Router();
const passport = require('passport');
const { setCache, getCache } = require('../config/redis');
const { Category, Forum, Thread, Post, User } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  Forum.createForum(req.body.name, req.body.category, req.user.model).then(forum => {
    res.status(201).json({ message: 'Forum Created', forum });
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.post('/rename/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Forum.rename(req.params.id, req.body.newName, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Forum.delete(req.params.id, req.user.model).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(err.status).json({ message: err.message });
  });
});

router.get('/category/:id', getCache('forums/category/', true), (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a category' });
  } else {
    Category.findByPk(req.params.id).then(category => {
      if(!category) {
        res.status(404).json({ message: 'Category not found' });
      } else {
        Forum.findAll({
          where: { category_id: req.params.id },
          include: [{
            model: Thread, limit: 1, order: [['id', 'DESC']], attributes: ['id', 'subject', 'updated_at', 'authorId'],
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
          }]
        }).then(forums => {
          let response = { category, forums };
          res.status(200).json(response);
          setCache('forums/category/'+req.params.id, {status: 200, response}, 60);
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.get('/get/:id/page/:page/:itemsPerPage', (req, res) => {
  let itemsPerPage = 5;
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a forum' });
  } else if(!req.params.page) {
    res.status(400).json({ message: 'You must provide a page number' });
  } else {
    Forum.findOne({ where: { id: req.params.id }, include: [{ model: Category }]}).then(forum => {
      if(!forum) {
        res.status(404).json({ message: 'Forum not found' });
      } else {
        let page = req.params.page;
        if(req.params.itemsPerPage && req.params.itemsPerPage>0 && req.params.itemsPerPage<15)
          itemsPerPage = parseInt(req.params.itemsPerPage);
        Thread.findAndCountAll({
          attributes: ['id', 'subject', 'post_count'],
          where: { forum_id: forum.id },
          offset: (page-1)*itemsPerPage, 
          limit: itemsPerPage,
          include: [
            {
              model: Post, limit: 1, order: [['id', 'DESC']], attributes: ['id', 'content', 'created_at', 'authorId'],
              include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
            },
            { model: User, as: 'author', attributes: ['id', 'username'] }
          ]
        }).then(result => {
          res.status(200).json({ category: forum.category, forum: {id: forum.id, name: forum.name}, threads: result.rows, total: result.count });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });;
  }
});

router.get('/get/:id', getCache('forums/', true), (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a forum' });
  } else {
    Forum.findOne({ where: { id: req.params.id }, include: [{ model: Category }]}).then(forum => {
      if(!forum) {
        res.status(404).json({ message: 'Forum not found' });
      } else {
        let response = { category: forum.category, forum: {id: forum.id, name: forum.name} };
        res.status(200).json(response);
        setCache('forums/'+req.params.id, {status: 200, response}, 300);
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });;
  }
});

router.get('/all', getCache('forums/all'), (req, res) => {
  Category.findAll({
    include: [{ model: Forum, include: [
      {
        model: Thread, limit: 1, order: [['id', 'DESC']], attributes: ['id', 'subject', 'updated_at', 'authorId'],
        include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
      }
    ]}
  ], order: [['id', 'ASC']] }).then(categories => {
    res.status(200).json({ categories });
    setCache('forums/all', {status: 200, response: {categories}}, 60);
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

module.exports = router;