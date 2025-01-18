const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { blogsInDb } = require('./test_helper');

const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blogs');
const User = require('../models/user');

let token;
let userId;

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    });
    const savedUser = await user.save();
    userId = savedUser._id;

    token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: 60*60 }
    );

    const blog = new Blog({
        title: 'Test Blog',
        author: 'Author',
        url: 'http://example.com',
        likes: 5,
        user: userId
    });
    await blog.save();
});

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('amount of blogs is correct', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(response.body.length, 1);  
});

test('should have id property instead of _id', async () => {
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`);
    response.body.forEach(blog => {
        assert(blog.id);
        assert(!blog._id);
    });
});

test('adding a new blog increases the amount of blogs', async () => {
    const newBlog = {
        title: 'New Blog',
        author: 'New Author',
        url: 'http://example.com',
        likes: 10
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(response.body.length, 2);
});

test('blog without likes defaults to 0', async () => {
    const newBlog = {
        title: 'Blog without likes',
        author: 'No Likes Author',
        url: 'http://nolikes.com'
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
});

describe('Creating new blogs', () => {
    test('fails with status 400 if title is missing', async () => {
      const newBlog = {
        author: 'Author Name',
        url: 'https://example.com/blog-url',
        likes: 10,
      };
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
  
    test('fails with status 400 if url is missing', async () => {
      const newBlog = {
        title: 'New Blog Title',
        author: 'Author Name',
        likes: 10,
      };
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });
});

describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
        const blogsAtStart = await blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
        
        const blogsAtEnd = await blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

        const titles = blogsAtEnd.map(r => r.title);
        assert(!titles.includes(blogToDelete.title));
    });

    test('fails with status 401 if token is not provided', async () => {
        const blogsAtStart = await blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401);
        
        const blogsAtEnd = await blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
});


after(async () => {
    await mongoose.connection.close();
});