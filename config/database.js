const Sequelize = require('sequelize');
const credentials = require('./credentials');

const UserModel = require('../models/user');
const CategoryModel = require('../models/category');
const ForumModel = require('../models/forum');
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
const Forum = ForumModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Thread = ThreadModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);

// TODO Move to models associate(models) class method. If exists call it
Forum.belongsTo(Category);

Thread.belongsTo(Forum);
Thread.belongsTo(User);

Thread.hasMany(Post)
Post.belongsTo(User);

// TODO Migrations
sequelize.sync().then(() => { 
  console.log('Synced Database Tables');
});
// sequelize.sync({ force: true }).then(() => { 
//   console.log('Synced Database Tables');
// });

module.exports = {
  db: sequelize,
  User,
  Category,
  Forum,
  Thread,
  Post
}