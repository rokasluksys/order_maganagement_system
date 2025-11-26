const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const logger = require('../utils/logger')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
})

test('2 blogs are returned as JSON', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
})

test('blog id is named id', async () => {
  const blogs = await helper.blogsInDb()

  assert(blogs[0].id)
})

test('POST works', async () => {
  const user = await helper.userCreator()

  const newBlog = {
    title: 'test1',
    author: 'test2',
    url: 'test3',
    likes: 4,
    user: user.id
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', user.token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlogs = await helper.blogsInDb()

  assert.strictEqual(newBlogs.length, helper.initialBlogs.length + 1)

  const titles = newBlogs.map(blog => blog.title)

  assert(titles.includes('test1'))
})

test('POSTing without a token fails', async () => {
  const user = await helper.userCreator()

  const newBlog = {
    title: 'test1',
    author: 'test2',
    url: 'test3',
    likes: 4,
    user: user.id
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const newBlogs = await helper.blogsInDb()

  assert.strictEqual(newBlogs.length, helper.initialBlogs.length)
})

test('likes defaults to 0', async () => {
  const user = await helper.userCreator()

  const newBlog = {
    title: 'test1',
    author: 'test2',
    url: 'test3',
    user: user.id
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', user.token)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()

  assert.strictEqual(blogs[2].likes, 0)
})

test('if title or url is missing status 400 is returned', async () => {
  const user = await helper.userCreator()

  const blogWithoutTitle = {
    author: 'test2',
    url: 'test3',
    likes: 4,
    user: user.id
  }

  const blogWithoutUrl = {
    title: 'test1',
    author: 'test2',
    likes: 4,
    user: user.id
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .set('Authorization', user.token)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .set('Authorization', user.token)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const user = await helper.userCreator()

  const newBlog = {
    title: 'test1',
    author: 'test2',
    url: 'test3',
    likes: 4,
    user: user.id
  }

  const blog = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', user.token)

  const oldBlogs = await helper.blogsInDb()

  await api
    .delete(`/api/blogs/${blog.body.id}`)
    .set('Authorization', user.token)
    .expect(204)

  const newBlogs = await helper.blogsInDb()

  assert.strictEqual(newBlogs.length, oldBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const oldBlogs = await helper.blogsInDb()

  const blogToUpdate = {
    title: oldBlogs[0].title,
    author: oldBlogs[0].author,
    url: oldBlogs[0].url,
    likes: oldBlogs[0].likes + 1,
    id: oldBlogs[0].id
  }

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(updatedBlog.body.likes, oldBlogs[0].likes + 1)

  delete oldBlogs[0].likes
  delete updatedBlog.body.likes

  assert.deepStrictEqual(updatedBlog.body, oldBlogs[0])
})

after(async () => {
  await mongoose.connection.close()
})