const Post = (sequelize, types) => {
  return sequelize.define('post', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: types.STRING,
      allowNull: false
    },
    content: {
      type: types.TEXT
    }
  }, {
    underscored: true
  });
}

module.exports = Post;