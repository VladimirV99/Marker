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
  }

  Thread.createThread = (subject, content, forum_id, user) => {
    return new Promise((resolve, reject) => {
      if(!subject) {
        reject({ status: 400, message: 'You must provide a subject' });
      } else if(!content) {
        reject({ status: 400, message: 'You must provide post content' });
      } else if(!forum_id) {
        reject({ status: 400, message: 'You must provide a forum' });
      } else {
        const { forum:Forum, post:Post } = sequelize.models;
        Forum.findByPk(forum_id).then(forum => {
          if(!forum) {
            reject({ status: 404, message: 'Forum not found' });
          } else {
            let newThread = {
              subject,
              content
            };
            Thread.create(newThread).then(thread => {
              thread.setAuthor(user).then(() => {
                thread.setForum(forum).then(() => {
                  forum.thread_count += 1;
                  forum.save().then(() => {
                    let newPost = {
                      content: newThread.content,
                      is_main: true
                    };
                    Post.createPost(newPost, thread, user).then(post => {
                      resolve({ thread, posts: [post] });
                    }).catch(err => {
                      reject(err);
                    });
                  });
                });
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
    });
  }

  Thread.rename = (id, newName, user) => {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject({ status: 400, message: 'You must provide the thread id' });
      } else if(!newName) {
        reject({ status: 400, message: 'You must provide the thread subject' });
      } else {
        Thread.findByPk(id).then(thread => {
          if(!thread) {
            reject({ status: 404, message: 'Thread not found' });
          } else {
            if(thread.author_id == user.id || user.is_moderator) {
              thread.subject = newName;
              thread.save().then(() => {
                resolve({ message: 'Thread renamed' });
              }).catch(err => {
                reject({ status: 500, message: 'Something went wrong' });
              });
            } else {
              reject({ status: 401, message: 'Unauthorized' });
            }
          }
        }).catch(err => {
          reject({ status: 500, message: 'Something went wrong' });
        });
      }
    });
  }

  Thread.delete = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject({ status: 400, message: 'You must provide the thread id' });
      } else {
        Thread.findByPk(id, { include: [{ model: Forum }] }).then(thread => {
          if(!thread) {
            reject({ status: 404, message: 'Thread not found' });
          } else {
            if(thread.author_id == user.id || user.is_moderator) {
              thread.forum.thread_count -= 1;
              thread.forum.save().then(() => {
                thread.destroy().then(() => {
                  resolve({ message: 'Thread deleted' });
                }).catch(err => {
                  reject({ status: 500, message: 'Something went wrong' });
                });
              });
            } else {
              reject({ status: 401, message: 'Unauthorized' });
            }
          }
        }).catch(err => {
          reject({ status: 500, message: 'Something went wrong' });
        });
      }
    });
  }

  return Thread;
}

module.exports = ThreadModel;