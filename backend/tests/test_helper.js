const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [{
  title: 'Rokas is the best',
  author: 'Rokas',
  url: 'www.goated.com',
  likes: 9999999999
},
{
  title: 'I love fishing',
  author: 'Fischer Mann',
  url: 'http://fish.pl/i_love_fish.html',
  likes: 25561
}]

const userCreator = async () => {
  const username = 'TEST'
  const password = 'TEST'

  const userCreated = await api
    .post('/api/users')
    .send({username, password})

  const userLoggedIn = await api
    .post('/api/login')
    .send({username, password})

  const user = {
    username,
    password,
    token: `Bearer ${userLoggedIn.body.token}`,
    id: userCreated.body.id
  }

  return user
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  userCreator,
  blogsInDb,
  usersInDb
}