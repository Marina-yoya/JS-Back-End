// Demo, done without additional libraries
// like mongoose for educational purposes.

const { MongoClient } = require('mongodb'),
  connectionString = 'mongodb://localhost:27017';

const client = new MongoClient(connectionString, {
  // Warning: Current Server Discovery and Monitoring engine
  // is deprecated, and will be removed in a future version.
  // To use the new Server Discover and Monitoring engine,
  // pass option { useUnifiedTopology: true } in the constructor.
  useUnifiedTopology: true,
});

// initialize
client.connect(async (err) => {
  // Can works with promises
  if (err !== null) {
    console.log(`Error >>> ${err}`);
    return;
  }

  console.log('Database connected...');

  																	                 // CLI Variant:
  const db = client.db('demoDB'); 					         // use DemoDB
  const collection = db.collection('users'); 		     // db.getCollection('users')
  await collection.insertOne({ John: 'Doe' }); 		   // db.collection.insertOne({ John: 'Doe' })
  const data = await collection.find({}).toArray();  // db.users.find({}) (all)
  // returns Cursor (not iterable)

  console.log(data);
});
