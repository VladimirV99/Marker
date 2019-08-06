const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { User } = require('../config/database');
const Op = Sequelize.Op;

router.get('/checkEmail/:email', (req, res) => {
  if (!req.params.email) {
    res.status(400).json({ success: false, message: 'E-mail was not provided' });
  } else {
    User.findOne({ where: { email: req.params.email } }).then(user => {
      if (user) {
        res.status(200).json({ success: false, message: 'E-mail is already taken' });
      } else {
        res.status(200).json({ success: true, message: 'E-mail is available' });
      }
    }).catch(err => {
      res.status(500).json({ success: false, message: 'Something went wrong' });
    });
  }
});

router.post('/register', (req, res) => {
  let newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
  User.register(newUser, (err, user) => {
    if(err) {
      res.status(err.status).json({ success: false, message: err.message });
    } else {
      User.login(req.body.email, req.body.password, (err, login) => {
        if(err) {
          res.status(err.status).json({success: false, message: err.message});
        } else {
          res.status(201).json({
            success: true,
            message: "Registered",
            token: login.token,
            user: login.user
          });
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.login(email, password, (err, login) => {
    if(err) {
      res.status(err.status).json({ success: false, message: err.message });
    } else {
      res.status(200).json({
        success: true,
        message: "Logged in",
        token: login.token,
        user: login.user
      });
    }
  });
});

router.put('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOne({ where: { id: req.user.id } }).then(user => {
    if(!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.save().then(() => {
        res.status(200).json({ success: true, message: 'Profile Updated' });
      }).catch(err => {
        res.status(200).json({ success: false, message: err.errors[0].message });
      });
    }
  }).catch(err => {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  });
});

router.put('/changePassword', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if(!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      User.comparePassword(req.body.old_password, user.password, (err, isMatch) => {
        if(err) {
          res.status(err.status).json({ success: false, message: err.message });
        } else {
          if(isMatch){
            User.encryptPassword(req.body.new_password, (err, password) => {
              if(err) {
                res.status(err.status).json({ success: false, message: err.message });
              } else {
                user.password = password;
                user.save().then(() => {
                  res.status(200).json({ success: true, message: 'Password Changed'});
                }).catch(err => {
                  res.status(500).json({ success: false, message: 'Something went wrong' });
                });
              }
            });
          } else {
            return res.status(200).json({success: false, message: 'Wrong password'});
          }
        }
      });
    }
  }).catch(err => {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  });
});

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.user);
  res.json({ message: 'Access granted' });
});

module.exports = router;