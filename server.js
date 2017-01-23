const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPosts = require('./blog-posts');

// log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPosts);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
