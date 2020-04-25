const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "balbasbot";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
console.log(`Connected successfully to server for db ${dbName}`);
let db;

function init() {
  client.connect(function (err) {
    assert.equal(null, err);
    db = client.db(dbName);
  });
}
exports.init = init;

function run(collectionName, fn) {
  const collection = db.collection(collectionName);
  const result = fn(db, collection);
  return result;
}
exports.run = run;
