// list_helper.test.js
const mongoose = require('mongoose')
const Blog = require('../models/blog_list')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog 
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const blogs = [
  {
    _id: '1',
    title: 'First Blog',
    author: 'Author One',
    url: 'http://example.com/first',
    likes: 5,
    __v: 0
  },
  {
    _id: '2',
    title: 'Second Blog',
    author: 'Author Two',
    url: 'http://example.com/second',
    likes: 10,
    __v: 0
  },
  {
    _id: '3',
    title: 'Third Blog',
    author: 'Author One',
    url: 'http://example.com/third',
    likes: 7,
    __v: 0
  },
  {
    _id: '4',
    title: 'Fourth Blog',
    author: 'Author Three',
    url: 'http://example.com/fourth',
    likes: 2,
    __v: 0
  },
  {
    _id: '5',
    title: 'Fifth Blog',
    author: 'Author Two',
    url: 'http://example.com/fifth',
    likes: 3,
    __v: 0
  }
]

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test.only('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username must be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('request returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog posts have a unique identifier property named id', async () => {
    const response = await api.get('/api/blogs')
  
    response.body.forEach(blog => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Test Blog',
        author: 'Test Author',
        url: 'http://example.com/test',
        likes: 12
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('New Test Blog'))
    })
  })

  test('defaults likes to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'No Likes Author',
      url: 'http://example.com/nolikes'
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.likes, 0)
  })  

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://example.com/notitle',
      likes: 4
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
  
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  
      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))
    })
  })  

  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
  
      const updatedData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }
  
      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })
  
    test('fails with status code 400 if data is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
  
      const invalidData = {
        author: 'asas',
        url: blogToUpdate.url,
        likes: blogToUpdate.likes,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(invalidData)
        .expect(400)
    })
  })
})

test('of dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = totalLikes(blogs)
    assert.strictEqual(result, 27)
  })

  test('when list is empty, equals zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
})


describe('favorite blog', () => {
  test('finds the blog with most likes', () => {
    const result = favoriteBlog(blogs)
    console.log(result)
    assert.deepStrictEqual(result, {
      _id: '2',
      title: 'Second Blog',
      author: 'Author Two',
      url: 'http://example.com/second',
      likes: 10,
      __v: 0
    })
  })

  test('when list is empty, returns null', () => {
    const result = favoriteBlog([]);
    assert.strictEqual(result, null);
  })
})

describe('most blogs', () => {
  test('author with the most blogs when list is not empty', () => {
    const result = mostBlogs(blogs)
    console.log(result)
    assert.deepStrictEqual(result, { author: 'Author One', blogs: 2 })
  })

  test('when list is empty, should return null', () => {
    const result = mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('most likes', () => {
  test('author with the most likes when list is not empty', () => {
    const result = mostLikes(blogs)
    console.log(result)
    assert.deepStrictEqual(result, { author: 'Author Two', likes: 13 })
  })

  test('when list is empty, should return null', () => {
    const result = mostLikes([])
    assert.strictEqual(result, null)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})