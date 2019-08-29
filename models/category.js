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
        notNull: {
          msg: 'Category name can\'t be empty'
        },
        len: {
          args: [1, 20],
          msg: 'Category name must be between 1 and 20 characters long'
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.forum, { onDelete: 'CASCADE' });
  };

  return Category;
}

module.exports = CategoryModel;