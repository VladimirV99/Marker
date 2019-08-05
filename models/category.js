const Category = (sequelize, types) => {
  return sequelize.define('category', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: types.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: false,
    underscored: true
  });
}

module.exports = Category;