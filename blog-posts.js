const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Add a couple of blog posts on server load so you'll automatically have some data to look at when the server starts.
BlogPosts.create('How to do CRUD', 'A complete list of CRUD Instructions', 'John', '1/22/17');
BlogPosts.create('The best StarWars Movie', 'An expose on the Return of the Jedi', 'John', '9/22/10');
BlogPosts.create('Haircuts', 'Something John probably needs to do tomorrow', 'John');

// It should support the four CRUD operations for a blog posts resource.
// GET and POST requests should go to /blog-posts.
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing (${field}) in request body`
      console.log(message);
      return res.status(404).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

// DELETE and PUT requests should go to /blog-posts/:id.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      console.log(message);
      return res.status(404).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
      console.log(message);
      return res.status(400).send(message);
    }
    console.log(`Updating post ${req.params.id}`);
    const updatedPost = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      author: req.body.author
    });
    res.status(204).json(updatedPost);
  });

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  const message = `Deleting blog-post ${req.params.id}`;
  console.log(message);
  res.status(204).end();
});

// Use Express router and modularize routes to /blog-posts.
module.exports = router;
