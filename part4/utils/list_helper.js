const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : item
  }
  //   console.log(blogs.reduce(reducer, 0))
  return blogs.length === 0 ? {} : blogs.reduce(reducer, { likes: 0 })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return { author: undefined, entries: 1 }
  else if (blogs.length === 1) return { author: blogs[0].author, entries: 1 }
  else {
    const blogsByAuthor = _.groupBy(blogs, 'author')
    const authorEntries = _.map(blogsByAuthor, (blogs, author) => ({
      author,
      entries: blogs.length,
    }))
    // console.log(_.maxBy(authorEntries, 'entries'))
    return _.maxBy(authorEntries, 'entries')
  }
}

const mostBlogsVanilla = (blogs) => {
  if (blogs.length === 0) return { author: undefined, entries: 0 }
  else if (blogs.length === 1) return { author: blogs[0].author, entries: 1 }
  else {
    const groupByAuthor = blogs.reduce((result, item) => {
      if (result[item.author]) {
        result[item.author] += 1
      } else {
        result[item.author] = 1
      }
      return result
    }, {})

    // console.log(groupByAuthor)

    let authorMoreBlogs = ''

    for (const author in groupByAuthor) {
      authorMoreBlogs = authorMoreBlogs === '' ? author : authorMoreBlogs
      if (groupByAuthor[author] > groupByAuthor[authorMoreBlogs]) {
        authorMoreBlogs = author
      }
    }

    // console.log(authorMoreBlogs, '-', groupByAuthor[authorMoreBlogs])
    return {
      author: authorMoreBlogs,
      entries: groupByAuthor[authorMoreBlogs],
    }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return { author: undefined, likes: undefined }
  else if (blogs.length === 1)
    return { author: blogs[0].author, likes: blogs[0].likes }
  else {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const authorLikes = _.mapValues(groupedByAuthor, (entries) =>
      _.sumBy(entries, 'likes')
    )

    const authorWithMostLikes = _.maxBy(
      _.keys(authorLikes),
      (author) => authorLikes[author]
    )

    return {
      author: authorWithMostLikes,
      likes: authorLikes[authorWithMostLikes],
    }
  }
}

const mostLikesVanilla = (blogs) => {
  if (blogs.length === 0) return { author: undefined, likes: undefined }
  else if (blogs.length === 1)
    return { author: blogs[0].author, likes: blogs[0].likes }
  else {
    const groupByAuthor = blogs.reduce((result, item) => {
      if (result[item.author]) {
        result[item.author] += item.likes
      } else {
        result[item.author] = item.likes
      }
      return result
    }, {})

    // console.log(groupByAuthor)

    let authorMoreLikes = ''

    for (const author in groupByAuthor) {
      authorMoreLikes = authorMoreLikes === '' ? author : authorMoreLikes
      if (groupByAuthor[author] > groupByAuthor[authorMoreLikes]) {
        authorMoreLikes = author
      }
    }

    return {
      author: authorMoreLikes,
      likes: groupByAuthor[authorMoreLikes],
    }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  mostBlogsVanilla,
  mostLikesVanilla,
}
