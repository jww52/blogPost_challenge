const chai = require('chai');
const chaiHttp = require('chai-http');

const{BlogPosts} = require('../models');
const{app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog-posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should get all blog-posts on GET', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.above(0);
      res.body.forEach(function(post) {
        post.should.be.a('object');
        post.should.have.all.keys(
          'title', 'author', 'content', 'id', 'publishDate');
      });
    });
  });

  it('should add a blog-post on POST', function() {
    const newPost= {title: 'Houses', author: 'John', content: 'all kinds of houses', publishDate: 4};
    return chai.request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.all.keys(
          'title', 'author', 'content', 'id', 'publishDate');
      res.body.id.should.not.be.null;
      res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
    });

    it('should update a blog-post on PUT', function() {
      const updatedPost = {
        title: "Cottages",
        author: "John",
        content: "all kinds of houses"
      };
      return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatedPost.id = res.body[0].id;
        return chai.request(app)
        .put(`/blog-posts/${updatedPost.id}`)
        .send(updatedPost);
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updatedPost);
        });
      });

      it('should delete a blog-post on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(){
          return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
        });
      });


});//describe
