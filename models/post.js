const { encodePost } = require("../util/encoder");

const PostModel = (sequelize, DataTypes) => {
  let Post = sequelize.define('post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Post content can\'t be empty'
        },
        len: {
          args: [1, 600],
          msg: 'Post content must be between 1 and 600 characters long'
        }
      }
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    underscored: true
  });

  Post.associate = (models) => {
    Post.belongsTo(models.thread, { onDelete: 'CASCADE' });
    Post.belongsTo(models.user, { as: 'author' });
    Post.belongsToMany(models.user, { as: 'votes', through: models.vote });
    Post.hasOne(models.votebalance, { foreignKey: { allowNull: false, primaryKey: true } });
  };

  Post.createPost = (content, thread_id, user, is_main=false) => {
    return new Promise((resolve, reject) => {
      if(!content) {
        reject({ status: 400, message: 'You must provide post content' });
      } else if(!thread_id) {
        reject({ status: 400, message: 'You must provide a thread' });
      } else if(!user) {
        reject({ status: 401, message: 'Unauthorized' });
      } else {
        const { thread:Thread, user:User } = sequelize.models;
        Thread.findByPk(thread_id).then(thread => {
          if(!thread) {
            reject({ status: 404, message: 'Thread not found' });
          } else {
            let newPost = {
              content: encodePost(content),
              is_main
            };
            Post.create(newPost).then(post => {
              post.setAuthor(user).then(() => {
                post.createVotebalance().then(() => {
                  thread.addPost(post).then(() => {
                    thread.post_count += 1;
                    thread.save().then(() => {
                      Post.findOne({ where: { id: post.id }, include: [{ model: User, as: 'author' }] }).then(post => {
                        resolve(post);
                      });
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

  Post.delete = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject({ status: 400, message: 'You must provide the post id' });
      } else {
        const { user:User, thread:Thread, forum:Forum } = sequelize.models;
        Post.findByPk(id, {
          attributes: [ 'id', 'is_main' ],
          include: [
            { model: User, attributes: ['id'], as: 'author' },
            { model: Thread, attributes: ['id'], include: { model: Forum, attributes: ['id'] } }
          ]
        }).then(post => {
          if(!post) {
            reject({ status: 404, message: 'Post not found' });
          } else {
            if((post.author.id == user.id) || user.is_moderator) {
              if(!post.is_main) {
                post.thread.post_count -= 1;
                post.thread.save().then(() => {
                  post.destroy().then(() => {
                    resolve({ message: 'Post deleted' });
                  }).catch(err => {
                    reject({ status: 500, message: 'Something went wrong' });
                  });
                }).catch(err => {
                  reject({ status: 500, message: 'Something went wrong' });
                });
              } else {
                post.thread.forum.thread_count -= 1;
                post.thread.forum.save().then(() => {
                  post.thread.destroy().then(() => {
                    resolve({ message: 'Thread deleted' });
                  }).catch(err => {
                    reject({ status: 500, message: 'Something went wrong' });
                  });
                }).catch(err => {
                  reject({ status: 500, message: 'Something went wrong' });
                });
              }
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

  Post.upvote = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject({ status: 400, message: 'You must provide the post id' });
      } else {
        const { votebalance:VoteBalance, vote:Vote } = sequelize.models;
        Post.findByPk(id, {include: VoteBalance}).then(post => {
          if(!post) {
            reject({ status: 404, message: 'Post not found' });
          } else {
            if(post.authorId != user.id) {
              Vote.findOne({ where: { user_id: user.id, post_id:post.id } }).then(vote => {
                if(!vote) {
                  Vote.create({ userId: user.id, postId:post.id, type: 1 }).then(vote => {
                    post.votebalance.balance += 1;
                    post.votebalance.save().then(() => {
                      resolve({
                        id: post.id,
                        balance: post.votebalance.balance,
                        upvoted: true,
                        user_id: user.id,
                        message: 'Upvoted post'
                      });
                    });
                  });
                } else {
                  if(vote.type != 1) {
                    let diff = 1 - vote.type;
                    vote.type = 1;
                    vote.save().then(() => {
                      post.votebalance.balance += diff;
                      post.votebalance.save().then(() => {
                        resolve({
                          id: post.id,
                          balance: post.votebalance.balance,
                          upvoted: true,
                          user_id: user.id,
                          message: 'Upvoted post'
                        });
                      });
                    });
                  } else {
                    vote.destroy().then(() => {
                      post.votebalance.balance -= 1;
                      post.votebalance.save().then(() => {
                        resolve({
                          id: post.id,
                          balance: post.votebalance.balance,
                          upvoted: false,
                          user_id: user.id,
                          message: 'Upvote removed'
                        });
                      });
                    });
                  }
                }
              }).catch(err => {
                reject({ status: 500, message: 'Something went wrong' });
              });
            } else {
              reject({ status: 401, message: 'You can\'t upvote your own post' });
            }
          }
        }).catch(err => {
          reject({ status: 500, message: 'Something went wrong' });
        });
      }
    });
  }

  Post.downvote = (id, user) => {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject({ status: 400, message: 'You must provide the post id' });
      } else {
        const { votebalance:VoteBalance, vote:Vote } = sequelize.models;
        Post.findByPk(id, {include: VoteBalance}).then(post => {
          if(!post) {
            reject({ status: 404, message: 'Post not found' });
          } else {
            if(post.authorId != user.id) {
              Vote.findOne({ where: { user_id: user.id, post_id:post.id } }).then(vote => {
                if(!vote) {
                  Vote.create({ userId: user.id, postId:post.id, type: -1 }).then(vote => {
                    post.votebalance.balance -= 1;
                    post.votebalance.save().then(() => {
                      resolve({
                        id: post.id,
                        balance: post.votebalance.balance,
                        downvoted: true,
                        user_id: user.id,
                        message: 'Downvoted post'
                      });
                    });
                  });
                } else {
                  if(vote.type != -1) {
                    let diff = -1 - vote.type;
                    vote.type = -1;
                    vote.save().then(() => {
                      post.votebalance.balance += diff;
                      post.votebalance.save().then(() => {
                        resolve({
                          id: post.id,
                          balance: post.votebalance.balance,
                          downvoted: true,
                          user_id: user.id,
                          message: 'Downvoted post'
                        });
                      });
                    });
                  } else {
                    vote.destroy().then(() => {
                      post.votebalance.balance += 1;
                      post.votebalance.save().then(() => {
                        resolve({
                          id: post.id,
                          balance: post.votebalance.balance,
                          downvoted: false,
                          user_id: user.id,
                          message: 'Downvote removed'
                        });
                      });
                    });
                  }
                }
              }).catch(err => {
                reject({ status: 500, message: 'Something went wrong' });
              });
            } else {
              reject({ status: 401, message: 'You can\'t downvote your own post' });
            }
          }
        }).catch(err => {
          reject({ status: 500, message: 'Something went wrong' });
        });
      }
    });
  }

  return Post;
}

module.exports = PostModel;