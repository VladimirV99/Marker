const Forum = (sequelize, types) => {
  return sequelize.define('forum', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: types.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 30],
          msg: 'Forum name must between 1 and 30 characters long'
        }
      }
    }
  }, {
    underscored: true
  });
}

module.exports = Forum;