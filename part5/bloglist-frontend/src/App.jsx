import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isError, setIsError] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setIsError(false)
      setMessage('Logged in successfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setIsError(true)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      } catch (error) {
        setIsError(true)
        setMessage('An error occurred while getting the data from the server')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setIsError(false)
      setMessage(`Blog "${returnedBlog.title}" by ${returnedBlog.author} added successfully!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setIsError(true)
      setMessage('Failed to add the blog. Please try again.')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <h1>Blog Application</h1>
          <p>Please log in to continue</p>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    setIsError(false)
    setMessage('Logout successful')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    window.localStorage.removeItem('loggedBlogAppUser')
    window.localStorage.clear()
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog)))
  }

  const removeBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
    setIsError(false)
    setMessage('Blog deleted successfully.')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      <Notification message={message} isError={isError}/>

      {!user && loginForm()}
      {
      user && <div>
       <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
       <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      </div>
      }

      <h3>Blogs</h3>
      {blogs.map(blog => (<Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} /> ))}
    </div>
  )
}

export default App