
import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Togglable from '../services/Togglable'
import BlogForm from '../services/BlogForm'
import Blog from './Blog'
import Users from '../routes/users'
import UserView from '../routes/UserView'
import BlogView from '../routes/blogView'
import Notification from './Notification'

const BlogList = ({ blogs, updateBlog, handleRemove, user }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  
  return (
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
  )
}

const BlogsPage = ({ user, notification, handleLogOut, blogs, updateBlog, handleRemove, addBlog, blogFormRef, users }) => {
  return (
    <div>
      <nav>
        <Link to="/">blogs</Link> |{' '}
        <Link to="/users">users</Link>
      </nav>
      <h2>blogs</h2>
      {notification && <Notification message={notification.message} error={notification.error} />}
      <p>
        {user.name} logged-in{' '}
        <button onClick={handleLogOut}>logout</button>
      </p>
      <Routes>
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/" element={
          <>
            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            <BlogList 
              blogs={blogs}
              updateBlog={updateBlog}
              handleRemove={handleRemove}
              user={user}
            />
          </>
        } />
      </Routes>
    </div>
  )
}

export default BlogsPage