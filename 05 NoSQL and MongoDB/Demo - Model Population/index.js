// Population Definition

/* Population is the process of automatically replacing
the specified paths in the record with document/s from
other collections. We may populate a single document,
multiple documents, plan object, multiple plan objects,
or all objects returned from a query. */

const mongoose = require('mongoose'),
  Person = require('./models/person'),
  Article = require('./models/article'),
  Comment = require('./models/comment'),
  connectionString = 'mongodb://localhost:27017/demoDB';

(async () => {
  const client = await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Database connected...');

  const person = await Person.findOne({});

  /*   Creating a test article   

    const article = new Article({
    author: person,
    title: 'New article',
    content: 'This is article content.',
  });

  await article.save();
  */

  const article = await Article.findOne({});

  /* 
  {         Article:
   _id: 60ba38ad2454ca150893b61d,      
   author: 60ba3497e031961ec01eeda3,   
   title: 'New article',
   content: 'This is article content.',
   __v: 0
} 
*/

  const authorDetails = await Article.findOne({}).populate('author');

  /* 
   {       Author is populated
      _id: 60ba38ad2454ca150893b61d,  
      author: {
         _id: 60ba3497e031961ec01eeda3,
         age: 25,
         name: 'Isabella',
         gender: 'female',
         __v: 0
  },
  title: 'New article',
  content: 'This is article content.',
  __v: 0
}
*/

  // This is a 'live record' so if changes are done to it
  // and then saved, the data will be updated in the database
  // but that doesn't applies to the author!

  // Comments
  const comment = new Comment({
    article,
    author: article.author,
    content: 'First comment',
  });

  await comment.save();

  article.comments.push(comment);

  await article.save();

  // Nested population
  const commentAuthor = await Article.findOne({}).populate('author').populate({
    path: 'comments',
    populate: 'author',
  });
})();
