const Category = (sequelize, types) => {
  return sequelize.define('category', {
    id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: types.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'A category with this name already exists'
      },
      validate: {
        len: {
          args: [1, 20],
          msg: 'Category name must between 1 and 20 characters long'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });
}

module.exports = Category;