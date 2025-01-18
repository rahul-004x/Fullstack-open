import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
      likes: Number(likes) || 0
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <div className='blog-form' >
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            data-testid='title'
            id="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            data-testid='author'
            id="author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            data-testid='url'
            id="url"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="likes">likes:</label>
          <input
            data-testid='likes'
            id="likes"
            type='number'
            min='0'
            step='1'
            value={likes}
            onChange={event => setLikes(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm