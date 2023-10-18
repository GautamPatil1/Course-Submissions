const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Cinco ecuaciones que cambiaron el mundo',
    author: 'A. Pacheco',
    url: 'https://unlibroenmimochila.blogspot.com/2018/02/cinco-ecuaciones-que-cambiaron-el-mundo.html',
    likes: 2,
  },
  {
    title: 'El tortuoso camino de la justicia transicional',
    author: 'Rafael Rojas',
    url: 'https://www.librosdelcrepusculo.com.mx/2023/09/el-tortuoso-camino-de-la-justicia.html',
    likes: 1,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'test title1',
    author: 'test author 1',
    url: 'test url',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
