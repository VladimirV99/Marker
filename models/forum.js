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
        len: {
          args: [1, 30],
          msg: 'Forum name must between 1 and 30 characters long'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });

  Forum.associate = (models) => {
    Forum.belongsTo(models.category);
  };

  Forum.createForum = (newForum, category) => {
    return new Promise((resolve, reject) => {
      if(!newForum) {
        reject({ status: 400, message: 'You must provide a forum' });
      } else if(!newForum.name) {
        reject({ status: 400, message: 'You must provide a name' });
      } else if(!category) {
        reject({ status: 400, message: 'You must provide a category' });
      } else {
        Forum.create(newForum).then(forum => {
          Forum.setCategory(category).then(() => {
            resolve(forum);
          });
        }).catch(err => {
          reject({ status: 400, message: err.errors[0].message });
        });
      }
    });
  };

  return Forum;
}

module.exports = ForumModel;