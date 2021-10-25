const {Pool} = require('pg');

// https://node-postgres.com/features/connecting
const db = new Pool({
  user: "jacob",
  host: "localhost",
  database: 'bookstore',
  password: "password",
  port: 5434
});

// connect node to pg db
db.connect();

module.exports = {
  db
}