const Thread = (sequelize, types) => {
  return sequelize.define('thread', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: types.TEXT,
      allowNull: false
    }
  }, {
    underscored: true
  });
}

module.exports = Thread;