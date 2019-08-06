const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const credentials = require('../config/credentials');

// const minLengthValidator = (value) => {
//   if(value.length < 5)
//     throw new Error('Name must be at least 5 characters long');
// }

const User = (sequelize, types) => {
  let model = sequelize.define('user', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: types.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    first_name: {
      type: types.STRING,
      validate: {
        isAlphanumeric: true,
        len: {
          args: [5, 30],
          msg: 'First name must between 5 and 30 characters long'
        }
      }
    },
    last_name: {
      type: types.STRING,
      validate: {
        isAlphanumeric: true,
        len: {
          args: [5, 30],
          msg: 'Last name must between 5 and 30 characters long'
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
    }
  }, {
    underscored: true
  });

  model.register = (newUser, callback) => {
    if(!newUser.email) {
      callback({ status: 200, message: 'You must provide an email' });
    } else if(!newUser.password) {
      callback({ status: 200, message: 'You must provide a password' });
    } else {
      // TODO Validate password
      bcrypt.genSalt(10, (err, salt) => {
        if(err) {
          callback({ status: 500, message: err.message });
        } else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
              callback({ status: 500, message: err.message });
            } else {
              newUser.password = hash;
              model.create(newUser).then((user) => {
                callback(null, user);
              });
            }
          });
        }
      });
    }
  };

  model.login = (email, password, callback) => {
    if(!email) {
      callback({ status: 200, message: 'You must provide an email' });
    } else if(!password) {
      callback({ status: 200, message: 'You must provide a password' });
    } else {
      model.findOne({ where: { email: email } }).then((user) => {
        if(!user) {
          callback({ status: 200, message: 'User not found' });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) {
              callback({ status: 500, message: 'Something went wrong' });
            } else {
              if(isMatch){
                const token = jwt.sign({ user_id: user.id }, credentials.passport_secret, {
                  expiresIn: 604800 // 1 week
                });
                callback(null, {
                  token: 'bearer ' + token,
                  user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    photo: user.photo
                  }
                });
              } else {
                callback({ status: 200, message: 'Wrong password' });
              }
            }
          });
        }
      });
    }
  };

  return model;
}

module.exports = User;