import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const UserView = () => {
  const id = useParams().id
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getById(id),
    retry: 1,
    onError: (error) => {
      console.error('Error fetching user:', error)
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !user) {
    return <div>User not found</div>
  }

  if (!user.blogs || user.blogs.length === 0) {
    return (
      <div>
        <h2>{user.name}</h2>
        <p>No blogs added yet</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView