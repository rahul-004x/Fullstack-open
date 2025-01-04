const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {    
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => { 
    const { title, author, url, likes } = request.body;
    const user = request.user; 
    console.log(user);

    if (!title || !url) {
        return response.status(400).json({ error: 'title and url are required' });
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});
    
blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id',middleware.userExtractor, async (request, response) => {
    const { likes } = request.body

    if (likes === undefined) {
        return response.status(400).json({ error: 'likes are required' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        { likes }, 
        { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedBlog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    
    response.json(updatedBlog)
})  

module.exports = blogsRouter