const Thread = (sequelize, types) => {
  return sequelize.define('thread', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: types.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: 'Thread name must between 1 and 60 characters long'
        }
      }
    }
  }, {
    underscored: true
  });
}

module.exports = Thread;