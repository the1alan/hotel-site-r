const { MongoClient } = require('mongodb');
var data = require('./data.js').data;

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'undefined2026';

async function main() {
  // Подключение к серверу MongoDB
  await client.connect();
  console.log('Подключение к базе данных MongoDB установлено');
  
  const db = client.db(dbName);
  const collection = db.collection('rooms');
  
  // Вставка данных из data.js
  const insertResult = await collection.insertMany(data);
  console.log('Inserted documents =>', insertResult);
  
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
