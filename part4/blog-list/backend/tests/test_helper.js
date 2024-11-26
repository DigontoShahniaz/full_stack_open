const Blog = require('../models/blog_list')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Hello WOrld",
    author: "Author One",
    url: "http://example.com/first",
    likes: 5
  },
  {
    title: "Testing is hard",
    author: "Author two",
    url: "http://example.com/second",
    likes: 8
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}