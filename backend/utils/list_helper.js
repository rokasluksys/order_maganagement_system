const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const blogsLikes = blogs.map(blog => blog.likes)

  return blogsLikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {  
  if (!Array.isArray(blogs) || blogs.length === 0) return undefined

  const blogsLikes = blogs.map(blog => blog.likes)

  const mostLikesIndex = blogsLikes.findIndex(blog => blog === Math.max(...blogsLikes))

  const mostLikedBlog = blogs[mostLikesIndex]
  
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return undefined

  const blogsAuthors = blogs.map(blog => blog.author)

  const authorsAndCount = _.countBy(blogsAuthors)

  const maxEntry = _.maxBy(Object.entries(authorsAndCount), ([name, count]) => count)

  return {
    author: maxEntry[0],
    blogs: maxEntry[1]
  }
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return undefined

  const likesPerAuthor ={}

  blogs.forEach(blog => {
    if (likesPerAuthor[blog.author]) {
      likesPerAuthor[blog.author] += blog.likes
    } else {
      likesPerAuthor[blog.author] = blog.likes
    }
  })

  const maxEntry = _.maxBy(Object.entries(likesPerAuthor), ([name, count]) => count)

  return {
    author: maxEntry[0],
    likes: maxEntry[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}