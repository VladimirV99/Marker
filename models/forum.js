const { deleteCache } = require('../config/redis');

const ForumModel = (sequelize, DataTypes) => {
  let Forum = sequelize.define('forum', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Forum name can\'t be empty'
        },
        len: {
          args: [1, 50],
          msg: 'Forum name must be between 1 and 50 characters long'
        }
      }
    },
    thread_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    underscored: true
  });

  Forum.associate = (models) => {
    Forum.belongsTo(models.category, { onDelete: 'CASCADE' });
    Forum.hasMany(models.thread, { onDelete: 'CASCADE' });
  }

  Forum.createForum = (name, category_id, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        if(!name) {
          reject({ status: 400, message: 'You must provide a name' });
        } else if(!category_id) {
          reject({ status: 400, message: 'You must provide a category' });
        } else {
          const { category:Category } = sequelize.models;
          Category.findByPk(category_id).then(category => {
            if(!category) {
              reject({ status: 404, message: 'Category not found' });
            } else {
              let newForum = {
                name
              };
              Forum.create(newForum).then(forum => {
                category.addForum(forum).then(() => {
                  resolve(forum);
                  deleteCache('forums/all');
                  deleteCache(`forums/category/${category}`);
                }).catch(err => {
                  reject({ status: 500, message: 'Something went wrong' });
                });
              }).catch(err => {
                reject({ status: 400, message: err.errors[0].message });
              });
            }
          }).catch(err => {
            reject({ status: 500, message: 'Something went wrong' });
          });
        }
      }
    });
  }

  Forum.rename = (id, newName, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        if(!newName) {
          reject({ status: 400, message: 'You must provide a forum name' });
        } else {
          Forum.findByPk(id).then(forum => {
            if(!forum) {
              reject({ status: 404, message: 'Forum not found' });
            } else {
              forum.name = newName;
              forum.save().then(() => {
                resolve({ message: 'Forum renamed' });
                deleteCache('forums/all');
                deleteCache(`forums/category/${forum.categoryId}`);
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

  Forum.delete = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!user.is_moderator) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        Forum.findByPk(id).then(forum => {
          if(!forum) {
            reject({ status: 404, message: 'Forum not found' });
          } else {
            forum.destroy().then(() => {
              resolve({ message: 'Forum deleted' });
              deleteCache('forums/all');
              deleteCache(`forums/category/${forum.categoryId}`);
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

  return Forum;
}

module.exports = ForumModel;