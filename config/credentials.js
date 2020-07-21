module.exports = {
  db_host: process.env.HOST || 'localhost',
  db_name: process.env.DB_NAME || 'marker',
  db_user: process.env.DB_USER || 'root',
  db_password: process.env.DB_PASSWORD || 'marker',
  passport_secret: process.env.PASSPORT_SECRET || 'marker'
}