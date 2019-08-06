const Sequelize = require('sequelize');
const credentials = require('./credentials');

const UserModel = require('../models/user');
const CategoryModel = require('../models/category');
const ThreadModel = require('../models/thread');
const PostModel = require('../models/post');

const sequelize = new Sequelize(credentials.db_name, credentials.db_user, credentials.db_password, {
  host: credentials.db_host,
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

// TODO Move to models associate(models) class method. If exists call it
Thread.belongsTo(Category);
Thread.belongsTo(User);

Post.belongsTo(Thread);
Post.belongsTo(User);

// TODO Migrations
// sequelize.sync({ force: true }).then(() => { 
//   console.log('Synced Database Tables');
// });

module.exports = {
  db: sequelize,
  User,
  Category,
  Thread,
  Post
}