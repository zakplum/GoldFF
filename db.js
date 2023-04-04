const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/goldsmithsFF';

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;