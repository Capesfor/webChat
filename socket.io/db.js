const { MongoClient } = require('mongodb');


async function connectionToDb()  {
    // or as an es module:
    // import { MongoClient } from 'mongodb'
    
    // Connection URL
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    
    // Database Name
    const dbName = 'my_irc';
    
    let conn;
    try {
      conn = await client.connect();
    } catch(e) {
      console.error(e);
    }
    
    return conn.db(dbName);
    
}

module.exports = { connectionToDb };