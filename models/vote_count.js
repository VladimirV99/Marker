const VoteCountModel = (sequelize, DataTypes) => {
  let VoteCount = sequelize.define('vote_count', {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    underscored: true,
    timestamps: false
  });

  VoteCount.associate = (models) => {
    VoteCount.belongsTo(models.post, { onDelete: 'CASCADE' });
  };

  return VoteCount;
}

module.exports = VoteCountModel;