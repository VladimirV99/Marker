const VoteModel = (sequelize, DataTypes) => {
  let Vote = sequelize.define('vote', {
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[-1, 1]],
          msg: 'Invalid vote'
        }
      }
    }
  }, {
    underscored: true
  });

  return Vote;
}

module.exports = VoteModel;