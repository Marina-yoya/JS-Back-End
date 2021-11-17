// Mongoose - ODM (Object document model),
// the Node.JS variant of ORM (Object relational mapper).

const mongoose = require('mongoose'),
  connectionString = 'mongodb://localhost:27017/demoDB';

// init
(async () => {
  const client = await mongoose.connect(connectionString, {
    // DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser,
    // pass option { useNewUrlParser: true } to MongoClient.connect.
    useNewUrlParser: true, // mongoose
    // Warning: Current Server Discovery and Monitoring engine
    // is deprecated, and will be removed in a future version.
    // To use the new Server Discover and Monitoring engine,
    // pass option { useUnifiedTopology: true } in the constructor.
    useUnifiedTopology: true, // mongodb driver
  });

  console.log('Database connected...');

  // Simple schema example
  const userSchemaSimple = new mongoose.Schema({
    age: Number,
    name: String,
    gender: String,
  });

  // Set the model for the collection 'users'
  const User = mongoose.model('User', userSchemaSimple);

  const user = new User({
    age: '25', // With string, the value will be converted to number automatically.
    age: 25,
    name: 25, // With number, the value will be converted to string automatically.
    name: 'Isabella',
    gender: 'male', // With duplicated keys, the last value is taken and no exception is present.
    gender: 'female',
    address: 'female', // With invalid key, the tuple won't appear in the record and there will be no exception.
  });

  await user.save();
  const data = await User.find({});

  // Strict schema example
  const userSchemaStrict = new mongoose.Schema({
    age: { type: Number, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    workerID: { type: Number, required: true, unique: true },
    // Expect exceptions for mismatch but not for additional tuples!
    // Unique Index is required to be configured for the unique values!!!
  });

  // Schema with methods example
  const userSchemaMethods = new mongoose.Schema({
    age: Number,
    firstName: String,
    lastName: String,
  });

  // Methods need to be declared before creating the model!
  // Reminder: Don't not use arrow function as they retain
  // the 'this' of the surrounding execution context.
  userSchemaMethods.methods.sayHi = function () {
    return `My name is ${this.firstName} ${this.lastName} and I'm ${this.age} old.`;
  };

  // The same way as with the methods, there can be the so
  // called 'virtual properties' used as getters and setters.
  // Reminder: Don't not use arrow function as they retain
  // the 'this' of the surrounding execution context.
  userSchemaMethods.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

  const Person = mongoose.model('Person', userSchemaMethods);

  const person1 = new Person({
    age: 25,
    firstName: 'John',
    lastName: 'Smith',
  });

  const person2 = new Person({
    age: 30,
    firstName: 'Peter',
    lastName: 'Peterson',
  });

  Promise.all([person1.save(), person2.save()]);
  const people = await Person.find({});

  people.forEach((p) => console.log(p.sayHi())); // The method
  people.map((p) => p.fullName).forEach((n) => console.log(n)); // The property

  // Validation schema example
  const userSchemaValidations = new mongoose.Schema({
    // validations can be done using asynchronous operations if needed!
    // Core functions for validation:
    age: {
      type: Number,
      min: [0, 'Age cannot be negative number! Got {VALUE}'],
      max: [110, 'Some error message...'],
    },

    // Custom error messages are not required.

    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: 'Invalid gender {VALUE}!',
      },
    },

    // Custom functions for validation:
    welcomeDrink: {
      type: String,
      required: function () {
        return this.gender === 'female'; // :D
      },
    },

    phoneNumber: {
      type: Number,
      validate: {
        // It need to return boolean value.
        validator: (v) => /\d{3}-\d{3}-\d{4}/.test(v),
      },
      message: (props) => `${props.value} is not valid number!`,
    },
    required: [true, 'Phone number is required!'],
  });

  const Person = mongoose.model('Person', userSchemaValidations);

  const person = new Person({
    age: -5,
  });

  try {
    await person.save();
  } catch (err) {
    console.error('Caught the error >>>' + err.message);
  }

  const person = new Person({
    gender: 'it',
  });

  try {
    await person.save();
  } catch (err) {
    console.error('Caught the error >>>' + err.message);
  }

  // CRUD

  // Get examples
  const data = await Person.find({ lastName: /s/i }); // RegExp
  const data = await Person.find({ age: { $lt: 20 } }); // Less than
  const data = await Person.find({ age: { $gt: 20 } }); // Grater than
  const data = await Person.find({ age: { $lte: 20 } }); // Less than or equal
  const data = await Person.find({ age: { $gte: 20 } }); // Grater than or equal

  // Put/Patch examples
  await Person.findByIdAndUpdate(id, { $set: { prop: newValue } }, callback);
  // Alternative approach (recommended by mongoose)
  // Here the middleware that will be called 
  // is pre save where the validations are done,
  // using 'findByIdAndUpdate' for example won't 
  // call the 'pre save' middleware, it's called
  // only when using 'save' method
  const person = await Person.findOne({ _id: id });
  person.age++; 
  await person.save();
  // updateOne, updateMany, etc...

  // POST
  const target = await target.save(); // some data

  // Delete
  await Person.findByIdAndUpdate(id, callback); // etc...

  //QUERIES
  const data = await Person.find({ $or: [{ conditionOne: true }, { conditionTwo: true }] })
    .where({ conditionOne: true })
    .or({ conditionTwp: true })
    // Endless conditions chaining
    .exec(callback);

  // Sort and pagination
  const people = await Person.find({}).sort({ age: 1 }).skip(10).limit(10);

  // Creating model population (relation)

 
  await client.disconnect(); // Manually disconnect the database.
})();
