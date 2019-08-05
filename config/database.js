const Sequelize = require('sequelize');

const UserModel = require('../models/user');
const CategoryModel = require('../models/category');
const ThreadModel = require('../models/thread');
const PostModel = require('../models/post');

const sequelize = new Sequelize('marker', 'root', 'marker', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const User = UserModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Thread = ThreadModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);

Thread.belongsTo(Category);
Thread.belongsTo(User);

Post.belongsTo(Thread);
Post.belongsTo(User);

sequelize.sync({ force: true }).then(() => { // TODO Migrations
  console.log('Synced Database Tables');
});

module.exports = {
  db: sequelize,
  User,
  Category,
  Thread,
  Post
}