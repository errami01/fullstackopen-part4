const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    }
]
const blogsInDB = async()=>{
    const blogs = await Blog.find({})
    return blogs.map(blog=> blog.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
const addTestUser = async()=>{
  await User.deleteOne({username: 'test'})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'test', passwordHash })
    let testUser = await user.save()
    return {
        username: testUser.username,
        id: testUser._id,
    }
    
}
const getTestUser = async()=>{
  const usersInDb = await User.findOne({username: 'test'})
  const userForToken = {
      username: usersInDb.username,
      id: usersInDb.id
  }
  return {
    ...userForToken,
    token: jwt.sign(userForToken, process.env.SECRET)
  }
}

module.exports = {
    initialBlogs,
    blogsInDB, 
    usersInDb,
    addTestUser,
    getTestUser
}
