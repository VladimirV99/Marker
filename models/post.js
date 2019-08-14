const Post = (sequelize, types) => {
  return sequelize.define('post', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: types.TEXT,
      allowNull: false
    }
  }, {
    underscored: true
  });
}

module.exports = Post;