import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import Blog from './Blog';
import blogService from '../services/blogs';

vi.mock('../services/blogs');


test('<Blog/> renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'React testing with vitest',
    author: 'Rahul Yadav',
    url: 'www.rahul/dev.com',
    likes: 20,
  };

  render(<Blog blog={blog} />);

  const titleAuthor = screen.getByText('React testing with vitest Rahul Yadav');
  expect(titleAuthor).toBeInTheDocument();

  expect(screen.queryByText('www.rahul/dev.com')).not.toBeInTheDocument();
  expect(screen.queryByText('likes 20')).not.toBeInTheDocument();
});

test('<Blog/> renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'React testing with vitest',
    author: 'Rahul Yadav',
    url: 'www.rahul/dev.com',
    likes: 20,
  };

  render(<Blog blog={blog} />);

  const titleAuthor = screen.getByText('React testing with vitest Rahul Yadav');
  expect(titleAuthor).toBeInTheDocument();

  expect(screen.queryByText('www.rahul/dev.com')).not.toBeInTheDocument();
  expect(screen.queryByText('likes 20')).not.toBeInTheDocument();
});

test('if like button clicked twice, the event handler is called twice', async () => {
  const blog = {
    id: '12345',
    title: 'React testing with vitest',
    author: 'Rahul Yadav',
    url: 'www.rahul/dev.com',
    likes: 12,
    user: { name: 'rahul' }
  };

  const mockUpdateBlog = vi.fn();
  let currentLikes = blog.likes;

  blogService.update.mockImplementation(async (id, updatedBlog) => {
    currentLikes += 1;
    return { ...updatedBlog, likes: currentLikes };
  });

  render(<Blog blog={blog} updateBlog={mockUpdateBlog} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('View');
  await user.click(viewButton);

  const likeButton = screen.getByText('Like');
  await user.click(likeButton);
  await user.click(likeButton);

  // expect(blogService.update).toHaveBeenCalledTimes(2);
  // expect(blogService.update).toHaveBeenNthCalledWith(1, blog.id, { ...blog, likes: 13 });
  // expect(blogService.update).toHaveBeenNthCalledWith(2, blog.id, { ...blog, likes: 14 });
  // expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
  expect(mockUpdateBlog.mock.calls).toHaveLength(2);
  // expect(mockUpdateBlog).toHaveBeenNthCalledWith(1, { ...blog, likes: 13 });
  // expect(mockUpdateBlog).toHaveBeenNthCalledWith(2, { ...blog, likes: 14 });
});