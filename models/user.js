const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const credentials = require('../config/credentials');

let passwordLengthChecker = (password) => {
  if (!password || password.length < 8 || password.length > 35)
    return false;
  return true;
};

let passwordValidityChecker = (password) => {
  if (!password)
    return false;
  const passwordRegExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{0,}$/i);
  return passwordRegExp.test(password);
};

const passwordValidators = [
  {
    validator: passwordLengthChecker,
    message: 'Password must between 8 and 35 characters long'
  },
  {
    validator: passwordValidityChecker,
    message: 'Password must have at least one uppercase, lowercase and special character, and a number'
  }
];

const User = (sequelize, types) => {
  let model = sequelize.define('user', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: types.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This username is already taken'
      },
      validate: {
        len: {
          args: [3, 15],
          msg: 'First name must between 3 and 15 characters long'
        },
        isAlphanumeric: {
          msg: 'First name can\'t contain special characters'
        }
      }
    },
    first_name: {
      type: types.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 30],
          msg: 'First name must between 1 and 30 characters long'
        },
        isAlphanumeric: {
          msg: 'First name can\'t contain special characters'
        }
      }
    },
    last_name: {
      type: types.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 30],
          msg: 'Last name must between 1 and 30 characters long'
        },
        isAlphanumeric: {
          msg: 'Last name can\'t contain special characters'
        }
      }
    },
    email: {
      type: types.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'User with this email already exists'
      },
      validate: {
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    photo: {
      type: types.STRING,
      defaultValue: 'photos/no_photo.png'
    },
    password: {
      type: types.STRING,
      allowNull: false
    },
    is_moderator: {
      type: types.BOOLEAN,
      defaultValue: false
    }
  }, {
    underscored: true
  });

  model.comparePassword = (candidatePassword, currentHash, callback) => {
    bcrypt.compare(candidatePassword, currentHash, (err, isMatch) => {
      if(err) {
        callback({ status: 500, message: 'Something went wrong' });
      } else {
        callback(null, isMatch);
      }
    });
  };

  model.encryptPassword = (password, callback) => {
    for(let i = 0; i < passwordValidators.length; i++){
      if(!passwordValidators[i].validator(password)){
        callback({ status: 200, message: passwordValidators[i].message });
        return;
      }
    }
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        callback({ status: 500, message: 'Something went wrong' });
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if(err) {
            callback({ status: 500, message: 'Something went wrong' });
          } else {
            callback(null, hash);
          }
        });
      }
    });
  }

  model.register = (newUser, callback) => {
    if(!newUser.email) {
      callback({ status: 200, message: 'You must provide an email' });
    } else if(!newUser.password) {
      callback({ status: 200, message: 'You must provide a password' });
    } else {
      model.encryptPassword(newUser.password, (err, password) => {
        if(err) {
          callback(err);
        } else {
          newUser.password = password;
          model.create(newUser).then(user => {
            callback(null, user);
          }).catch(err => {
            callback({ status: 200, message: err.errors[0].message });
          });
        }
      });
    }
  };

  model.login = (username, password, callback) => {
    if(!username) {
      callback({ status: 200, message: 'You must provide a username' });
    } else if(!password) {
      callback({ status: 200, message: 'You must provide a password' });
    } else {
      model.findOne({ where: { username: username } }).then((user) => {
        if(!user) {
          callback({ status: 200, message: 'User not found' });
        } else {
          model.comparePassword(password, user.password, (err, isMatch) => {
            if(err) {
              callback(err);
            } else {
              if(isMatch){
                const token = jwt.sign({ user_id: user.id }, credentials.passport_secret, {
                  expiresIn: 604800 // 1 week
                });
                callback(null, {
                  token: 'bearer ' + token,
                  user: {
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    photo: user.photo,
                    is_moderator: user.is_moderator
                  }
                });
              } else {
                callback({ status: 200, message: 'Wrong password' });
              }
            }
          });
        }
      }).catch(err => {
        callback({ status: 500, message: 'Something went wrong' });
      });
    }
  };

  return model;
}

module.exports = User;