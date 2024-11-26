const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

describe('Blog creation tests with token authentication', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    // Create a user
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    // Generate a token for the user
    const userForToken = { username: 'testuser', id: user._id }
    token = jwt.sign(userForToken, process.env.SECRET)
  })

  test('Succeeds with status 201 when a valid token is provided', async () => {
    const newBlog = {
      title: 'A New Blog Post',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 5,
    }

    // Send the blog creation request with a valid token
    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)  // Expect status code 201 for created resource

    // Check that the blog has been added to the database
    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(1)
    expect(blogsAtEnd[0].title).toBe(newBlog.title)
  })

  test('Fails with status 401 if no token is provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog Post',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 3,
    }

    // Send the blog creation request without any token
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)  // Expect status code 401 for Unauthorized

    // Check that no blog has been added to the database
    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(0)
  })

  test('Fails with status 401 if invalid token is provided', async () => {
    const newBlog = {
      title: 'Blog Post with Invalid Token',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 2,
    }

    const invalidToken = 'invalidtoken123'

    // Send the blog creation request with an invalid token
    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(newBlog)
      .expect(401)  // Expect status code 401 for Unauthorized

    // Check that no blog has been added to the database
    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd.length).toBe(0)
  })
})

after(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await mongoose.connection.close()
})
