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

const UserModel = (sequelize, DataTypes) => {
  let User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This username is already taken'
      },
      validate: {
        notNull: {
          msg: 'Username can\'t be empty'
        },
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name can\'t be empty'
        },
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name can\'t be empty'
        },
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
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'User with this email already exists'
      },
      validate: {
        notNull: {
          msg: 'Email can\'t be empty'
        },
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: 'photos/no_photo.png'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password can\'t be empty'
        },
      }
    },
    is_moderator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    underscored: true
  });

  User.comparePassword = (candidatePassword, currentHash, callback) => {
    bcrypt.compare(candidatePassword, currentHash, (err, isMatch) => {
      if(err) {
        callback({ status: 500, message: 'Something went wrong' });
      } else {
        callback(null, isMatch);
      }
    });
  };

  User.encryptPassword = (password, callback) => {
    for(let i = 0; i < passwordValidators.length; i++){
      if(!passwordValidators[i].validator(password)){
        callback({ status: 400, message: passwordValidators[i].message });
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

  User.register = (newUser, callback) => {
    if(!newUser.email) {
      callback({ status: 400, message: 'You must provide an email' });
    } else if(!newUser.password) {
      callback({ status: 400, message: 'You must provide a password' });
    } else {
      User.encryptPassword(newUser.password, (err, password) => {
        if(err) {
          callback(err);
        } else {
          newUser.password = password;
          User.create(newUser).then(user => {
            callback(null, user);
          }).catch(err => {
            callback({ status: 400, message: err.errors[0].message });
          });
        }
      });
    }
  };

  User.login = (username, password, callback) => {
    if(!username) {
      callback({ status: 400, message: 'You must provide a username' });
    } else if(!password) {
      callback({ status: 400, message: 'You must provide a password' });
    } else {
      User.findOne({ where: { username: username } }).then((user) => {
        if(!user) {
          callback({ status: 404, message: 'User not found' });
        } else {
          User.comparePassword(password, user.password, (err, isMatch) => {
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
                callback({ status: 401, message: 'Wrong password' });
              }
            }
          });
        }
      }).catch(err => {
        callback({ status: 500, message: 'Something went wrong' });
      });
    }
  };

  return User;
}

module.exports = UserModel;