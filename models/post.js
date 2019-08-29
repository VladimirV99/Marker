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
          args: [1, 300],
          msg: 'Post content must be between 1 and 300 characters long'
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
    Post.belongsTo(models.user, { as: 'author' });
  };

  Post.createPost = (newPost, thread, user) => {
    return new Promise((resolve, reject) => {
      if(!newPost) {
        reject({ status: 400, message: 'You must provide a post' });
      } else if(!thread) {
        reject({ status: 400, message: 'You must provide a thread' });
      } else if(!user) {
        reject({ status: 400, message: 'You must provide a user' });
      } else if(!newPost.content) {
        reject({ status: 400, message: 'You must provide post content' });
      } else {
        const { user:User } = sequelize.models;
  
        Post.create(newPost).then(post => {
          post.setAuthor(user).then(() => {
            thread.addPost(post).then(() => {
              thread.post_count = thread.post_count + 1;
              thread.save().then(() => {
                Post.findOne({ where: { id: post.id }, include: [{ model: User, as: 'author' }] }).then(post => {
                  resolve(post);
                });
              });
            });
          }).catch(err => {
            reject({ status: 500, message: 'Something went wrong' });
          });;
        }).catch(err => {
          reject({ status: 400, message: err.errors[0].message });
        });
      }
    });
  }

  return Post;
}

module.exports = PostModel;