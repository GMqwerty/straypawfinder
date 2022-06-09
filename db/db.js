const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('CREATE TABLE IF NOT EXISTS"strays" ("id" TEXT NOT NULL,"name" TEXT NOT NULL, "age" INTEGER NOT NULL,"desc" TEXT NOT NULL, "image" TEXT NOT NULL, PRIMARY KEY("id"))')

module.exports.client = client