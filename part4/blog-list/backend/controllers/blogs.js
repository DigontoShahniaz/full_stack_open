const blogsRouter = require('express').Router()
const Blog = require('../models/blog_list')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async(request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  //await Blog.findByIdAndDelete(request.params.id)
  //response.status(204).end()
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const { user } = request
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'unauthorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: 'malformatted id or error deleting' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const { user } = request // Get user from request object

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    response.status(500).json({ error: 'internal server error' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url || !body.likes) {
      return response.status(400).json({ error: 'Title, URL, and likes are required' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title: body.title, author: body.author, url: body.url, likes: body.likes },
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
})

module.exports = blogsRouter