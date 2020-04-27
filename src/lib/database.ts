import mongodb = require("mongodb");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "balbasbot";

// Create a new MongoClient
const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
console.log(`Connected successfully to server for db ${dbName}`);
let db;

export function init() {
  client.connect(function (err) {
    db = client.db(dbName);
  });
}

export function run(collectionName, fn) {
  const collection = db.collection(collectionName);
  const result = fn(db, collection);
  return result;
}
