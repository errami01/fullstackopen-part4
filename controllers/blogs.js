const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{blogs:0})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response, next) => {
  const user = await User.findById(request.body.userId)
  const blog = new Blog({
    ...request.body,
    user: user.id,
    likes: request.body.likes || 0
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})
blogsRouter.delete('/:id', async(request, response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
blogsRouter.put('/:id', async(request, response)=>{
  const body = request.body
  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, body, {new: true})
  response.json(updatedNote)
})
module.exports = blogsRouter