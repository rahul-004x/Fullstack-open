import React from 'react'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  // the destructing {data: users, isLoading} renames the data property to user and extract the isLoading state
  // react query is used because of refresh users when new blog is created
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
  // console.log(users)
  // Shows loading state while data is being fetched
  if (isLoading || !users) {
    return <div>Loading users...</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <table style={{ borderCollapse: "collapse", width: "30%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {user.blogs.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users