import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import blogServices from '../services/blogs'
import { useState } from "react";

const BlogView = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogServices.getById(id),
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => blogServices.comments(id)
  })
  
  // console.log('Comments data:', comments)

  const addCommentMutation = useMutation({
    mutationFn: ({ id, content }) => blogServices.addComment(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id])
      setNewComment('')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogServices.update(updatedBlog.id, updatedBlog),
    onMutate: async (updatedBlog) => {
      await queryClient.cancelQueries({ queryKey: ['blogs', id] })

      const previousBlog = queryClient.getQueryData(['blogs', id])

      queryClient.setQueryData(['blogs', id], {
        ...previousBlog,
        ...updatedBlog
      })

      return { previousBlog }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['blogs', id], context.previousBlog)
      console.error('Error updating blog:', err)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['blogs', id])
    }
  })

  if(isLoading || commentsLoading){
    return <div>Loading...</div>
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ id, content: newComment })
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <div>{blog.likes} likes</div>
        <button onClick={handleLike} style={{ marginLeft: '10px' }}>Like</button>
      </div>
      <p>added by {blog.author}</p>

      <div style={{ marginTop: '20px' }}>
        <h2>comments</h2>
        <form onSubmit={handleAddComment}>
          <input
            required
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Add Comment</button>
        </form>
        <ul>
          {comments && [...comments].reverse().map((comment) => (
            <li key={comment._id}>
              {comment.content}
              {comment.timeStamp && (
                <small style={{ marginLeft: '10px', color: 'grey' }}>
                  {new Date(comment.timeStamp).toLocaleString()}
                </small>
              )}
            </li>  
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView
