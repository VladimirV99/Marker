const CategoryModel = (sequelize, DataTypes) => {
  let Category = sequelize.define('category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
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

  return Category;
}

module.exports = CategoryModel;