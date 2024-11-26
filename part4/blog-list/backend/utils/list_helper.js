
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, blog) =>
    blog.likes > (favorite.likes || 0) ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.entries(authorCount).reduce(
    (max, [author, count]) =>
      count > max.count ? { author, count } : max,
    { author: '', count: 0 }
  )

  return {
    author: topAuthor.author,
    blogs: topAuthor.count
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const topAuthor = Object.entries(likesByAuthor).reduce(
    (max, [author, likes]) =>
      likes > max.likes ? { author, likes } : max,
    { author: '', likes: 0 }
  )

  return {
    author: topAuthor.author,
    likes: topAuthor.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}