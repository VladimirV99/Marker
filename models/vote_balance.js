const VoteBalanceModel = (sequelize, DataTypes) => {
  let VoteBalance = sequelize.define('votebalance', {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    underscored: true,
    timestamps: false
  });

  VoteBalance.associate = (models) => {
    VoteBalance.belongsTo(models.post, { onDelete: 'CASCADE' });
  };

  return VoteBalance;
}

module.exports = VoteBalanceModel;