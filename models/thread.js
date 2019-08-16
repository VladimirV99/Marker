const ThreadModel = (sequelize, DataTypes) => {
  let Thread = sequelize.define('thread', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Thread subject can\'t be empty'
        },
        len: {
          args: [1, 60],
          msg: 'Thread name must between 1 and 60 characters long'
        }
      }
    },
    post_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    underscored: true
  });

  Thread.associate = (models) => {
    Thread.belongsTo(models.forum, { onDelete: 'CASCADE' });
    Thread.belongsTo(models.user, { as: 'author' });
    Thread.hasMany(models.post, { onDelete: 'CASCADE' });
  };

  Thread.createThread = (newThread, forum, user) => {
    return new Promise((resolve, reject) => {
      if(!newThread) {
        reject({ status: 400, message: 'You must provide a thread' });
      } else if(!newThread.subject) {
        reject({ status: 400, message: 'You must provide a subject' });
      } else if(!newThread.content) {
        reject({ status: 400, message: 'You must provide post content' });
      } else if(!forum) {
        reject({ status: 400, message: 'You must provide a forum' });
      } else {
        const { post:Post } = sequelize.models;

        Thread.create(newThread).then(thread => {
          thread.setAuthor(user).then(() => {
            thread.setForum(forum).then(() => {
              let newPost = {
                content: newThread.content,
                is_main: true
              };
              Post.createPost(newPost, thread, user).then(post => {
                resolve({ thread, posts:[post] });
              }).catch(err => {
                reject(err);
              });
            });
          }).catch(err => {
            reject({ status: 500, message: 'Something went wrong' });
          });
        }).catch(err => {
          reject({ status: 400, message: err.errors[0].message });
        });
      }
    });
  };

  return Thread;
}

module.exports = ThreadModel;