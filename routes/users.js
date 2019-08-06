const express = require('express');
const router = express.Router();
const passport = require('passport');
const Sequelize = require('sequelize');
const { db, User } = require('../config/database');
const Op = Sequelize.Op;

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

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Access granted' });
});

module.exports = router;