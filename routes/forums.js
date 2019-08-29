const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Category, Forum, Thread, Post, User } = require('../config/database');

router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    if(!req.body.name) {
      res.status(400).json({ message: 'You must provide a forum name' });
    } else if(!req.body.category) {
      res.status(400).json({ message: 'You must provide a category' });
    } else {
      Category.findByPk(req.body.category).then(category => {
        if(!category) {
          res.status(404).json({ message: 'Category not found' });
        } else {
          let newForum = {
            name: req.body.name
          };
          Forum.createForum(newForum, category).then(forum => {
            res.status(201).json({ message: 'Forum Created', forum });
          }).catch(err => {
            res.status(err.status).json({ message: err.message });
          });
        }
      }).catch(err => {
        res.status(500).json({ message: 'Something went wrong' });
      });
    }
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    Forum.findByPk(req.params.id).then(forum => {
      if(!forum) {
        res.status(404).json({ message: 'Forum not found' });
      } else {
        forum.destroy().then(() => {
          res.status(200).json({ message: 'Forum deleted' });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong '});
        });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong '});
    });
  }
});

router.get('/category/:id', (req, res) => {
  if(!req.params.id) {
    res.status(400).json({ message: 'You must provide a category' });
  } else {
    Category.findByPk(req.params.id).then(category => {
      if(!category) {
        res.status(404).json({ message: 'Category not found' });
      } else {
        Forum.findAll({ where: { category_id: req.params.id } }).then(forums => {
          res.status(200).json({ forums });
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
              model: Post, limit: 1, order: [['id', 'DESC']], attributes: ['id', 'content', 'created_at'],
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

router.get('/all', (req, res) => {
  Category.findAll({ include: [
    { model: Forum, include: [
      {
        model: Thread, limit: 1, order: [['id', 'DESC']], attributes: ['id', 'subject', 'updated_at'],
        include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
      }
    ]}
  ], order: [['id', 'ASC']] }).then(categories => {
    res.status(200).json({ categories });
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

module.exports = router;