import React, { useState } from 'react';
import blogService from '../services/blogs';
import { Link } from 'react-router-dom';

const Blog = ({ blog, updateBlog, onRemove, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 7,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: likes + 1,
      };

      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setLikes(returnedBlog.likes);
      updateBlog(returnedBlog);
    } catch (error) {
      console.error('Error liking the blog:', error);
      setError('Failed to like the blog. Please try again.');
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onRemove(blog.id)
    }
  };

  const isCreator = currentUser && blog.user && currentUser.username === blog.user.username;
  // console.log(blog.user.username)
  // console.log(currentUser.id)
  // console.log(blog.user.id)
  // console.log(currentUser)

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleDetails}>
          {detailsVisible ? 'Hide' : 'View'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>likes {likes}</div>
          <button onClick={handleLike}>Like</button>
          <div>{blog.user ? blog.user.name : 'Unknown user'}</div>
          {isCreator && (
            <button onClick={handleRemove}>Remove</button>
          )}
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Blog;