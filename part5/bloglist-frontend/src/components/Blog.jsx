import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    try {
      const updatedBlog = { 
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      updateBlog(returnedBlog)
    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }
  
  

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${blog.title}"?`)
    if (confirmDelete) {
      try {
        await blogService.remove(blog.id)
        removeBlog(blog.id)
      } catch (error) {
        console.error('Error deleting the blog:', error)
      }
    }
  }
  
  return (
    <div className="blog" style={blogStyle}>
    <div data-testid={blog.title}>{blog.title} by {blog.author}</div>
      <button onClick={toggleDetails} data-testid='view'>{detailsVisible ? 'hide' : 'view'}</button>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p data-testid="like-button">Likes: <span>{blog.likes}</span> <button onClick={handleLike}>Like</button></p>
          <p>Added by: {blog.user.name}</p>
          {user && blog.user.username === user.username && (
            <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
