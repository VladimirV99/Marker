const { deleteCache } = require('../config/redis');

const CategoryModel = (sequelize, DataTypes) => {
  let Category = sequelize.define('category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'A category with this name already exists'
      },
      validate: {
        notNull: {
          msg: 'Category name can\'t be empty'
        },
        len: {
          args: [1, 20],
          msg: 'Category name must be between 1 and 20 characters long'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.forum, { onDelete: 'CASCADE' });
  }

  Category.createCategory = (name, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        if(!name) {
          reject({ status: 400, message: 'You must provide a category name' });
        } else {
          let newCategory = {
            name
          };
          Category.create(newCategory).then(category => {
            resolve(category);
            deleteCache('categories/all');
            deleteCache('forums/all');
          }).catch(err => {
            reject({ status: 400, message: err.errors[0].message });
          });
        }
      }
    });
  }

  Category.rename = (id, newName, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        if(!newName) {
          res.status(400).json({ message: 'You must provide a category name' });
        } else {
          Category.findByPk(id).then(category => {
            if(!category) {
              reject({ status: 404, message: 'Category not found' });
            } else {
              category.name = newName;
              category.save().then(() => {
                resolve({ message: 'Category renamed' });
                deleteCache('categories/all');
                deleteCache('forums/all');
                deleteCache(`forums/category/${id}`);
              }).catch(err => {
                reject({ status: 500, message: 'Something went wrong '});
              });
            }
          }).catch(err => {
            reject({ status: 500, message: 'Something went wrong '});
          });
        }
      }
    });
  }

  Category.delete = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        Category.findByPk(id).then(category => {
          if(!category) {
            reject({ status: 404, message: 'Category not found' });
          } else {
            category.destroy().then(() => {
              resolve({ message: 'Category deleted' });
              deleteCache('categories/all');
              deleteCache('forums/all');
              deleteCache(`forums/category/${id}`);
            }).catch(err => {
              reject({ status: 500, message: 'Something went wrong '});
            });
          }
        }).catch(err => {
          reject({ status: 500, message: 'Something went wrong '});
        });
      }
    });
  }

  return Category;
}

module.exports = CategoryModel;