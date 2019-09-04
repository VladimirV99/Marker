const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const { User } = require('../config/database');

const public_path = './public/';
const photo_path = 'photos/';
const storage = multer.diskStorage({
  destination: public_path + photo_path,
  filename: function(req, file, callback) {
    callback(null, req.user.username + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024*1024 },
  fileFilter: function(req, file, callback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype) {
      callback(null, true);
    } else {
      callback('Images Only');
    }
  }
}).single('user_photo');

router.get('/checkUsername/:username', (req, res) => {
  if (!req.params.username) {
    res.status(400).json({ message: 'Username was not provided' });
  } else {
    User.findOne({ where: { username: req.params.username } }).then(user => {
      if (user) {
        res.status(400).json({ message: 'Username is already taken' });
      } else {
        res.status(200).json({ message: 'Username is available' });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.get('/checkEmail/:email', (req, res) => {
  if (!req.params.email) {
    res.status(400).json({ message: 'E-mail was not provided' });
  } else {
    User.findOne({ where: { email: req.params.email } }).then(user => {
      if (user) {
        res.status(400).json({ message: 'E-mail is already taken' });
      } else {
        res.status(200).json({ message: 'E-mail is available' });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.post('/register', (req, res) => {
  let newUser = {
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
  User.register(newUser, (err, user) => {
    if(err) {
      res.status(err.status).json({ message: err.message });
    } else {
      User.login(req.body.username, req.body.password, (err, login) => {
        if(err) {
          res.status(err.status).json({ message: err.message });
        } else {
          res.status(201).json({
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
  let username = req.body.username;
  let password = req.body.password;
  User.login(username, password, (err, login) => {
    if(err) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(200).json({
        message: "Logged in",
        token: login.token,
        user: login.user
      });
    }
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(req.user);
});

router.get('/get/:username', (req, res) => {
  if(!req.params.username) {
    res.status(400).json({ message: 'You must provide a username' });
  } else {
    User.findOne({ where: { username: req.params.username }, attributes: ['first_name', 'last_name', 'username', 'photo', 'email'] }).then(user => {
      if(!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json({ user });
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.put('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOne({ where: { id: req.user.id } }).then(user => {
    if(!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      if(req.body.first_name)
        user.first_name = req.body.first_name;
      if(req.body.last_name)
        user.last_name = req.body.last_name;
      if(req.body.email)
        user.email = req.body.email;
      user.save().then(() => {
        res.status(200).json({ message: 'Profile Updated' });
      }).catch(err => {
        res.status(400).json({ message: err.errors[0].message });
      });
    }
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

router.put('/changePassword', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if(!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      User.comparePassword(req.body.old_password, user.password, (err, isMatch) => {
        if(err) {
          res.status(err.status).json({ message: err.message });
        } else {
          if(isMatch){
            User.encryptPassword(req.body.new_password, (err, password) => {
              if(err) {
                res.status(err.status).json({ message: err.message });
              } else {
                user.password = password;
                user.save().then(() => {
                  res.status(200).json({ message: 'Password Changed'});
                }).catch(err => {
                  res.status(500).json({ message: 'Something went wrong' });
                });
              }
            });
          } else {
            return res.status(401).json({ message: 'Wrong password' });
          }
        }
      });
    }
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

router.post('/addModerator/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    User.findOne({ where: { username: req.params.username } }).then(user => {
      if(!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        user.is_moderator = true;
        user.save().then(savedUser => {
          res.status(200).json({ message: 'Added moderator privileges to user' });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        })
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.post('/removeModerator/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.user.is_moderator) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    User.findOne({ where: { username: req.params.username } }).then(user => {
      if(!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        user.is_moderator = false;
        user.save().then(savedUser => {
          res.status(200).json({ message: 'Removed moderator privileges from user' });
        }).catch(err => {
          res.status(500).json({ message: 'Something went wrong' });
        })
      }
    }).catch(err => {
      res.status(500).json({ message: 'Something went wrong' });
    });
  }
});

router.post('/uploadPhoto', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if(!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      upload(req, res, (err) => {
        if(err) {
          res.status(500).json({ message: err });
        } else {
          if(req.file == undefined){
            res.status(400).json({ message: 'No file selected' });
          } else {
            user.photo = photo_path + req.file.filename;
            user.save().then(() => {
              res.status(200).json({ message: 'Photo uploaded' });
            }).catch(err => {
              res.status(500).json({ message: 'Something went wrong' });
            });
          }
        }
      });
    }
  }).catch(err => {
    res.status(500).json({ message: 'Something went wrong' });
  });
});

module.exports = router;