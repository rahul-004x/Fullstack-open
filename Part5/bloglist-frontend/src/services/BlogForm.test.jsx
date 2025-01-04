import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('<BlogForm/> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const likesInput = screen.getByLabelText('likes:')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form')
  await user.type(authorInput, 'Rahul Yadav')
  await user.type(urlInput, 'www.rahul/dev.com')
  await user.type(likesInput, '20')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'testing a form',
    author: 'Rahul Yadav',
    url: 'www.rahul/dev.com',
    likes: 20
  })
})