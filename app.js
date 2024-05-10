const express = require('express')
const app = express()
// const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

// app.use(cors())
app.use(express.json())
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
  })
app.use('/api/blogs', blogsRouter)
module.exports = app