const Blog = require('../models/blogs');

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'willremovethissoon',
        author: 'willremovethissoon',
        url: 'willremovethissoon',
        likes: 0
    });
    await blog.save();
    await blog.deleteOne();    
    return blog._id.toString();
}

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

module.exports = {
    nonExistingId,
    blogsInDb
}
