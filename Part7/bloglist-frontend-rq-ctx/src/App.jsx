import React, { useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import userService from './services/users'
import { useNotification } from './context/notification-ctx'
import { useUser } from './context/user-ctx'
import { useNavigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import BlogsPage from './components/BlogsPage'

const App = () => {
  const [user, userDispatch] = useUser()
  const [notification, dispatch] = useNotification()
  const blogFormRef = useRef()
  const navigate = useNavigate()

  const notify = (message, isError = false) => {
    dispatch({ type: isError ? 'error' : 'success', payload: message })
    setTimeout(() => {
      dispatch({ type: 'clear' })
    }, 3000)
  }

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1
  })

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onMutate: async (updatedBlog) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] })

      const previousBlogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], oldBlogs =>
        oldBlogs.map(blog =>
          blog.id === updatedBlog.id
            ? { ...blog, ...updatedBlog, user: blog.user }
            : blog
        )
      )

      return { previousBlogs }
    },
    onError: (err, updatedBlog, context) => {
      queryClient.setQueryData(['blogs'], context.previousBlogs)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
      navigate('/')
    }
  }, [])

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogUser')
    userDispatch({ type: 'CLEAR_USER' })
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      newBlogMutation.mutate(blogObject)
      notify(`A new blog '${blogObject.title}' by ${blogObject.author} added`)
    } catch (error) {
      console.error('Error adding blog:', error)
      notify('Error adding blog', true)
    }
  }

  const updateBlog = (updatedBlog) => {
    updateBlogMutation.mutate(updatedBlog)
  }

  const removeMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] })
      const previousBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], oldBlogs =>
        oldBlogs.filter(blog => blog.id !== id)
      )
      return { previousBlogs }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['blogs'], context.previousBlogs)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleRemove = (blog) => {
    removeMutation.mutate(blog)
  }

  return (
    <div>
      {user === null ? (
        <LoginPage 
          userDispatch={userDispatch}
          notify={notify}
          notification={notification}
        />
      ) : (
        <BlogsPage
          user={user}
          notification={notification}
          handleLogOut={handleLogOut}
          blogs={blogs}
          updateBlog={updateBlog}
          handleRemove={handleRemove}
          addBlog={addBlog}
          blogFormRef={blogFormRef}
          users={users}
        />
      )}
    </div>
  )
}

export default App