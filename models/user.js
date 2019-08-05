// const minLengthValidator = (value) => {
//   if(value.length < 5)
//     throw new Error('Name must be at least 5 characters long');
// }

const User = (sequelize, types) => {
  return sequelize.define('user', {
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
}

module.exports = User;