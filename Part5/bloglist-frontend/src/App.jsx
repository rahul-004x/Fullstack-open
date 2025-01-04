import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './services/BlogForm'
import Togglable from './services/Togglable'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Login successful', error: false })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }`shaall and be the should bde thei pi 1234567890-=-=90)(*&^%4$##@!:`
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user; //add curent user to the newly created blog
      setBlogs(blogs.concat(returnedBlog))
      setNotification({ message: `A new blog '${blogObject.title}' by ${blogObject.author} added`, error: false })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (error) {
      console.error('Error adding blog:', error)
      setNotification({ message: 'Error adding blog', error: true })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id
        ? { ...blog, ...updatedBlog, user: blog.user }
        : blog
    ))
  }

  const handleRemove = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  // Sort blogs by likes in descending order
  // Alternative syntax: const sortedBlogs = _.orderBy(blogs, ['likes'], ['desc']);
  // import lodash first
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          {notification && <Notification message={notification.message} error={notification.error} />}
          <form onSubmit={handleLogin}>
            <div>
              username:{' '}
              <input
                data-testid='username'
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password:{' '}
              <input
                data-testid='password'
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {notification && <Notification message={notification.message} error={notification.error} />}
          <p>
            {user.name} logged-in{' '}
            <button onClick={handleLogOut}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <div className='blog'>
            {sortedBlogs.map(blog => (
              <Blog 
              key={blog.id} 
              blog={blog} 
              updateBlog={updateBlog} 
              onRemove={handleRemove} 
              currentUser={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
