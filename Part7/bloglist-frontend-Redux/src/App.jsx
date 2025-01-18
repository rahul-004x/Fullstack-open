import React, { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './services/BlogForm'
import Togglable from './services/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationWithType } from './reducers/notificationReducer'
import { initializeBlogs, appendBlog, updateBlog as updateBlogAction, removeBlog } from './reducers/blogReducer'
import { initializeUser, setUser, logout } from './reducers/blogUserReducer'

const App = () => {
  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      dispatch(setUser(user)) // Dispatch setUser with user
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      dispatch(setNotificationWithType('Login successful', 'success'))
    } catch (exception) {
      dispatch(setNotificationWithType('Wrong credentials', 'error'))
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(logout())
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user; //add curent user to the newly created blog
      dispatch(appendBlog(returnedBlog))
      dispatch(setNotificationWithType(`A new blog '${blogObject.title}' by ${blogObject.author} added`, 'success'))
    } catch (error) {
      console.error('Error adding blog:', error)
      dispatch(setNotificationWithType('Error adding blog', 'error'))
    }
  }

  const handleUpdateBlog = (updatedBlog) => {
    dispatch(updateBlogAction(updatedBlog))
  }

  const handleRemove = (id) => {
    dispatch(removeBlog(id))
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
          <Notification />
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
          <Notification />
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
                updateBlog={handleUpdateBlog}
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
