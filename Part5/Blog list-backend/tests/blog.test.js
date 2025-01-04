const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
      }
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    const biggerList = [
        {
            title: "Test Blog",
            author: "Test Author",
            url: "http://testblog.com",
            likes: 7
          },
          {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
          },
          {
            title: 'Go To Statement Considered Useful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68',
            likes: 10,
          }     
    ]   
    test('when list has multiple blogs, total the likes of that', () => {
        const result = listHelper.totalLikes(biggerList)
        assert.strictEqual(result, 22)
      })
    test('find the favorite blog', () => {
        const result = listHelper.favoriteBlog(biggerList)
        const expectedFavorite = {
            title: "Go To Statement Considered Useful",
            author: "Edsger W. Dijkstra",
            url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68",
            likes: 10
        }
        assert.deepStrictEqual(result, expectedFavorite)
    })
    test('find the author with the most blogs', () => {
        const result = listHelper.mostBlogs(biggerList)
        const expectedMostBlogs = {
            author: "Edsger W. Dijkstra",
            blogs: 2
        }
        assert.deepStrictEqual(result, expectedMostBlogs)
    })  
    test('find the author with the most likes', () => {
        const result = listHelper.mostLikes(biggerList)
        const expectedMostLikes = {
            author: "Edsger W. Dijkstra",
            likes: 15
        }
        assert.deepStrictEqual(result, expectedMostLikes)
    })  

    const listWithNoBlogs = []
    test('when list has no blogs, equals zero', () => {
        const result = listHelper.totalLikes(listWithNoBlogs)
        assert.strictEqual(result, 0)
      })
  })
