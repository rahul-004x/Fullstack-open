const _ = require('lodash');

const dummy = (blogs) => {
    if (blogs.length === 0) {return 1}
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    return blogs.reduce((max, blog) => {
        return (max.likes > blog.likes) ? max : blog;
    }, blogs[0]);
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const authorBlogCount = _.countBy(blogs, 'author');
    console.log(authorBlogCount)

    const topAuthor = _.maxBy(
        Object.keys(authorBlogCount).map(author => ({ author, blogs: authorBlogCount[author] })),
        'blogs'
    );
    console.log('Top Author:', topAuthor);

    return topAuthor;
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    const likesByAuthor = _.groupBy(blogs, 'author');
    const authorWithMostLikes = _.maxBy(
        Object.keys(likesByAuthor).map(author => ({ author, likes: _.sumBy(likesByAuthor[author], 'likes') })),
        'likes'
    );

    return authorWithMostLikes;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}   
